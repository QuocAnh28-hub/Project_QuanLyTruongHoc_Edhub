import 'package:flutter/material.dart';

/// Color constants for the design system
class ColorConstants {
  ColorConstants._();

  // Primary Colors
  static const Color primary = Color(0xFF1976D2);
  static const Color primaryLight = Color(0xFF42A5F5);
  static const Color primaryDark = Color(0xFF1565C0);

  // Secondary Colors
  static const Color secondary = Color(0xFF26A69A);
  static const Color secondaryLight = Color(0xFF4DB6AC);
  static const Color secondaryDark = Color(0xFF00897B);

  // Accent Colors
  static const Color accent = Color(0xFFFF9800);
  static const Color accentLight = Color(0xFFFFB74D);
  static const Color accentDark = Color(0xFFF57C00);

  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color transparent = Color(0x00000000);

  // Gray Scale
  static const Color gray50 = Color(0xFFFAFAFA);
  static const Color gray100 = Color(0xFFF5F5F5);
  static const Color gray200 = Color(0xFFEEEEEE);
  static const Color gray300 = Color(0xFFE0E0E0);
  static const Color gray400 = Color(0xFFBDBDBD);
  static const Color gray500 = Color(0xFF9E9E9E);
  static const Color gray600 = Color(0xFF757575);
  static const Color gray700 = Color(0xFF616161);
  static const Color gray800 = Color(0xFF424242);
  static const Color gray900 = Color(0xFF212121);

  // Status Colors
  static const Color success = Color(0xFF4CAF50);
  static const Color successLight = Color(0xFF81C784);
  static const Color successDark = Color(0xFF388E3C);

  static const Color warning = Color(0xFFFF9800);
  static const Color warningLight = Color(0xFFFFB74D);
  static const Color warningDark = Color(0xFFF57C00);

  static const Color error = Color(0xFFF44336);
  static const Color errorLight = Color(0xFFE57373);
  static const Color errorDark = Color(0xFFD32F2F);

  static const Color info = Color(0xFF2196F3);
  static const Color infoLight = Color(0xFF64B5F6);
  static const Color infoDark = Color(0xFF1976D2);

  // Background Colors
  static const Color background = Color(0xFFF4F7FF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color cardBackground = Color(0xFFFFFFFF);
  static const Color appBackground = Color(0xFFF5F7FF);
  static const Color navBarBackground = Color(
    0xFFD7E4FF,
  ); // Navigation bar background color

  // Text Colors
  static const Color textPrimary = Color(0xFF17161B);
  static const Color textSecondary = Color(0xFF3F454C);
  static const Color textDisabled = Color(0xFFBDBDBD);
  static const Color textInverse = Color(0xFFFFFFFF);
  static const Color textCustom = Color(0xFF625B71);
  static const Color textSecondaryDark = Color(0xFF625B71);

  // Material 3 Colors
  static const Color onSurfaceVariant = Color(
    0xFF49454F,
  ); // M3/sys/light/on-surface-variant

  // Focus Colors
  static const Color focusBlue = Color(0xFF3A61EA); // Primary focus color

  // Button Colors
  static const Color buttonBlue = Color(0xFF3760FA); // Button background color
  static const Color buttonTextWhite = Color(0xFFFFFFFF); // Button text color

  // Logo Colors
  static const Color logoBlue = Color(0xFF3760FA); // Logo blue background
  static const Color logoRed = Color(0xFFE53E3E); // Logo red text

  // Onboarding Colors
  static const Color onboardingDescription = Color(
    0xFF263238,
  ); // Onboarding description text color

  // Border Colors
  static const Color border = Color(0xFFE0E0E0);
  static const Color borderLight = Color(0xFFF5F5F5);
  static const Color borderDark = Color(0xFFBDBDBD);
  static const Color textFieldBorder = Color(
    0x6679747E,
  ); // Text field border color
  static const Color textFieldFocusBorder = Color(
    0xFF3A61EA,
  ); // Text field focus border color

  // Shadow Colors
  static const Color shadow = Color(0x1A000000);
  static const Color shadowLight = Color(0x0A000000);
  static const Color shadowDark = Color(0x33000000);

  // Overlay Colors
  static const Color overlay = Color(0x80000000);
  static const Color overlayLight = Color(0x40000000);
  static const Color overlayDark = Color(0xCC000000);

  // Selection Colors
  static const Color selectionRed = Color(
    0xFFF65E53,
  ); // Reddish-orange selection color
  static const Color selectionBlue = Color(0xFF6E9BF8); // Blue selection color
  static const Color selectionBlue60 = Color(
    0x996E9BF8,
  ); // Blue selection color with 60% opacity
  static const Color selectionWhite1 = Color(
    0x03FFFFFF,
  ); // Nearly transparent white (1% opacity)

  // Student Selection Colors
  static const Color studentSelectionBlue = Color(
    0xFFD7E4FF,
  ); // Student selection blue
  static const Color studentSelectionGray = Color(
    0xFFEBEBEB,
  ); // Student selection gray

  // Background Colors
  static const Color profileBackground = Color(
    0xFFF5F7FF,
  ); // Profile section background

  static const Color lightGray = Color(0xFFEAEAEA);
  static const Color darkSlate = Color(0xFF3F454C);
  static const Color emeraldGreen = Color(0xFF00966E);
  static const Color amberOrange = Color(0xFFFB8600);
  static const Color lightBlueBackground = Color(0xFFEBF0FA);

  // Status Badge Colors
  static const Color warningBadgeBackground = Color(
    0xFFFFEDC7,
  ); // Warning badge background
  static const Color warningBadgeText = Color(0xFFC65200); // Warning badge text
  static Color warningBadgeBorder = Color(
    0xFFED6403,
  ).withValues(alpha: 0.2); // Warning badge border

  static const Color neutralBadgeBackground = Color(
    0xFFECECEC,
  ); // Neutral badge background
  static const Color neutralBadgeBorder = Color(
    0xFFB9B9B9,
  ); // Neutral badge border

  static const Color successBadgeBackground = Color(
    0xFFCCF7E8,
  ); // Success badge background
  static const Color successBadgeText = Color(0xFF006042); // Success badge text
  static const Color successBadgeBorder = Color(
    0xFF006042,
  ); // Success badge border
}
