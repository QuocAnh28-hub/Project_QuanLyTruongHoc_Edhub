import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../colors/app_colors.dart';
import '../spacing/app_spacing.dart';
import '../typography/app_typography.dart';

/// Button configuration for confirmation dialog
class DialogButton {
  /// The text displayed on the button
  final String text;

  /// The callback when button is pressed
  final VoidCallback? onPressed;

  /// The background color of the button
  final Color? backgroundColor;

  /// The text color of the button
  final Color? textColor;

  /// The border color of the button (for outlined buttons)
  final Color? borderColor;

  /// Whether this is a primary (filled) or secondary (outlined) button
  final bool isPrimary;

  /// Whether this button represents a destructive action
  final bool isDestructive;

  const DialogButton({
    required this.text,
    this.onPressed,
    this.backgroundColor,
    this.textColor,
    this.borderColor,
    this.isPrimary = false,
    this.isDestructive = false,
  });

  /// Factory for creating a primary button
  factory DialogButton.primary({
    required String text,
    VoidCallback? onPressed,
    Color? backgroundColor,
    Color? textColor,
    bool isDestructive = false,
  }) {
    return DialogButton(
      text: text,
      onPressed: onPressed,
      backgroundColor: backgroundColor,
      textColor: textColor,
      isPrimary: true,
      isDestructive: isDestructive,
    );
  }

  /// Factory for creating a secondary button
  factory DialogButton.secondary({
    required String text,
    VoidCallback? onPressed,
    Color? backgroundColor,
    Color? textColor,
    Color? borderColor,
  }) {
    return DialogButton(
      text: text,
      onPressed: onPressed,
      backgroundColor: backgroundColor,
      textColor: textColor,
      borderColor: borderColor,
      isPrimary: false,
    );
  }

  /// Factory for creating a text-only button (no background, no border)
  factory DialogButton.text({
    required String text,
    VoidCallback? onPressed,
    Color? textColor,
    bool isDestructive = false,
  }) {
    // If no textColor is provided, use default colors based on isDestructive
    final defaultTextColor =
        textColor ?? (isDestructive ? AppColors.error : AppColors.focusBlue);

    return DialogButton(
      text: text,
      onPressed: onPressed,
      backgroundColor: Colors.transparent,
      textColor: defaultTextColor,
      borderColor: Colors.transparent,
      isPrimary: false,
      isDestructive: isDestructive,
    );
  }
}

/// A generic, customizable confirmation dialog that follows the design system
class ConfirmationDialog extends StatelessWidget {
  /// The title text for the dialog
  final String title;

  /// The message/description text for the dialog
  final String? message;

  /// Optional icon widget to display at the top
  final Widget? icon;

  /// Optional icon background color
  final Color? iconBackgroundColor;

  /// List of buttons to display (typically 1-3 buttons)
  final List<DialogButton> buttons;

  /// Custom dialog width (defaults to responsive)
  final double? width;

  /// Custom dialog padding
  final EdgeInsets? padding;

  /// Custom title text style
  final TextStyle? titleStyle;

  /// Custom message text style
  final TextStyle? messageStyle;

  /// Custom icon container size (defaults to 56x56)
  final double? iconSize;

  /// Custom button height (defaults to 48)
  final double? buttonHeight;

  /// Whether buttons should be stacked vertically even for 2 buttons
  final bool forceVerticalButtons;

