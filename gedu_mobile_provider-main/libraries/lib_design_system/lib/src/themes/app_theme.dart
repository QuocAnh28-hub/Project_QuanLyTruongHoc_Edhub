import 'package:flutter/material.dart';

import 'theme_data.dart';

/// Main theme class that provides access to all design system themes
class AppTheme {
  AppTheme._();

  /// Light theme data
  static ThemeData get light => AppThemeData.light;

  /// Dark theme data
  static ThemeData get dark => AppThemeData.dark;

  /// Get theme data based on brightness
  static ThemeData getTheme(Brightness brightness) {
    return brightness == Brightness.light ? light : dark;
  }

  /// Get theme data based on platform brightness
  static ThemeData getThemeFromPlatform(BuildContext context) {
    return getTheme(Theme.of(context).brightness);
  }

  /// Check if current theme is dark
  static bool isDark(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark;
  }

  /// Check if current theme is light
  static bool isLight(BuildContext context) {
    return Theme.of(context).brightness == Brightness.light;
  }
} 