import 'package:flutter/material.dart';

import '../colors/app_colors.dart';
import '../colors/color_constants.dart';
import '../spacing/app_spacing.dart';

/// Button styles for the design system
class AppButtonStyles {
  AppButtonStyles._();

  /// Primary button style with focus blue background
  static ButtonStyle get primary => ElevatedButton.styleFrom(
    backgroundColor: ColorConstants.focusBlue,
    foregroundColor: ColorConstants.buttonTextWhite,
    elevation: AppSpacing.elevation2px,
    shape: const StadiumBorder(),
    padding: AppSpacing.symmetric(
      horizontal: AppSpacing.space6x,
      vertical: AppSpacing.space3x,
    ),
    textStyle: TextStyle(
      color: ColorConstants.buttonTextWhite,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: FontWeight.w500,
      height: 1.50,
      letterSpacing: 0.02,
    ),
  );

  /// Secondary button style
  static ButtonStyle get secondary => ElevatedButton.styleFrom(
    backgroundColor: AppColors.surface,
    foregroundColor: AppColors.primary,
    elevation: AppSpacing.elevation1px,
    shape: const StadiumBorder(side: BorderSide(color: AppColors.primary)),
    padding: AppSpacing.symmetric(
      horizontal: AppSpacing.space6x,
      vertical: AppSpacing.space3x,
    ),
    textStyle: const TextStyle(
      color: AppColors.primary,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: FontWeight.w500,
      height: 1.50,
      letterSpacing: 0.02,
    ),
  );

  /// Text button style
  static ButtonStyle get text => TextButton.styleFrom(
    foregroundColor: AppColors.primary,
    shape: const StadiumBorder(),
    padding: AppSpacing.symmetric(
      horizontal: AppSpacing.space6x,
      vertical: AppSpacing.space3x,
    ),
    textStyle: const TextStyle(
      color: AppColors.primary,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: FontWeight.w500,
      height: 1.50,
      letterSpacing: 0.02,
    ),
  );

  /// Disabled button style
  static ButtonStyle get disabled => ElevatedButton.styleFrom(
    backgroundColor: AppColors.textSecondary.withValues(alpha: 0.3),
    foregroundColor: AppColors.textSecondary,
    elevation: 0,
    shape: const StadiumBorder(),
    padding: AppSpacing.symmetric(
      horizontal: AppSpacing.space6x,
      vertical: AppSpacing.space3x,
    ),
    textStyle: TextStyle(
      color: AppColors.textSecondary,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: FontWeight.w500,
      height: 1.50,
      letterSpacing: 0.02,
    ),
  );

  /// Custom button style with specified colors
  static ButtonStyle custom({
    required Color backgroundColor,
    required Color foregroundColor,
    double? elevation,
    BorderSide? side,
  }) => ElevatedButton.styleFrom(
    backgroundColor: backgroundColor,
    foregroundColor: foregroundColor,
    elevation: elevation ?? AppSpacing.elevation2px,
    shape: StadiumBorder(side: side ?? BorderSide.none),
    padding: AppSpacing.symmetric(
      horizontal: AppSpacing.space6x,
      vertical: AppSpacing.space3x,
    ),
    textStyle: TextStyle(
      color: foregroundColor,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: FontWeight.w500,
      height: 1.50,
      letterSpacing: 0.02,
    ),
  );

  /// Custom rounded button style with radius as height/2 (pill-shaped)
  /// Use this for buttons that need to be completely rounded based on their height
  static ButtonStyle rounded({
    required Color backgroundColor,
    required Color foregroundColor,
    double? elevation,
    BorderSide? side,
    double? fontSize,
    FontWeight? fontWeight,
  }) =>
      ElevatedButton.styleFrom(
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        elevation: elevation ?? AppSpacing.elevation2px,
        padding: AppSpacing.symmetric(
          horizontal: AppSpacing.space6x,
          vertical: AppSpacing.space3x,
        ),
        shape: const StadiumBorder(side: BorderSide.none),
        textStyle: TextStyle(
          color: foregroundColor,
          fontSize: fontSize ?? 16,
          fontFamily: 'Inter',
          fontWeight: fontWeight ?? FontWeight.w500,
          height: 1.50,
          letterSpacing: 0.02,
        ),
      ).copyWith(
        shape: side != null
            ? WidgetStateProperty.all(StadiumBorder(side: side))
            : null,
      );

  /// Primary rounded button (pill-shaped with primary colors)
  static ButtonStyle get primaryRounded => rounded(
    backgroundColor: ColorConstants.focusBlue,
    foregroundColor: ColorConstants.buttonTextWhite,
  );

  /// Secondary rounded button (pill-shaped with secondary colors)
  static ButtonStyle get secondaryRounded => rounded(
    backgroundColor: AppColors.surface,
    foregroundColor: AppColors.primary,
    side: const BorderSide(color: AppColors.primary),
  );

  /// Custom rounded button with manual radius control
  /// For cases where you need precise control over the border radius
  static ButtonStyle customRounded({
    required Color backgroundColor,
    required Color foregroundColor,
    required double borderRadius,
    double? elevation,
    BorderSide? side,
    EdgeInsetsGeometry? padding,
    double? fontSize,
    FontWeight? fontWeight,
  }) => ElevatedButton.styleFrom(
    backgroundColor: backgroundColor,
    foregroundColor: foregroundColor,
    elevation: elevation ?? AppSpacing.elevation2px,
    padding:
        padding ??
        AppSpacing.symmetric(
          horizontal: AppSpacing.space6x,
          vertical: AppSpacing.space3x,
        ),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(borderRadius),
      side: side ?? BorderSide.none,
    ),
    textStyle: TextStyle(
      color: foregroundColor,
      fontSize: fontSize ?? 16,
      fontFamily: 'Inter',
      fontWeight: fontWeight ?? FontWeight.w500,
      height: 1.50,
      letterSpacing: 0.02,
    ),
  );
}
