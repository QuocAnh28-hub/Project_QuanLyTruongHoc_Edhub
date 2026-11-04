import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// A generic welcome dialog that can be customized with text and illustration
class WelcomeDialog extends StatelessWidget {
  /// The title text to display
  final String title;

  /// The message text to display
  final String message;

  /// The button text
  final String buttonText;

  /// The illustration widget to display at the top
  final Widget? illustration;

  /// Callback when the dialog is dismissed
  final VoidCallback? onDismiss;

  const WelcomeDialog({
    super.key,
    required this.title,
    required this.message,
    required this.buttonText,
    this.illustration,
    this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: AppSpacing.symmetric(horizontal: AppSpacing.space6x),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppSpacing.space4x),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadow,
              blurRadius: AppSpacing.space6x,
              offset: const Offset(0, AppSpacing.space2x),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Illustration section with light yellow background
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFFFFF8E1), // Light yellow background
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(AppSpacing.space4x),
                  topRight: Radius.circular(AppSpacing.space4x),
                ),
              ),
              child: Padding(
                padding: AppSpacing.all(AppSpacing.space6x),
                child:
                    illustration ??
                    Assets.images.welcomeDialog.designSystemSvg(
                      width: double.infinity,
                      height: 200,
                      fit: BoxFit.contain,
                    ),
              ),
            ),

            // Content section
            Padding(
              padding: AppSpacing.all(AppSpacing.space6x),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Title
                  Text(
                    title,
                    style: AppTypography.titleLarge.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: AppSpacing.space4x),

                  // Message
                  Text(
                    message,
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: AppSpacing.space6x),

                  // Button
                  SizedBox(
                    width: double.infinity,
                    height: AppSpacing.space12x,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                        onDismiss?.call();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: AppColors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            AppSpacing.space2x,
                          ),
                        ),
                      ),
                      child: Text(
                        buttonText,
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Utility function to show the welcome dialog
Future<void> showWelcomeDialog({
  required BuildContext context,
  required String title,
  required String message,
  required String buttonText,
  Widget? illustration,
  VoidCallback? onDismiss,
}) {
  return showDialog<void>(
    context: context,
    barrierDismissible: true, // Allow dismissing by tapping outside
    builder: (BuildContext context) {
      return WelcomeDialog(
        title: title,
        message: message,
        buttonText: buttonText,
        illustration: illustration,
        onDismiss: onDismiss,
      );
    },
  );
}
