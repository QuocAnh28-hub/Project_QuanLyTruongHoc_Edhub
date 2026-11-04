import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_utils/lib_utils.dart';

import '../common/common_popup_info.dart';
import '../common/go_router_ext.dart';
import '../feature/feature_module_coordinator.dart';
import '../../global_variable.dart';
import '../log/log_utils.dart';


abstract class FeatureCommonMediator extends FeatureModuleCoordinator {
  Future<T?> showCommonDialog<T extends Object?>({
    required CommonPopupInfo commonPopupInfo,
    bool barrierDismissible = true,
    bool useSafeArea = false,
    bool backDismissible = true,
  });

  void showToast(String message, NotificationType type, BuildContext context);

  Widget loadingFullscreen();

  void popDialog() {
    final context = GlobalVariable.navState.currentContext;
    if (context == null || !context.mounted) return;

    try {
      if (isModal(context)) {
        Navigator.of(context, rootNavigator: true).pop();
      } else if (Navigator.of(context).canPop()) {
        Navigator.of(context).pop();
      }
    } catch (e) {
      Log.e('Error while popping: $e');
    }
  }

  bool isModal(BuildContext context) {
    final ModalRoute<dynamic>? route = ModalRoute.of(context);
    if (route == null) return false;

    return route is PopupRoute || // Dialog, BottomSheet
        !route.isFirst; // Not first route in stack
  }

  void popCurrentPage(String currentPagePath) {
    final currentContext = GlobalVariable.navState.currentContext;
    if (currentContext != null &&
        GoRouter.of(currentContext).matchCurrentRoute(currentPagePath)) {
      if (currentContext.canPop()) {
        currentContext.pop();
      }
    }
  }

  void popUntil(BuildContext context, String fullPath, dynamic dataToPop) {
    context.popUntil((GoRoute route) => route.path == fullPath, dataToPop);
  }

  bool containListRoute(List<String> routeNeedCheck) {
    final currentContext = GlobalVariable.navState.currentContext;
    if (currentContext != null) {
      final matches = GoRouter.of(currentContext)
          .routerDelegate
          .currentConfiguration
          .matches;
      final locations = matches.map((e) => e.matchedLocation).toList().reversed;

      int index = 0;
      for (final location in locations) {
        if (routeNeedCheck.contains(location)) {
          index++;
          if (routeNeedCheck.length == index) {
            return true;
          }
        } else {
          if (index > 0) {
            return false;
          }
        }
      }
    }
    return false;
  }
}