  const ConfirmationDialog({
    super.key,
    required this.title,
    this.message,
    this.icon,
    this.iconBackgroundColor,
    required this.buttons,
    this.width,
    this.padding,
    this.titleStyle,
    this.messageStyle,
    this.iconSize,
    this.buttonHeight,
    this.forceVerticalButtons = false,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: AppSpacing.symmetric(horizontal: AppSpacing.space10x),
      child: Container(
        width: width,
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: AppSpacing.borderRadius(AppSpacing.borderRadius16px),
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
            // Content area with padding
            Padding(
              padding: AppSpacing.all(AppSpacing.space6x),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Icon (centered)
                  if (icon != null) ...[
                    Center(child: icon!),
                    const SizedBox(height: AppSpacing.space5x),
                  ],

                  // Title (centered)
                  Text(
                    title,
                    style:
                        titleStyle ??
                        AppTypography.titleLarge.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                    textAlign: TextAlign.center,
                  ),

                  // Message (left-aligned with 24px padding from container edges)
                  if (message != null) ...[
                    const SizedBox(height: AppSpacing.space3x),
                    SizedBox(
                      width: double.infinity,
                      child: Text(
                        message!,
                        style:
                            messageStyle ??
                            AppTypography.bodyMedium.copyWith(
                              color: AppColors.textSecondary,
                              height: 1.4,
                            ),
                        textAlign: TextAlign.left,
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Buttons area (right-aligned, no padding from container)
            Padding(
              padding: EdgeInsets.only(
                left: AppSpacing.space6x,
                right: AppSpacing.space6x,
                bottom: AppSpacing.space6x,
              ),
              child: _buildButtons(context),
            ),
          ],
        ),
      ),
    );
  }

  /// Build the button row/column based on the number of buttons
  Widget _buildButtons(BuildContext context) {
    if (buttons.isEmpty) {
      return const SizedBox.shrink();
    }

    final buttonHeight = this.buttonHeight ?? AppSpacing.space12x;

    if (buttons.length == 1) {
      return SizedBox(
        width: double.infinity,
        height: buttonHeight,
        child: _buildButton(context, buttons.first),
      );
    }

    if (buttons.length == 2 && !forceVerticalButtons) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          SizedBox(
            height: buttonHeight,
            child: _buildButton(context, buttons[0]),
          ),
          const SizedBox(width: AppSpacing.space3x),
          SizedBox(
            height: buttonHeight,
            child: _buildButton(context, buttons[1]),
          ),
        ],
      );
    }

