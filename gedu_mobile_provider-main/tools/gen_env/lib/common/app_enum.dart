import 'dart:io';

import 'flavor_enum.dart';

enum App {
  appHost(
    path: 'app_host',
    displayName: 'DrAnywhere',
    supportUat: false,
  ),
  daCare(
    path: 'da_care',
    displayName: 'DA Care',
  ),
  gel(
    path: 'ge_care',
    displayName: 'GE',
  ),
  geShield(
    path: 'ge_shield',
    displayName: 'GE Shield',
  ),
  aon(
    path: 'aon_care',
    displayName: 'AON',
  ),
  hsbc(
    path: 'medical_claims_hub',
    displayName: 'HSBC Life',
  ),
  lockton(
    path: 'lockton_care',
    displayName: 'Lockton',
  ),
  income(
    path: 'income_care',
    displayName: 'Income',
  ),
  ;

  const App({
    required this.path,
    required this.displayName,
    this.supportUat = true,
  });

  final String path;
  final String displayName;
  final bool supportUat;
}

extension AppExt on App {
  String getMainPath(FlavorEnum flavor) {
    return '\$PROJECT_DIR\$/apps/$path/lib/main_${flavor.name}.dart';
  }

  bool get appExist {
    final appDirectory = Directory('./apps/$path/');
    return appDirectory.existsSync();
  }
}
