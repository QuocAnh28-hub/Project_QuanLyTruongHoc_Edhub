import 'dart:ui';

import 'package:dartx/dartx.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import 'package:lib_utils/lib_utils.dart';

part 'common_popup_info.freezed.dart';

@freezed
abstract class CommonPopupInfo with _$CommonPopupInfo {
  const factory CommonPopupInfo.alertDialog({
    @Default('') String title,
    @Default('') String message,
    @Default('') String primaryButtonLabel,
    @Default([]) List<String> bulletPoints,
    VoidCallback? onPrimaryButtonClicked,
    String? secondaryButtonLabel,
    VoidCallback? onSecondaryButtonClicked,
    Func0<void>? onPressed,
  }) = _AlertDialog;

  const factory CommonPopupInfo.errorDialog({
    @Default('') String title,
    @Default('') String message,
    @Default('') String primaryButtonLabel,
    VoidCallback? onPrimaryButtonClicked,
    String? secondaryButtonLabel,
    VoidCallback? onSecondaryButtonClicked,
    Func0<void>? onRetryPressed,
  }) = _ErrorDialog;

  const factory CommonPopupInfo.errorPopupPage({
    @Default('') String title,
    @Default('') String message,
    @Default('') String primaryButtonLabel,
    required Pair<String, VoidCallback> primaryButton,
    Pair<String, VoidCallback>? secondaryButton,
  }) = _ErrorPopupPage;
}

extension CommonPopupInfoExt on CommonPopupInfo {
  bool get isError {
    return this is _ErrorDialog || this is _ErrorPopupPage;
  }
}
