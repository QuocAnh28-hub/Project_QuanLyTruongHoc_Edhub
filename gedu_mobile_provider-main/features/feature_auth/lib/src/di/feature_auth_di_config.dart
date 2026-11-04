import 'package:lib_base/lib_base.dart';

import 'di.dart';

/// Dependency injection configuration for feature_auth module
class FeatureAuthDiConfig extends Config {
  factory FeatureAuthDiConfig.getInstance() {
    return _instance;
  }

  FeatureAuthDiConfig._();

  static final FeatureAuthDiConfig _instance = FeatureAuthDiConfig._();

  @override
  Future<void> config() async {
    // Initialize feature_auth module DI
    await configureFeatureAuthInjection();
  }
}
