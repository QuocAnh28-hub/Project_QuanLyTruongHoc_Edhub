import 'package:lib_base/lib_base.dart';

import 'di.dart';

/// Dependency injection configuration for feature_home module
class FeatureHomeDiConfig extends Config {
  factory FeatureHomeDiConfig.getInstance() {
    return _instance;
  }

  FeatureHomeDiConfig._();

  static final FeatureHomeDiConfig _instance = FeatureHomeDiConfig._();

  @override
  Future<void> config() async {
    // Initialize feature_home module DI
    await configureFeatureHomeInjection();
  }
}
