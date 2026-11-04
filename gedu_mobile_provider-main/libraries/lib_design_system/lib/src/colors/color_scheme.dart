import 'package:flutter/material.dart';

import 'color_constants.dart';

/// Color scheme for the app
class AppColorScheme {
  AppColorScheme._();

  /// Light color scheme
  static const ColorScheme light = ColorScheme(
    brightness: Brightness.light,
    primary: ColorConstants.primary,
    onPrimary: ColorConstants.white,
    secondary: ColorConstants.secondary,
    onSecondary: ColorConstants.white,
    tertiary: ColorConstants.accent,
    onTertiary: ColorConstants.white,
    error: ColorConstants.error,
    onError: ColorConstants.white,
    surface: ColorConstants.surface,
    onSurface: ColorConstants.textPrimary,
    surfaceContainerHighest: ColorConstants.gray100,
    onSurfaceVariant: ColorConstants.textSecondary,
    outline: ColorConstants.border,
    outlineVariant: ColorConstants.borderLight,
    shadow: ColorConstants.shadow,
    scrim: ColorConstants.overlay,
    inverseSurface: ColorConstants.gray900,
    onInverseSurface: ColorConstants.white,
    inversePrimary: ColorConstants.primaryLight,
    surfaceTint: ColorConstants.primary,
  );

  /// Dark color scheme
  static const ColorScheme dark = ColorScheme(
    brightness: Brightness.dark,
    primary: ColorConstants.primaryLight,
    onPrimary: ColorConstants.black,
    secondary: ColorConstants.secondaryLight,
    onSecondary: ColorConstants.black,
    tertiary: ColorConstants.accentLight,
    onTertiary: ColorConstants.black,
    error: ColorConstants.errorLight,
    onError: ColorConstants.black,
    surface: ColorConstants.gray800,
    onSurface: ColorConstants.white,
    surfaceContainerHighest: ColorConstants.gray700,
    onSurfaceVariant: ColorConstants.gray300,
    outline: ColorConstants.gray600,
    outlineVariant: ColorConstants.gray700,
    shadow: ColorConstants.shadowDark,
    scrim: ColorConstants.overlayDark,
    inverseSurface: ColorConstants.gray100,
    onInverseSurface: ColorConstants.black,
    inversePrimary: ColorConstants.primaryDark,
    surfaceTint: ColorConstants.primaryLight,
  );

  /// Get color scheme based on brightness
  static ColorScheme getColorScheme(Brightness brightness) {
    return brightness == Brightness.light ? light : dark;
  }

  /// Get primary color based on brightness
  static Color getPrimaryColor(Brightness brightness) {
    return brightness == Brightness.light
        ? ColorConstants.primary
        : ColorConstants.primaryLight;
  }

  /// Get background color based on brightness
  static Color getBackgroundColor(Brightness brightness) {
    return brightness == Brightness.light
        ? ColorConstants.background
        : ColorConstants.gray900;
  }

  /// Get surface color based on brightness
  static Color getSurfaceColor(Brightness brightness) {
    return brightness == Brightness.light
        ? ColorConstants.surface
        : ColorConstants.gray800;
  }

  /// Get text color based on brightness
  static Color getTextColor(Brightness brightness) {
    return brightness == Brightness.light
        ? ColorConstants.textPrimary
        : ColorConstants.white;
  }

  /// Get secondary text color based on brightness
  static Color getSecondaryTextColor(Brightness brightness) {
    return brightness == Brightness.light
        ? ColorConstants.textSecondary
        : ColorConstants.gray300;
  }
}
