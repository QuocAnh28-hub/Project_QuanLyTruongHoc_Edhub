import 'package:dartx/dartx.dart';
import 'package:flutter/widgets.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_utils/lib_utils.dart';

import '../../global_variable.dart';
import '../common/common_mediator.dart';
import '../common/common_popup_info.dart';
import '../constant/da_constants.dart';
import '../exception/app_exception.dart';
import '../exception/remote_exception.dart';
import 'app_exception_wrapper.dart';
import 'exception_refresh_token_notifier.dart';
import 'friendly_message_config.dart';

@LazySingleton()
class ExceptionHandler {
  ExceptionHandler({
    required this.commonMediator,
    required this.refreshNotifier,
    required this.friendlyMessageConfig,
  });

  final FeatureCommonMediator commonMediator;
  final ExceptionRefreshTokenNotifier refreshNotifier;
  final FriendlyMessageConfig friendlyMessageConfig;

  Future<void> handleException(
      AppExceptionWrapper appExceptionWrapper,
      String commonExceptionMessage,
      BuildContext context,
      ) async {
    final message =
        appExceptionWrapper.overrideMessage ?? commonExceptionMessage;
    switch (appExceptionWrapper.appException.appExceptionType) {
      case AppExceptionType.platform:
        if (appExceptionWrapper.appException.ignorable) {
          return;
        }

        if (appExceptionWrapper.doOnRetry == null) {
          _showErrorToast(message);
          return;
        }
        await _showErrorPage(
          message: message,
          appExceptionWrapper: appExceptionWrapper,
          context: context,
        );
      case AppExceptionType.remote:
        final exception = appExceptionWrapper.appException as RemoteException;
        switch (exception.kind) {
          case RemoteExceptionKind.refreshTokenFailed:
            _showErrorToast(message);
            await Future.delayed(
                const Duration(seconds: DaConstants.toastDurationNormal));
            refreshNotifier.notifyChange();
          case RemoteExceptionKind.noInternet:
          case RemoteExceptionKind.timeout:
            if (appExceptionWrapper.doOnRetry == null) {
              _showErrorToast(message);
              return;
            }
            await _showErrorPage(
              message: message,
              appExceptionWrapper: appExceptionWrapper,
              context: context,
            );
          default:
            if (exception.isInternalServerError) {
              await _showErrorPage(
                message: message,
                appExceptionWrapper: appExceptionWrapper,
                context: context,
              );
              return;
            }
            _showErrorToast(message);
            if (exception.isExpiredSession) {
              await Future.delayed(
                  const Duration(seconds: DaConstants.toastDurationNormal));
              refreshNotifier.notifyChange();
            }
        }
      case AppExceptionType.parse:
      case AppExceptionType.remoteConfig:
      case AppExceptionType.uncaught:
      case AppExceptionType.validation:
      case AppExceptionType.logic:
        _showErrorToast(message);
    }
  }

  void _showErrorToast(String message) {
    final context = GlobalVariable.navState.currentContext;
    if (context != null) {
      commonMediator.showToast(
        message,
        NotificationType.negative,
        context,
      );
    }
  }

  // to show common error page
  Future<Object?> _showErrorPage({
    required String message,
    required AppExceptionWrapper appExceptionWrapper,
    required BuildContext context,
  }) {
    final needRetry = appExceptionWrapper.doOnRetry != null;
    final primaryButtonLabel = needRetry
        ? friendlyMessageConfig.commonRefreshText
        : friendlyMessageConfig.commonOkMessage;
    return _showErrorScreen(
      message: message,
      primaryButton: Pair(primaryButtonLabel, () async {
        commonMediator.popDialog();
        await appExceptionWrapper.doOnRetry?.call();
      }),
      secondaryButton: needRetry
          ? Pair(friendlyMessageConfig.commonOkMessage, () async {
        commonMediator.popDialog();
      })
          : null,
      context: context,
    );
  }

  Future<Object?> _showErrorScreen({
    String? title,
    String? message,
    required Pair<String, VoidCallback> primaryButton,
    Pair<String, VoidCallback>? secondaryButton,
    required BuildContext context,
  }) async {
    return commonMediator.showCommonDialog(
      commonPopupInfo: CommonPopupInfo.errorPopupPage(
        title: title ?? friendlyMessageConfig.somethingWrongMessage,
        message: message ?? friendlyMessageConfig.commonErrorMessage,
        primaryButton: primaryButton,
        secondaryButton: secondaryButton,
      ),
    );
  }
}
