import 'package:lib_base/lib_base.dart';
import 'di.dart' as di;

import '../app_preferences.dart';

class CoreStorageConfig extends Config {
  factory CoreStorageConfig.getInstance() {
    return _instance;
  }

  CoreStorageConfig._();

  static final CoreStorageConfig _instance = CoreStorageConfig._();

  @override
  Future<void> config() async {
    // Initialize the DI
    await di.configureInjection();

    // Initialize AppPreferences
    await _initializeAppPreferences();
  }

  Future<void> _initializeAppPreferences() async {
    try {
      // Get AppPreferences instance and initialize it
      final appPreferences = di.getIt.get<AppPreferences>();
      await appPreferences.init();
      Log.d('CoreStorage: AppPreferences initialized successfully');
    } catch (e) {
      Log.e('CoreStorage: Failed to initialize AppPreferences: $e');
      rethrow;
    }
  }
}
