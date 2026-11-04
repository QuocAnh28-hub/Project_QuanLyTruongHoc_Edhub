import 'package:lib_base/lib_base.dart';

/// Dependency injection configuration for core_auth module
class CoreAuthDiConfig extends Config {
  factory CoreAuthDiConfig.getInstance() {
    return _instance;
  }

  CoreAuthDiConfig._();

  static final CoreAuthDiConfig _instance = CoreAuthDiConfig._();

  @override
  Future<void> config() async {
    // Initialize core_auth module DI
    await configureInjection();
  }
}
