import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_utils/lib_utils.dart';
import '../../global_variable.dart';
import 'common_mediator.dart';
import 'common_popup_info.dart';

@singleton
class FeatureCommonMediatorImpl extends FeatureCommonMediator {
  @override
  Future<T?> showCommonDialog<T extends Object?>({
    required CommonPopupInfo commonPopupInfo,
    bool barrierDismissible = true,
    bool useSafeArea = false,
    bool backDismissible = true,
  }) async {
    final context = GlobalVariable.navState.currentContext;
    if (context == null) return null;

    return showDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      useSafeArea: useSafeArea,
      builder: (BuildContext context) {
        return PopScope(
          canPop: backDismissible,
          child: AlertDialog(
            title: Text(commonPopupInfo.title),
            content: Text(commonPopupInfo.message),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text(commonPopupInfo.primaryButtonLabel),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  void showToast(String message, NotificationType type, BuildContext context) {
    // Simple toast implementation - you can replace this with your preferred toast library
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: type == NotificationType.negative
            ? Colors.red
            : Colors.green,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget loadingFullscreen() {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
