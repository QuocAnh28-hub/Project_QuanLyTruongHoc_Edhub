import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';

import 'config/flavor_config.dart';
import 'coordinator/coordinator_manager.dart';
import 'di/app_di_config.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize app with flavor configuration
  await AppConfig.getInstance().config();

  // Initialize coordinators once at app startup
  final coordinatorManager = getIt.get<CoordinatorManager>();
  coordinatorManager.initialize();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Get flavor configuration for UI
    final config = FlavorConfig.currentSync;

    // Log current configuration for debugging
    Log.d('=== App Configuration ===');
    Log.d('Flavor: ${config.flavor}');
    Log.d('App Name: ${config.appName}');
    Log.d('Base URL: ${config.baseUrl}');
    Log.d('API Base URL: ${config.apiBaseUrl}');
    Log.d('Logging enabled: ${config.enableLogging}');

    // Get coordinator manager (already initialized in main())
    final coordinatorManager = getIt.get<CoordinatorManager>();

    return ValueListenableBuilder<Locale>(
      valueListenable: coordinatorManager.app.currentLocale,
      builder: (context, locale, child) {
        return MaterialApp.router(
          title: config.appName,
          theme: AppTheme.light,
          routerConfig: coordinatorManager.app.router,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('vi', ''), // Vietnamese (default)
            Locale('en', ''), // English
          ],
          locale: locale, // Use AppCoordinator's locale
        );
      },
    );
  }
}
