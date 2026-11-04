import 'package:flutter/material.dart';

import '../colors/color_scheme.dart';
import '../typography/app_typography.dart';

/// Theme data for the design system
class AppThemeData {
  AppThemeData._();

  /// Light theme data
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: AppColorScheme.light,
    textTheme: _getTextTheme(Brightness.light),
    primaryTextTheme: _getTextTheme(Brightness.light),
    appBarTheme: _getAppBarTheme(Brightness.light),
    bottomNavigationBarTheme: _getBottomNavigationBarTheme(Brightness.light),
    cardTheme: _getCardTheme(Brightness.light),
    elevatedButtonTheme: _getElevatedButtonTheme(Brightness.light),
    outlinedButtonTheme: _getOutlinedButtonTheme(Brightness.light),
    textButtonTheme: _getTextButtonTheme(Brightness.light),
    inputDecorationTheme: _getInputDecorationTheme(Brightness.light),
    chipTheme: _getChipTheme(Brightness.light),
    dividerTheme: _getDividerTheme(Brightness.light),
    iconTheme: _getIconTheme(Brightness.light),
    primaryIconTheme: _getIconTheme(Brightness.light),
    floatingActionButtonTheme: _getFloatingActionButtonTheme(Brightness.light),
    snackBarTheme: _getSnackBarTheme(Brightness.light),
    dialogTheme: _getDialogTheme(Brightness.light),
    bottomSheetTheme: _getBottomSheetTheme(Brightness.light),
    switchTheme: _getSwitchTheme(Brightness.light),
    checkboxTheme: _getCheckboxTheme(Brightness.light),
    radioTheme: _getRadioTheme(Brightness.light),
    sliderTheme: _getSliderTheme(Brightness.light),
    tabBarTheme: _getTabBarTheme(Brightness.light),
    listTileTheme: _getListTileTheme(Brightness.light),
    expansionTileTheme: _getExpansionTileTheme(Brightness.light),
    tooltipTheme: _getTooltipTheme(Brightness.light),
    progressIndicatorTheme: _getProgressIndicatorTheme(Brightness.light),
    scrollbarTheme: _getScrollbarTheme(Brightness.light),
    dataTableTheme: _getDataTableTheme(Brightness.light),
  );

  /// Dark theme data
  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: AppColorScheme.dark,
    textTheme: _getTextTheme(Brightness.dark),
    primaryTextTheme: _getTextTheme(Brightness.dark),
    appBarTheme: _getAppBarTheme(Brightness.dark),
    bottomNavigationBarTheme: _getBottomNavigationBarTheme(Brightness.dark),
    cardTheme: _getCardTheme(Brightness.dark),
    elevatedButtonTheme: _getElevatedButtonTheme(Brightness.dark),
    outlinedButtonTheme: _getOutlinedButtonTheme(Brightness.dark),
    textButtonTheme: _getTextButtonTheme(Brightness.dark),
    inputDecorationTheme: _getInputDecorationTheme(Brightness.dark),
    chipTheme: _getChipTheme(Brightness.dark),
    dividerTheme: _getDividerTheme(Brightness.dark),
    iconTheme: _getIconTheme(Brightness.dark),
    primaryIconTheme: _getIconTheme(Brightness.dark),
    floatingActionButtonTheme: _getFloatingActionButtonTheme(Brightness.dark),
    snackBarTheme: _getSnackBarTheme(Brightness.dark),
    dialogTheme: _getDialogTheme(Brightness.dark),
    bottomSheetTheme: _getBottomSheetTheme(Brightness.dark),
    switchTheme: _getSwitchTheme(Brightness.dark),
    checkboxTheme: _getCheckboxTheme(Brightness.dark),
    radioTheme: _getRadioTheme(Brightness.dark),
    sliderTheme: _getSliderTheme(Brightness.dark),
    tabBarTheme: _getTabBarTheme(Brightness.dark),
    listTileTheme: _getListTileTheme(Brightness.dark),
    expansionTileTheme: _getExpansionTileTheme(Brightness.dark),
    tooltipTheme: _getTooltipTheme(Brightness.dark),
    progressIndicatorTheme: _getProgressIndicatorTheme(Brightness.dark),
    scrollbarTheme: _getScrollbarTheme(Brightness.dark),
    dataTableTheme: _getDataTableTheme(Brightness.dark),
  );

  /// Get theme data based on brightness
  static ThemeData getThemeData(Brightness brightness) {
    return brightness == Brightness.light ? light : dark;
  }

  // Private helper methods for theme components
  static TextTheme _getTextTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return TextTheme(
      displayLarge: AppTypography.displayLarge.copyWith(
        color: colorScheme.onSurface,
      ),
      displayMedium: AppTypography.displayMedium.copyWith(
        color: colorScheme.onSurface,
      ),
      displaySmall: AppTypography.displaySmall.copyWith(
        color: colorScheme.onSurface,
      ),
      headlineLarge: AppTypography.headlineLarge.copyWith(
        color: colorScheme.onSurface,
      ),
      headlineMedium: AppTypography.headlineMedium.copyWith(
        color: colorScheme.onSurface,
      ),
      headlineSmall: AppTypography.headlineSmall.copyWith(
        color: colorScheme.onSurface,
      ),
      titleLarge: AppTypography.titleLarge.copyWith(
        color: colorScheme.onSurface,
      ),
      titleMedium: AppTypography.titleMedium.copyWith(
        color: colorScheme.onSurface,
      ),
      titleSmall: AppTypography.titleSmall.copyWith(
        color: colorScheme.onSurface,
      ),
      bodyLarge: AppTypography.bodyLarge.copyWith(color: colorScheme.onSurface),
      bodyMedium: AppTypography.bodyMedium.copyWith(
        color: colorScheme.onSurface,
      ),
      bodySmall: AppTypography.bodySmall.copyWith(color: colorScheme.onSurface),
      labelLarge: AppTypography.labelLarge.copyWith(
        color: colorScheme.onSurface,
      ),
      labelMedium: AppTypography.labelMedium.copyWith(
        color: colorScheme.onSurface,
      ),
      labelSmall: AppTypography.labelSmall.copyWith(
        color: colorScheme.onSurface,
      ),
    );
  }

  static AppBarTheme _getAppBarTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return AppBarTheme(
      backgroundColor: colorScheme.surface,
      foregroundColor: colorScheme.onSurface,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: AppTypography.titleMedium.copyWith(
        color: colorScheme.onSurface,
      ),
    );
  }

  static BottomNavigationBarThemeData _getBottomNavigationBarTheme(
    Brightness brightness,
  ) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return BottomNavigationBarThemeData(
      backgroundColor: colorScheme.surface,
      selectedItemColor: colorScheme.primary,
      unselectedItemColor: colorScheme.onSurfaceVariant,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
    );
  }

  // Remove unsupported theme methods
  // static StepperThemeData _getStepperTheme(Brightness brightness) => StepperThemeData();
  // static DatePickerThemeData _getDatePickerTheme(Brightness brightness) => DatePickerThemeData();
  // static TimePickerThemeData _getTimePickerTheme(Brightness brightness) => TimePickerThemeData();
  // static BadgeThemeData _getBadgeTheme(Brightness brightness) => BadgeThemeData();
  // static PaginatedDataTableThemeData _getPaginatedDataTableTheme(Brightness brightness) => PaginatedDataTableThemeData();

  static ElevatedButtonThemeData _getElevatedButtonTheme(
    Brightness brightness,
  ) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: colorScheme.primary,
        foregroundColor: colorScheme.onPrimary,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        minimumSize: const Size(88, 48),
      ),
    );
  }

  static OutlinedButtonThemeData _getOutlinedButtonTheme(
    Brightness brightness,
  ) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: colorScheme.primary,
        side: BorderSide(color: colorScheme.primary),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        minimumSize: const Size(88, 48),
      ),
    );
  }

  static TextButtonThemeData _getTextButtonTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: colorScheme.primary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        minimumSize: const Size(88, 48),
      ),
    );
  }

  static CardThemeData _getCardTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return CardThemeData(
      color: colorScheme.surface,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }

  static DialogThemeData _getDialogTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return DialogThemeData(
      backgroundColor: colorScheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      titleTextStyle: AppTypography.titleLarge.copyWith(
        color: colorScheme.onSurface,
      ),
      contentTextStyle: AppTypography.bodyMedium.copyWith(
        color: colorScheme.onSurface,
      ),
    );
  }

  static TabBarThemeData _getTabBarTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return TabBarThemeData(
      labelColor: colorScheme.primary,
      unselectedLabelColor: colorScheme.onSurfaceVariant,
      indicator: UnderlineTabIndicator(
        borderSide: BorderSide(color: colorScheme.primary, width: 2),
      ),
    );
  }

  static InputDecorationTheme _getInputDecorationTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return InputDecorationTheme(
      // Use outlined style (no fill)
      filled: false,
      isDense: true,
      // Default outline border
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: colorScheme.outline, width: 1.0),
      ),
      // Enabled state border
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: colorScheme.outline, width: 1.0),
      ),
      // Focused state border
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: colorScheme.primary, width: 2.0),
      ),
      // Error state border
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: colorScheme.error, width: 1.0),
      ),
      // Focused error state border
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: colorScheme.error, width: 2.0),
      ),
      // Disabled state border
      disabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(
          color: colorScheme.outline.withValues(alpha: 0.3),
          width: 1.0,
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    );
  }

  // Additional theme methods would be implemented here...
  // For brevity, I'll include just the essential ones

  static ChipThemeData _getChipTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return ChipThemeData(
      backgroundColor: colorScheme.surfaceContainerHighest,
      selectedColor: colorScheme.primary,
      disabledColor: colorScheme.onSurface.withValues(alpha: 0.12),
      labelStyle: AppTypography.bodyMedium,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );
  }

  static DividerThemeData _getDividerTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return DividerThemeData(color: colorScheme.outline, thickness: 1, space: 1);
  }

  static IconThemeData _getIconTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return IconThemeData(color: colorScheme.onSurface, size: 24);
  }

  static FloatingActionButtonThemeData _getFloatingActionButtonTheme(
    Brightness brightness,
  ) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return FloatingActionButtonThemeData(
      backgroundColor: colorScheme.primary,
      foregroundColor: colorScheme.onPrimary,
      elevation: 6,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    );
  }

  static SnackBarThemeData _getSnackBarTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return SnackBarThemeData(
      backgroundColor: colorScheme.surface,
      contentTextStyle: AppTypography.bodyMedium.copyWith(
        color: colorScheme.onSurface,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      behavior: SnackBarBehavior.floating,
    );
  }

  static BottomSheetThemeData _getBottomSheetTheme(Brightness brightness) {
    final colorScheme = AppColorScheme.getColorScheme(brightness);
    return BottomSheetThemeData(
      backgroundColor: colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
    );
  }

  // Placeholder methods for remaining theme components
  static SwitchThemeData _getSwitchTheme(Brightness brightness) =>
      SwitchThemeData();
  static CheckboxThemeData _getCheckboxTheme(Brightness brightness) =>
      CheckboxThemeData();
  static RadioThemeData _getRadioTheme(Brightness brightness) =>
      RadioThemeData();
  static SliderThemeData _getSliderTheme(Brightness brightness) =>
      SliderThemeData();
  static ListTileThemeData _getListTileTheme(Brightness brightness) =>
      ListTileThemeData();
  static ExpansionTileThemeData _getExpansionTileTheme(Brightness brightness) =>
      ExpansionTileThemeData();
  static TooltipThemeData _getTooltipTheme(Brightness brightness) =>
      TooltipThemeData();
  static ProgressIndicatorThemeData _getProgressIndicatorTheme(
    Brightness brightness,
  ) => ProgressIndicatorThemeData();
  static ScrollbarThemeData _getScrollbarTheme(Brightness brightness) =>
      ScrollbarThemeData();
  static DataTableThemeData _getDataTableTheme(Brightness brightness) =>
      DataTableThemeData();
}
