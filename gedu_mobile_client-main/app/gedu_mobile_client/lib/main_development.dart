import 'package:flutter/material.dart';
import 'package:lib_base/lib_base.dart';
import 'di/app_di_config.dart';
import 'coordinator/coordinator_manager.dart';
import 'main.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Gracefully filter layout overflow warnings
  FlutterError.onError = (FlutterErrorDetails details) {
    final msg = details.exceptionAsString();
    if (msg.contains('overflowed') || details.summary.toString().contains('overflowed')) {
      Log.d('Prevented overflow warning banner: ${details.summary}');
      return;
    }
    FlutterError.presentError(details);
  };

  // Set development flavor
  const flavor = String.fromEnvironment('FLAVOR', defaultValue: 'development');
  Log.d('Starting app with flavor: $flavor');

  // Initialize app with flavor configuration
  await AppConfig.getInstance().config();

  // Initialize coordinators once at app startup
  final coordinatorManager = getIt.get<CoordinatorManager>();
  coordinatorManager.initialize();

  runApp(const MyApp());
}
