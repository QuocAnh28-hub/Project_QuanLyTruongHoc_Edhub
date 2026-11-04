import 'package:flutter/cupertino.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../global_variable.dart';
import 'feature_module_coordinator.dart';

abstract class FeatureModulePath {
  String get fullPath;
}

abstract class FeatureCoreModule<Mediator extends FeatureModuleCoordinator> {
  Mediator getCoordinator();

  List<RouteBase> buildRoutes(GlobalKey<NavigatorState>? navigatorKey);

  Widget embedCoordinator(Widget widget) {
    return MultiProvider(
      providers: [Provider<Mediator>(create: (_) => getCoordinator())],
      child: widget,
    );
  }
}

extension FeatureModulePathEx on FeatureModulePath {
  Future<T?> pushOn<T extends Object?>(BuildContext context, {Object? extra}) {
    return GoRouter.of(context).push<T>(fullPath, extra: extra);
  }

  Future<T?> push<T extends Object?>({Object? extra}) async {
    if (GlobalVariable.navState.currentContext case final context?) {
      return GoRouter.of(context).push<T>(fullPath, extra: extra);
    }
    return null;
  }

  void go({Object? extra}) {
    if (GlobalVariable.navState.currentContext case final context?) {
      GoRouter.of(context).go(fullPath, extra: extra);
    }
  }

  Future<void> replace<T extends Object?>(BuildContext context,
      {Object? extra}) async {
    return GoRouter.of(context).replace(fullPath, extra: extra);
  }

  Future<void> replaceCurrent<T extends Object?>({Object? extra}) async {
    if (GlobalVariable.navState.currentContext case final context?) {
      return GoRouter.of(context).replace(fullPath, extra: extra);
    }
  }

  void goOn(BuildContext context, {Object? extra}) {
    return GoRouter.of(context).go(fullPath, extra: extra);
  }

  Future<void> pushReplacement<T extends Object?>(BuildContext context,
      {Object? extra}) async {
    await GoRouter.of(context).pushReplacement(fullPath, extra: extra);
  }
}
