import 'package:flutter/material.dart';

import '../colors/app_colors.dart';
import 'text_styles.dart';

/// Main typography class that provides access to all design system text styles
class AppTypography {
  AppTypography._();

  // Display Styles
  static const TextStyle displayLarge = TextStyles.displayLarge;
  static const TextStyle displayMedium = TextStyles.displayMedium;
  static const TextStyle displaySmall = TextStyles.displaySmall;

  // Headline Styles
  static const TextStyle headlineLarge = TextStyles.headlineLarge;
  static const TextStyle headlineMedium = TextStyles.headlineMedium;
  static const TextStyle headlineSmall = TextStyles.headlineSmall;

  // Title Styles
  static const TextStyle titleLarge = TextStyles.titleLarge;
  static const TextStyle titleMedium = TextStyles.titleMedium;
  static const TextStyle titleSmall = TextStyles.titleSmall;

  // Body Styles
  static const TextStyle bodyLarge = TextStyles.bodyLarge;
  static const TextStyle bodyMedium = TextStyles.bodyMedium;
  static const TextStyle bodySmall = TextStyles.bodySmall;

  // Label Styles
  static const TextStyle labelLarge = TextStyles.labelLarge;
  static const TextStyle labelMedium = TextStyles.labelMedium;
  static const TextStyle labelSmall = TextStyles.labelSmall;

  // Custom Styles
  static const TextStyle caption = TextStyles.caption;
  static const TextStyle overline = TextStyles.overline;

  // Button Styles
  static const TextStyle buttonLarge = TextStyles.buttonLarge;
  static const TextStyle buttonMedium = TextStyles.buttonMedium;
  static const TextStyle buttonSmall = TextStyles.buttonSmall;

  /// Get text style with primary color
  static TextStyle withPrimaryColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.primary);
  }

  /// Get text style with secondary color
  static TextStyle withSecondaryColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.secondary);
  }

  /// Get text style with error color
  static TextStyle withErrorColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.error);
  }

  /// Get text style with success color
  static TextStyle withSuccessColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.success);
  }

  /// Get text style with warning color
  static TextStyle withWarningColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.warning);
  }

  /// Get text style with info color
  static TextStyle withInfoColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.info);
  }

  /// Get text style with text primary color
  static TextStyle withTextPrimaryColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.textPrimary);
  }

  /// Get text style with text secondary color
  static TextStyle withTextSecondaryColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.textSecondary);
  }

  /// Get text style with text disabled color
  static TextStyle withTextDisabledColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.textDisabled);
  }

  /// Get text style with text inverse color
  static TextStyle withTextInverseColor(TextStyle style) {
    return TextStyles.withColor(style, AppColors.textInverse);
  }

  /// Get text style with custom color
  static TextStyle withColor(TextStyle style, Color color) {
    return TextStyles.withColor(style, color);
  }

  /// Get text style with bold weight
  static TextStyle withBoldWeight(TextStyle style) {
    return TextStyles.withWeight(style, FontWeight.bold);
  }

  /// Get text style with medium weight
  static TextStyle withMediumWeight(TextStyle style) {
    return TextStyles.withWeight(style, FontWeight.w500);
  }

  /// Get text style with light weight
  static TextStyle withLightWeight(TextStyle style) {
    return TextStyles.withWeight(style, FontWeight.w300);
  }

  /// Get text style with custom weight
  static TextStyle withWeight(TextStyle style, FontWeight weight) {
    return TextStyles.withWeight(style, weight);
  }

  /// Get text style with custom size
  static TextStyle withSize(TextStyle style, double size) {
    return TextStyles.withSize(style, size);
  }

  /// Get text style with custom letter spacing
  static TextStyle withLetterSpacing(TextStyle style, double spacing) {
    return TextStyles.withLetterSpacing(style, spacing);
  }

  /// Get text style with custom height
  static TextStyle withHeight(TextStyle style, double height) {
    return TextStyles.withHeight(style, height);
  }
}
