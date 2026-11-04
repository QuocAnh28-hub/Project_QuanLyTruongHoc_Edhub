import 'package:flutter/material.dart';

import 'color_constants.dart';

/// Main app colors class that provides access to all design system colors
class AppColors {
  AppColors._();

  // Primary Colors
  static const Color primary = ColorConstants.primary;
  static const Color primaryLight = ColorConstants.primaryLight;
  static const Color primaryDark = ColorConstants.primaryDark;

  // Secondary Colors
  static const Color secondary = ColorConstants.secondary;
  static const Color secondaryLight = ColorConstants.secondaryLight;
  static const Color secondaryDark = ColorConstants.secondaryDark;

  // Accent Colors
  static const Color accent = ColorConstants.accent;
  static const Color accentLight = ColorConstants.accentLight;
  static const Color accentDark = ColorConstants.accentDark;

  // Neutral Colors
  static const Color white = ColorConstants.white;
  static const Color black = ColorConstants.black;
  static const Color transparent = ColorConstants.transparent;

  // Gray Scale
  static const Color gray50 = ColorConstants.gray50;
  static const Color gray100 = ColorConstants.gray100;
  static const Color gray200 = ColorConstants.gray200;
  static const Color gray300 = ColorConstants.gray300;
  static const Color gray400 = ColorConstants.gray400;
  static const Color gray500 = ColorConstants.gray500;
  static const Color gray600 = ColorConstants.gray600;
  static const Color gray700 = ColorConstants.gray700;
  static const Color gray800 = ColorConstants.gray800;
  static const Color gray900 = ColorConstants.gray900;

  // Status Colors
  static const Color success = ColorConstants.success;
  static const Color successLight = ColorConstants.successLight;
  static const Color successDark = ColorConstants.successDark;

  static const Color warning = ColorConstants.warning;
  static const Color warningLight = ColorConstants.warningLight;
  static const Color warningDark = ColorConstants.warningDark;

  static const Color error = ColorConstants.error;
  static const Color errorLight = ColorConstants.errorLight;
  static const Color errorDark = ColorConstants.errorDark;

  static const Color info = ColorConstants.info;
  static const Color infoLight = ColorConstants.infoLight;
  static const Color infoDark = ColorConstants.infoDark;

  // Background Colors
  static const Color background = ColorConstants.background;
  static const Color surface = ColorConstants.surface;
  static const Color cardBackground = ColorConstants.cardBackground;
  static const Color navBarBackground = ColorConstants.navBarBackground;
  static const Color appBackground = ColorConstants.appBackground;

  // Text Colors
  static const Color textPrimary = ColorConstants.textPrimary;
  static const Color textSecondary = ColorConstants.textSecondary;
  static const Color textDisabled = ColorConstants.textDisabled;
  static const Color textInverse = ColorConstants.textInverse;

  // Border Colors
  static const Color border = ColorConstants.border;
  static const Color borderLight = ColorConstants.borderLight;
  static const Color borderDark = ColorConstants.borderDark;
  static const Color textFieldBorder = ColorConstants.textFieldBorder;
  static const Color textFieldFocusBorder = ColorConstants.textFieldFocusBorder;

  // Focus Colors
  static const Color focusBlue = ColorConstants.focusBlue;

  // Shadow Colors
  static const Color shadow = ColorConstants.shadow;
  static const Color shadowLight = ColorConstants.shadowLight;
  static const Color shadowDark = ColorConstants.shadowDark;

  // Overlay Colors
  static const Color overlay = ColorConstants.overlay;
  static const Color overlayLight = ColorConstants.overlayLight;
  static const Color overlayDark = ColorConstants.overlayDark;

  // Selection Colors
  static const Color selectionRed = ColorConstants.selectionRed;
  static const Color selectionBlue = ColorConstants.selectionBlue;
  static const Color selectionBlue60 = ColorConstants.selectionBlue60;
  static const Color selectionWhite1 = ColorConstants.selectionWhite1;

  // Student Selection Colors
  static const Color studentSelectionBlue = ColorConstants.studentSelectionBlue;
  static const Color studentSelectionGray = ColorConstants.studentSelectionGray;

  // Background Colors
  static const Color profileBackground = ColorConstants.profileBackground;

  // Status Badge Colors
  static const Color warningBadgeBackground =
      ColorConstants.warningBadgeBackground;
  static const Color warningBadgeText = ColorConstants.warningBadgeText;
  static Color warningBadgeBorder = ColorConstants.warningBadgeBorder;

  static const Color neutralBadgeBackground =
      ColorConstants.neutralBadgeBackground;
  static const Color neutralBadgeBorder = ColorConstants.neutralBadgeBorder;

  static const Color successBadgeBackground =
      ColorConstants.successBadgeBackground;
  static const Color successBadgeText = ColorConstants.successBadgeText;
  static const Color successBadgeBorder = ColorConstants.successBadgeBorder;

  /// Get color with opacity
  static Color withOpacity(Color color, double opacity) {
    return color.withValues(alpha: opacity);
  }

  /// Get color with brightness adjustment
  static Color withBrightness(Color color, double brightness) {
    final hsl = HSLColor.fromColor(color);
    return hsl
        .withLightness((hsl.lightness + brightness).clamp(0.0, 1.0))
        .toColor();
  }

  /// Get color with saturation adjustment
  static Color withSaturation(Color color, double saturation) {
    final hsl = HSLColor.fromColor(color);
    return hsl.withSaturation(saturation.clamp(0.0, 1.0)).toColor();
  }
}
