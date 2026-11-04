import 'dart:developer';
import 'dart:io';

import 'package:collection/collection.dart';
import 'package:xml/xml.dart';

import '../common/app_enum.dart';
import '../common/constants.dart';
import '../common/flavor_enum.dart';
import 'conf_skeleton.dart';

final List<String> flutterCommands = [
  'run',
  'release',
  'profile',
];

final List<String> makefileCommands = [
  'gen_as_config',
  'sync',
  'gen_localize',
];

class AndroidStudioEnvGenerator {
  AndroidStudioEnvGenerator();

  void call() {
    try {
      final settingsFile = File(workspaceXmlPath);
      if (!settingsFile.existsSync()) {
        settingsFile.createSync(recursive: true);
        settingsFile.writeAsStringSync(workspaceSkeleton);
      }
      ConfigXmlWriter(
        filePath: workspaceXmlPath,
      ).call();
    } on FormatException catch (e) {
      log('Error: The content of $workspaceXmlPath not a valid XML format $e');
    } on FileSystemException catch (e) {
      log('Error: $workspaceXmlPath does not exist!\n$e');
    }
  }
}

class ConfigXmlWriter {
  final String filePath;

  ConfigXmlWriter({
    required this.filePath,
  });

  void call() {
    final mandatoryFile = File(filePath);
    mandatoryFile
        .writeAsStringSync(writeConfig(mandatoryFile.readAsStringSync()));
  }

  String writeConfig(String fileContent) {
    final XmlDocument document = XmlDocument.parse(fileContent);
    validateConfFile(document);
    final runConfRootElement = document
        .findAllElements('component')
        .firstWhereOrNull(
            (element) => element.getAttribute('name') == 'RunManager');
    if (runConfRootElement == null) {
      throw FormatException;
    }

    for (var app in App.values) {
      if (!app.appExist) {
        continue;
      }
      for (var command in flutterCommands) {
        for (var element in FlavorEnum.values) {
          addOrReplaceConf(
              runConfRootElement,
              createRunConf(
                config: command,
                flavor: element,
                app: app,
              ));
        }
      }
    }

    for (var command in makefileCommands) {
      addOrReplaceConf(runConfRootElement, createMakeConf(target: command));
    }

    return document.toXmlString(pretty: true, indent: '\t');
  }

  void validateConfFile(XmlDocument document) {
    XmlElement? runConfRootElement = document
        .findAllElements('component')
        .firstWhereOrNull(
            (element) => element.getAttribute('name') == 'RunManager');
    if (runConfRootElement == null) {
      final projectRootElements = document.findAllElements('project');
      if (projectRootElements.isEmpty) {
        throw FormatException;
      }
      final XmlNode runManagerElement =
          createElementFromSkeleton(runManagerSkeleton);
      projectRootElements.first.children.add(runManagerElement);

      runConfRootElement = document
          .findAllElements('component')
          .firstWhereOrNull(
              (element) => element.getAttribute('name') == 'RunManager');
    }
  }

  XmlNode createRunConf({
    required String config,
    required FlavorEnum flavor,
    required App app,
  }) {
    final XmlNode newRunConfElement =
        createElementFromSkeleton(runConfigSkeletonXml);

    final flavorName =
        (flavor == FlavorEnum.dev && app.supportUat) ? 'uat' : flavor.name;

    newRunConfElement.setAttribute(
        'name', '${app.displayName} $config $flavorName');
    final buildFlavorElement = newRunConfElement.childElements
        .firstWhere((element) => element.getAttribute('name') == 'buildFlavor');
    buildFlavorElement.setAttribute('value', flavor.name);
    final dartDefinesElement = newRunConfElement.childElements.firstWhere(
        (element) => element.getAttribute('name') == 'additionalArgs');
    dartDefinesElement.setAttribute(
        'value', getAdditionalArgs(command: config, flavor: flavor.name));
    final filePathElement = newRunConfElement.childElements
        .firstWhere((element) => element.getAttribute('name') == 'filePath');
    filePathElement.setAttribute('value', app.getMainPath(flavor));
    return newRunConfElement;
  }

  XmlNode createMakeConf({required String target}) {
    final XmlNode newMakeConfElement =
        createElementFromSkeleton(makeConfigSkeletonXml);
    newMakeConfElement.setAttribute('name', 'make $target');
    final targetElement = newMakeConfElement.findAllElements('makefile').first;
    targetElement.setAttribute('target', target);
    return newMakeConfElement;
  }

  XmlNode createElementFromSkeleton(String skeleton) {
    final element = XmlDocument.parse(skeleton).firstChild?.copy();
    if (element == null) {
      throw FormatException;
    }
    return element;
  }

  String getAdditionalArgs({
    required String flavor,
    String? command,
  }) {
    final StringBuffer buffer = StringBuffer();
    if (command != null && !command.contains('run')) {
      buffer.write('--$command ');
    }
    buffer.write('--dart-define-from-file=config/${flavor}_config.json');
    return buffer.toString();
  }

  void addOrReplaceConf(XmlElement rootElement, XmlNode newConf) {
    final existingElement = rootElement.children.firstWhereOrNull((element) =>
        element.getAttribute('name') == newConf.getAttribute('name'));
    if (existingElement != null) {
      rootElement.children.remove(existingElement);
    }
    rootElement.children.add(newConf);
  }
}
