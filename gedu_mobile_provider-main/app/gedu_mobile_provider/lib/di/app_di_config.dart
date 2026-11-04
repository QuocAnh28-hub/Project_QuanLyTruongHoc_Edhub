import 'package:core_auth/core_auth.dart' as core_auth;
import 'package:core_network/core_network.dart' as core_network;
import 'package:core_storage/core_storage.dart' as core_storage;
import 'package:core_students/core_students.dart' as core_students;
import 'package:lib_base/lib_base.dart';
import 'package:feature_auth/feature_auth.dart' as feature_auth;
import 'package:feature_home/feature_home.dart' as feature_home;

import '../config/flavor_config.dart';
import '../coordinator/app_coordinator.dart';
import '../coordinator/coordinator_manager.dart';
import '../coordinator/features/user_coordinator.dart';
import '../coordinator/features/course_coordinator.dart';

/// App configuration that initializes core libraries with flavor settings
class AppConfig extends Config {
  factory AppConfig.getInstance() {
    return _instance;
  }

  AppConfig._();

  static final AppConfig _instance = AppConfig._();

  @override
  Future<void> config() async {
    // Initialize lib_base
    await LibBaseConfig.getInstance().config();

    // Initialize core_storage first (for preferences)
    await core_storage.CoreStorageConfig.getInstance().config();

    // Register flavor-based NetworkConfig before initializing core_network
    await _registerFlavorBasedConfig();

    // Initialize core_network with flavor-aware configuration
    // Note: core_network will use AppPreferences from core_storage
    await core_network.CoreNetworkConfig.getInstance().config();

    // Initialize core_auth module DI
    await core_auth.configureCoreAuthInjection();

    // Initialize core_students module DI
    await core_students.configureCoreStudentsInjection();

    // Initialize feature_auth module DI
    await feature_auth.configureFeatureAuthInjection();

    // Initialize feature_home module DI
    await feature_home.configureFeatureHomeInjection();

    // Register app-specific services and coordinators
    _registerAppServices();
    _registerCoordinators();

    // Log current configuration
    final config = FlavorConfig.currentSync;
    Log.d('=== App DI Configuration ===');
    Log.d('Flavor: ${config.flavor}');
    Log.d('Base URL: ${config.baseUrl}');
    Log.d('API Base URL: ${config.apiBaseUrl}');
    Log.d('Timeout: ${config.timeout}');
    Log.d('Logging enabled: ${config.enableLogging}');
    Log.d('App initialized with flavor: ${config.flavor}');
  }

  Future<void> _registerFlavorBasedConfig() async {
    final flavorConfig = await FlavorConfig.current;

    // Unregister existing NetworkConfig if it exists
    if (getIt.isRegistered<core_network.NetworkConfig>()) {
      getIt.unregister<core_network.NetworkConfig>();
    }

    // Register new NetworkConfig with flavor settings
    getIt.registerSingleton<core_network.NetworkConfig>(
      core_network.NetworkConfig.fromFlavor(
        flavorConfig.apiBaseUrl,
        flavorConfig.timeout,
      ),
    );

    Log.d('App: NetworkConfig registered with flavor settings');
    Log.d('App: API Base URL: ${flavorConfig.apiBaseUrl}');
    Log.d('App: Timeout: ${flavorConfig.timeout}');
  }

  void _registerAppServices() {
    // AuthService is now provided by core_auth module via DI
    // No need to register it manually here
  }

  void _registerCoordinators() {
    Log.d('App: Registering coordinators...');

    // Register AuthFeatureCoordinator
    if (!getIt.isRegistered<feature_auth.AuthFeatureCoordinator>()) {
      getIt.registerSingleton<feature_auth.AuthFeatureCoordinator>(
        feature_auth.AuthFeatureCoordinator(
          getIt.get<core_storage.AppPreferences>(),
        ),
      );
    }

    // Register HomeFeatureCoordinator
    if (!getIt.isRegistered<feature_home.HomeFeatureCoordinator>()) {
      getIt.registerSingleton<feature_home.HomeFeatureCoordinator>(
        feature_home.HomeFeatureCoordinator(),
      );
    }

    // Register ProfileFeatureCoordinator
    if (!getIt.isRegistered<feature_home.ProfileFeatureCoordinator>()) {
      getIt.registerSingleton<feature_home.ProfileFeatureCoordinator>(
        feature_home.ProfileFeatureCoordinator(),
      );
    }

    // Register AppCoordinator (depends on feature coordinators)
    if (!getIt.isRegistered<AppCoordinator>()) {
      getIt.registerSingleton<AppCoordinator>(
        AppCoordinator(
          getIt.get<feature_auth.AuthFeatureCoordinator>(),
          getIt.get<feature_home.HomeFeatureCoordinator>(),
          getIt.get<feature_home.ProfileFeatureCoordinator>(),
        ),
      );
    }

    // Register UserCoordinator
    if (!getIt.isRegistered<UserCoordinator>()) {
      getIt.registerSingleton<UserCoordinator>(
        UserCoordinator(getIt.get<AppCoordinator>()),
      );
    }

    // Register CourseCoordinator
    if (!getIt.isRegistered<CourseCoordinator>()) {
      getIt.registerSingleton<CourseCoordinator>(
        CourseCoordinator(getIt.get<AppCoordinator>()),
      );
    }

    // Register CoordinatorManager
    if (!getIt.isRegistered<CoordinatorManager>()) {
      getIt.registerSingleton<CoordinatorManager>(
        CoordinatorManager(
          appCoordinator: getIt.get<AppCoordinator>(),
          authFeatureCoordinator: getIt
              .get<feature_auth.AuthFeatureCoordinator>(),
          homeFeatureCoordinator: getIt
              .get<feature_home.HomeFeatureCoordinator>(),
          profileFeatureCoordinator: getIt
              .get<feature_home.ProfileFeatureCoordinator>(),
          userCoordinator: getIt.get<UserCoordinator>(),
          courseCoordinator: getIt.get<CourseCoordinator>(),
        ),
      );
    }

    Log.d('App: Coordinators registered successfully');
  }
}