    // For 3+ buttons, stack them vertically
    return Column(
      children: buttons.asMap().entries.map((entry) {
        final index = entry.key;
        final button = entry.value;
        return Padding(
          padding: EdgeInsets.only(
            bottom: index < buttons.length - 1 ? AppSpacing.space3x : 0,
          ),
          child: SizedBox(
            width: double.infinity,
            height: buttonHeight,
            child: _buildButton(context, button),
          ),
        );
      }).toList(),
    );
  }

  /// Build individual button widget
  Widget _buildButton(BuildContext context, DialogButton button) {
    final defaultBackgroundColor = button.isPrimary
        ? (button.isDestructive ? AppColors.error : AppColors.primary)
        : AppColors.white;

    final defaultTextColor = button.isPrimary
        ? AppColors.white
        : (button.isDestructive ? AppColors.error : AppColors.textSecondary);

    final backgroundColor = button.backgroundColor ?? defaultBackgroundColor;
    final textColor = button.textColor ?? defaultTextColor;

    if (button.isPrimary) {
      return ElevatedButton(
        onPressed: button.onPressed ?? () => Navigator.of(context).pop(),
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: AppSpacing.borderRadius(AppSpacing.borderRadius8px),
          ),
          padding: AppSpacing.symmetric(
            horizontal: AppSpacing.space6x,
            vertical: AppSpacing.space3x,
          ),
        ),
        child: Text(
          button.text,
          style: AppTypography.bodyMedium.copyWith(
            color: textColor,
            fontWeight: FontWeight.w500,
          ),
        ),
      );
    } else {
      final borderColor =
          button.borderColor ??
          (button.isDestructive ? AppColors.error : AppColors.border);

      // Check if this is a text-only button (transparent background and border)
      final isTextButton =
          backgroundColor == Colors.transparent &&
          borderColor == Colors.transparent;

      if (isTextButton) {
        return TextButton(
          onPressed: button.onPressed ?? () => Navigator.of(context).pop(),
          style: TextButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: textColor,
            shape: RoundedRectangleBorder(
              borderRadius: AppSpacing.borderRadius(AppSpacing.borderRadius8px),
            ),
            padding: AppSpacing.symmetric(
              horizontal: AppSpacing.space6x,
              vertical: AppSpacing.space3x,
            ),
          ),
          child: Text(
            button.text,
            style: AppTypography.bodyMedium.copyWith(
              color: textColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        );
      } else {
        return OutlinedButton(
          onPressed: button.onPressed ?? () => Navigator.of(context).pop(),
          style: OutlinedButton.styleFrom(
            backgroundColor: backgroundColor,
            foregroundColor: textColor,
            side: BorderSide(
              color: borderColor,
              width: AppSpacing.borderWidth1px,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: AppSpacing.borderRadius(AppSpacing.borderRadius8px),
            ),
            padding: AppSpacing.symmetric(
              horizontal: AppSpacing.space6x,
              vertical: AppSpacing.space3x,
            ),
          ),
          child: Text(
            button.text,
            style: AppTypography.bodyMedium.copyWith(
              color: textColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        );
      }
    }
  }
}

/// Utility function to show a generic confirmation dialog
Future<T?> showConfirmationDialog<T>({
  required BuildContext context,
  required String title,
  String? message,
  Widget? icon,
  Color? iconBackgroundColor,
  required List<DialogButton> buttons,
  double? width,
  EdgeInsets? padding,
  TextStyle? titleStyle,
  TextStyle? messageStyle,
  double? iconSize,
  double? buttonHeight,
  bool forceVerticalButtons = false,
  bool barrierDismissible = true,
}) {
  return showDialog<T>(
    context: context,
    barrierDismissible: barrierDismissible,
    builder: (BuildContext context) {
      return ConfirmationDialog(
        title: title,
        message: message,
        icon: icon,
        iconBackgroundColor: iconBackgroundColor,
        buttons: buttons,
        width: width,
        padding: padding,
        titleStyle: titleStyle,
        messageStyle: messageStyle,
        iconSize: iconSize,
        buttonHeight: buttonHeight,
        forceVerticalButtons: forceVerticalButtons,
      );
    },
  );
}

/// Utility function to show a logout confirmation dialog
Future<bool?> showLogoutDialog({
  required BuildContext context,
  required String title,
  required String message,
  required String cancelText,
  required String logoutText,
  VoidCallback? onCancel,
  VoidCallback? onLogout,
}) {
  return showConfirmationDialog<bool>(
    context: context,
    title: title,
    message: message,
    icon: Assets.images.signOut.designSystemSvg(),
    buttons: [
      DialogButton.text(
        text: cancelText,
        onPressed: onCancel ?? () => Navigator.of(context).pop(false),
      ),
      DialogButton.text(
        text: logoutText,
        isDestructive: true,
        onPressed: onLogout ?? () => Navigator.of(context).pop(true),
      ),
    ],
  );
}

/// Utility function to show a simple confirmation dialog with yes/no buttons
Future<bool?> showSimpleConfirmationDialog({
  required BuildContext context,
  required String title,
  String? message,
  Widget? icon,
  Color? iconBackgroundColor,
  required String confirmText, // Made required to force localization
  required String cancelText, // Made required to force localization
  bool isDestructive = false,
  VoidCallback? onConfirm,
  VoidCallback? onCancel,
}) {
  return showConfirmationDialog<bool>(
    context: context,
    title: title,
    message: message,
    icon: icon,
    iconBackgroundColor: iconBackgroundColor,
    buttons: [
      DialogButton.secondary(
        text: cancelText,
        onPressed: onCancel ?? () => Navigator.of(context).pop(false),
      ),
      DialogButton.primary(
        text: confirmText,
        isDestructive: isDestructive,
        onPressed: onConfirm ?? () => Navigator.of(context).pop(true),
      ),
    ],
  );
}

/// Utility function to show an info dialog with a single OK button
Future<void> showInfoDialog({
  required BuildContext context,
  required String title,
  String? message,
  Widget? icon,
  Color? iconBackgroundColor,
  required String okText, // Made required to force localization
  VoidCallback? onOk,
}) {
  return showConfirmationDialog<void>(
    context: context,
    title: title,
    message: message,
    icon: icon,
    iconBackgroundColor: iconBackgroundColor,
    buttons: [
      DialogButton.primary(
        text: okText,
        onPressed: onOk ?? () => Navigator.of(context).pop(),
      ),
    ],
  );
}
