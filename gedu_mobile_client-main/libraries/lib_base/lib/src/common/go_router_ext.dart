import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

import '../../global_variable.dart';
import '../log/log_utils.dart';

typedef GoRouterStatePredicate = bool Function(GoRoute state);
typedef RouteBuilder = Widget Function(BuildContext, GoRouterState);

extension GoRouterExt on GoRouter {
  bool matchCurrentRoute(String currentRoute) {
    final currentContext = GlobalVariable.navState.currentContext;
    if (currentContext != null) {
      final matches = GoRouter.of(
        currentContext,
      ).routerDelegate.currentConfiguration.matches;
      return (matches.lastOrNull?.matchedLocation ?? '') == currentRoute;
    }
    return false;
  }

  void popUntil(GoRouterStatePredicate predicate, dynamic dataToPop) {
    assert(() {
      Log.d('popUntil returned path called');
      return true;
    }());
    routerDelegate.popUntil(predicate, dataToPop);
  }
}

extension GoRouteDelegateExt on GoRouterDelegate {
  void popUntil(GoRouterStatePredicate predicate, dynamic dataToPop) {
    var routes = currentConfiguration.routes;
    var route = currentConfiguration.routes.last;

    while (canPop()) {
      final checkingIndex = routes.indexOf(route);
      if (routes.elementAt(checkingIndex - 1) is ShellRoute) {
        currentConfiguration.matches.removeLast();
      }
      if (route is GoRoute) {
        if (predicate(route)) break; // Finish
        if (!canPop()) break; // Stop since cannot pop
        pop(dataToPop);
      }

      routes = currentConfiguration.routes;
      route = routes.last;
    }
  }
}

extension GoRouterHelper on BuildContext {
  void popUntil(GoRouterStatePredicate predicate, dynamic dataToPop) =>
      GoRouter.of(this).popUntil(predicate, dataToPop);
}

GoRoute buildFadeRoute({required String path, required RouteBuilder builder}) {
  return GoRoute(
    path: path,
    pageBuilder: (context, state) => CustomTransitionPage(
      child: builder(context, state),
      transitionsBuilder: (_, animation, __, child) =>
          FadeTransition(opacity: animation, child: child),
    ),
  );
}
