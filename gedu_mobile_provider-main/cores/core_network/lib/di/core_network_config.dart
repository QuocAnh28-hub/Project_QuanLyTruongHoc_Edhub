import 'package:lib_base/lib_base.dart';
import 'di.dart' as di;

class CoreNetworkConfig extends Config {
  factory CoreNetworkConfig.getInstance() {
    return _instance;
  }

  CoreNetworkConfig._();

  static final CoreNetworkConfig _instance = CoreNetworkConfig._();

  @override
  Future<void> config() async {
    // Initialize the DI
    // Note: NetworkConfig and AppPreferences must be registered by the app before calling this
    await di.configureInjection();
  }
}
