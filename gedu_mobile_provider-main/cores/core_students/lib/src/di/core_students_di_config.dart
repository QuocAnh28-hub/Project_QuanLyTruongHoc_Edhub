import 'package:lib_base/lib_base.dart';

import 'di.dart';

/// Dependency injection configuration for core_students module
class CoreStudentsDiConfig extends Config {
  factory CoreStudentsDiConfig.getInstance() {
    return _instance;
  }

  CoreStudentsDiConfig._();

  static final CoreStudentsDiConfig _instance = CoreStudentsDiConfig._();

  @override
  Future<void> config() async {
    // Initialize core_students module DI
    await configureCoreStudentsInjection();
  }
}
