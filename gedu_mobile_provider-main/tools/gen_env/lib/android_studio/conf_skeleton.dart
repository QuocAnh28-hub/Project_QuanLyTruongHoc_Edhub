const workspaceSkeleton = '''<?xml version="1.0" encoding="UTF-8"?>
<project>
  $runManagerSkeleton
</project>''';

const runManagerSkeleton = '''<component name="RunManager"/>''';

const runConfigSkeletonXml =
'''<configuration name="Debug dev" type="FlutterRunConfigurationType" factoryName="Flutter">
  <option name="additionalArgs" value="" />
  <option name="buildFlavor" value="dev" />
  <option name="filePath" value="\$PROJECT_DIR\$/apps/app_host/lib/main_dev.dart" />
  <method v="2" />
</configuration>''';

const makeConfigSkeletonXml =
'''<configuration name="Make Sync" type="MAKEFILE_TARGET_RUN_CONFIGURATION" factoryName="Makefile">
  <makefile filename="\$PROJECT_DIR\$/makefile" target="sync" workingDirectory="" arguments="">
  <envs />
  </makefile>
  <method v="2" />
</configuration>''';
