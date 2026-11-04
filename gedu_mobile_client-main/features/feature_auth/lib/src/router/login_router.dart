import 'package:core_localization/core_localization.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../login/view/province_selection_sheet.dart';

/// Router for handling navigation in the auth feature
class LoginRouter {
  static const String _tag = 'LoginRouter';

  /// Navigate to dashboard screen after successful login
  static void navigateToHome(BuildContext context) {
    Log.d('$_tag: Navigating to dashboard screen');
    context.go('/dashboard');
  }

  /// Navigate to login screen from onboarding
  static void navigateToLogin(
    BuildContext context, {
    bool clearPassword = false,
  }) {
    Log.d('$_tag: Navigating to login screen (clearPassword: $clearPassword)');
    context.go('/login', extra: {'clearPassword': clearPassword});
  }

  /// Navigate to change password screen
  static void navigateToChangePassword(
    BuildContext context, {
    bool isFirstTimeLogin = false,
  }) {
    Log.d(
      '$_tag: Navigating to change password screen (firstTime: $isFirstTimeLogin)',
    );
    context.push(
      '/auth/change-password',
      extra: {'isFirstTimeLogin': isFirstTimeLogin},
    );
  }

  /// Navigate to change password from profile screen (not first time login)
  static void navigateToChangePasswordFromProfile(BuildContext context) {
    Log.d('$_tag: Navigating to change password from profile screen');
    context.push(
      '/auth/change-password-profile',
      extra: {'isFirstTimeLogin': false},
    );
  }

  /// Navigate to change password success screen
  static void navigateToChangePasswordSuccess(BuildContext context) {
    Log.d('$_tag: Navigating to change password success screen');
    context.push('/auth/change-password-success');
  }

  /// Navigate to student review screen
  static void navigateToStudentReview(BuildContext context) {
    Log.d('$_tag: Navigating to student review screen');
    context.go('/student-review');
  }

  /// Show province selection bottom sheet
  static Future<String?> showProvinceSelection(
    BuildContext context, {
    String? selectedProvince,
  }) async {
    Log.d('$_tag: Showing province selection bottom sheet');

    return showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      isDismissible: true,
      enableDrag: false,
      builder: (context) => SizedBox(
        height: MediaQuery.of(context).size.height * 0.85,
        child: ProvinceSelectionSheet(
          onProvinceSelected: (province) {
            Navigator.of(context).pop(province);
          },
          selectedProvince: selectedProvince,
        ),
      ),
    );
  }

  /// Show error message using snackbar
  static void showError(BuildContext context, String message) {
    Log.d('$_tag: Showing error: $message');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        backgroundColor: const Color(
          0xFF424242,
        ), // Dark gray background like in the image
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  /// Show success message using snackbar
  static void showSuccess(BuildContext context, String message) {
    Log.d('$_tag: Showing success: $message');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.primary,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  /// Show forgot password dialog
  static void showForgotPasswordDialog(BuildContext context) {
    Log.d('$_tag: Showing forgot password dialog');

    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      Log.e('$_tag: AppLocalizations not found');
      return;
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          title: Text(
            l10n.forgotPasswordTitle,
            style: AppTypography.titleLarge.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            l10n.forgotPasswordMessage,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                l10n.forgotPasswordButtonText,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
