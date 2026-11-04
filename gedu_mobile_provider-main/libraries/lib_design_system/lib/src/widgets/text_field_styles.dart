import 'package:flutter/material.dart';

import '../colors/app_colors.dart';
import '../colors/color_constants.dart';
import '../spacing/app_spacing.dart';
import '../typography/app_typography.dart';

/// Text field styles for the design system
class AppTextFieldStyles {
  AppTextFieldStyles._();

  /// Primary text field decoration with blue focus color
  static InputDecoration get primary => InputDecoration(
    labelStyle: AppTypography.bodyLarge.copyWith(
      color: AppColors.textSecondary,
    ),
    floatingLabelStyle: AppTypography.bodyLarge.copyWith(
      color: ColorConstants.focusBlue,
    ),
    border: OutlineInputBorder(
      borderRadius: AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.textFieldBorder),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.textFieldBorder),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(color: AppColors.textFieldFocusBorder, width: 2),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.error),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.error, width: 2),
    ),
    filled: true,
    fillColor: AppColors.surface,
    contentPadding: AppSpacing.all(AppSpacing.space4x),
  );

  /// Text field decoration with custom label text
  static InputDecoration withLabel(String labelText, {String? hintText}) =>
      primary.copyWith(labelText: labelText, hintText: hintText);

  /// Text field decoration with suffix icon
  static InputDecoration withSuffixIcon(
    String labelText, {
    String? hintText,
    Widget? suffixIcon,
  }) => primary.copyWith(
    labelText: labelText,
    hintText: hintText,
    suffixIcon: suffixIcon,
  );

  /// Text field decoration for password field
  static InputDecoration password(
    String labelText, {
    String? hintText,
    Widget? suffixIcon,
  }) => primary.copyWith(
    labelText: labelText,
    hintText: hintText,
    suffixIcon: suffixIcon,
  );

  /// Custom text field decoration with proper floating label colors
  static InputDecoration custom({
    String? labelText,
    String? hintText,
    Widget? prefixIcon,
    Widget? suffixIcon,
    Color? borderColor,
    Color? focusedBorderColor,
    Color? labelColor,
    Color? focusedLabelColor,
    Color? fillColor,
    EdgeInsetsGeometry? contentPadding,
    BorderRadius? borderRadius,
  }) => InputDecoration(
    labelText: labelText,
    hintText: hintText,
    prefixIcon: prefixIcon,
    suffixIcon: suffixIcon,
    labelStyle: AppTypography.bodyLarge.copyWith(
      color: labelColor ?? AppColors.textSecondary,
    ),
    floatingLabelStyle: AppTypography.bodyLarge.copyWith(
      color: focusedLabelColor ?? ColorConstants.focusBlue,
    ),
    border: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(color: borderColor ?? AppColors.textFieldBorder),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(color: borderColor ?? AppColors.textFieldBorder),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(
        color: focusedBorderColor ?? AppColors.textFieldFocusBorder,
        width: 2,
      ),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.error),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.error, width: 2),
    ),
    filled: true,
    fillColor: fillColor ?? AppColors.surface,
    contentPadding: contentPadding ?? AppSpacing.all(AppSpacing.space4x),
  );

  /// Text field decoration with proper Material 3 floating label colors
  static InputDecoration material3({
    String? labelText,
    String? hintText,
    Widget? prefixIcon,
    Widget? suffixIcon,
    Color? borderColor,
    Color? focusedBorderColor,
    Color? fillColor,
    EdgeInsetsGeometry? contentPadding,
    BorderRadius? borderRadius,
  }) => InputDecoration(
    labelText: labelText,
    hintText: hintText,
    prefixIcon: prefixIcon,
    suffixIcon: suffixIcon,
    labelStyle: AppTypography.bodyLarge.copyWith(
      color: AppColors.textSecondary,
    ),
    floatingLabelStyle: AppTypography.bodyLarge.copyWith(
      color: ColorConstants.focusBlue, // Focused state
    ),
    border: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(color: borderColor ?? AppColors.textFieldBorder),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(color: borderColor ?? AppColors.border),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: BorderSide(
        color: focusedBorderColor ?? AppColors.textFieldFocusBorder,
        width: 2,
      ),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.error),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: borderRadius ?? AppSpacing.getTextFieldBorderRadius(),
      borderSide: const BorderSide(color: AppColors.error, width: 2),
    ),
    filled: true,
    fillColor: fillColor ?? AppColors.surface,
    contentPadding: contentPadding ?? AppSpacing.all(AppSpacing.space4x),
  );

  /// Helper method to create a TextFormField with proper Material 3 floating label behavior
  static Widget createMaterial3TextField({
    required TextEditingController controller,
    required String labelText,
    String? hintText,
    Widget? suffixIcon,
    TextInputType? keyboardType,
    TextInputAction? textInputAction,
    bool obscureText = false,
    String? Function(String?)? validator,
    VoidCallback? onSuffixIconPressed,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      obscureText: obscureText,
      cursorColor: ColorConstants.focusBlue,
      style: AppTypography.bodyLarge.copyWith(color: AppColors.textPrimary),
      decoration: material3(
        labelText: labelText,
        hintText: hintText,
        suffixIcon: suffixIcon,
      ),
      validator: validator,
    );
  }
}
