import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';

import 'di.config.dart';

/// Configure core_auth module dependencies
/// This should be called from the main app's DI setup
@injectableInit
Future<void> configureCoreAuthInjection() async {
  final getIt = GetIt.instance;
  getIt.init();
}
