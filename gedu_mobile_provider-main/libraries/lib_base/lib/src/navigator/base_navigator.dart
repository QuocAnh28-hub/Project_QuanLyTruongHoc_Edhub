import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

abstract class BaseNavigator {
  List<RouteBase> get routes => [];
}

/// Simplified navigation interface - only what's actually needed
abstract class BaseCoordinatorNavigator extends BaseNavigator {
  // Only include methods that coordinators actually need to implement
  // Each coordinator can choose which methods to implement
}

/// Pre auth features modules need to  to implement/extends
abstract class BaseAuthNavigator extends BaseNavigator {}

/// Post auth features modules to implement/extends
abstract class BaseMainNavigator extends BaseNavigator {
  List<GoRoute> get bottomShellRoutes => [];
}

/// Host features module need to  to implement/extends
abstract class BaseHostNavigator extends BaseNavigator {
  final GlobalKey<NavigatorState> shellNavigatorKey =
      GlobalKey<NavigatorState>();

  bool get isShellEnable;

  set isShellEnable(bool enable);

  Key hostKey = const ValueKey('host_key');

  List<GoRoute> get shellRoutes => [];

  void refresh() {
    // new key to trigger rebuild host when navigate to a shell
    hostKey = UniqueKey();
  }
}
