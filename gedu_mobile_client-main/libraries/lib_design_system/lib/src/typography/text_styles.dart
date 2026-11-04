import 'package:flutter/material.dart';
import 'font_constants.dart';

/// Text styles for the design system
class TextStyles {
  TextStyles._();

  // Display Styles
  static const TextStyle displayLarge = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl9,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  static const TextStyle displayMedium = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl8,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  static const TextStyle displaySmall = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl7,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  // Headline Styles
  static const TextStyle headlineLarge = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl6,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  static const TextStyle headlineMedium = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl4, // 28.0
    fontWeight: FontWeight.w600, // semibold
    letterSpacing: FontConstants.letterSpacingTighter, // -0.28
    height: 1.29, // specific height from specification
  );

  static const TextStyle headlineSmall = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl4,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  // Title Styles
  static const TextStyle titleLarge = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl3,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  static const TextStyle titleMedium = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl2,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  static const TextStyle titleSmall = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xl,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingTight,
    height: FontConstants.lineHeightTight,
  );

  // Body Styles
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.lg,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.base,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.sm,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  // Label Styles
  static const TextStyle labelLarge = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.base,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle labelMedium = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.sm,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle labelSmall = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xs,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  // Custom Styles
  static const TextStyle caption = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xs,
    fontWeight: FontWeight.w400,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle overline = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.xs,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingWide,
    height: FontConstants.lineHeightNormal,
  );

  // Onboarding Styles
  static const TextStyle onboardingSubtitle = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.40,
    letterSpacing: -0.16,
  );

  // Button Styles
  static const TextStyle buttonLarge = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.lg,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle buttonMedium = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.base,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  static const TextStyle buttonSmall = TextStyle(
    fontFamily: FontConstants.primaryFont,
    fontSize: FontConstants.sm,
    fontWeight: FontWeight.w500,
    letterSpacing: FontConstants.letterSpacingNormal,
    height: FontConstants.lineHeightNormal,
  );

  /// Get text style with color
  static TextStyle withColor(TextStyle style, Color color) {
    return style.copyWith(color: color);
  }

  /// Get text style with font weight
  static TextStyle withWeight(TextStyle style, FontWeight weight) {
    return style.copyWith(fontWeight: weight);
  }

  /// Get text style with font size
  static TextStyle withSize(TextStyle style, double size) {
    return style.copyWith(fontSize: size);
  }

  /// Get text style with letter spacing
  static TextStyle withLetterSpacing(TextStyle style, double spacing) {
    return style.copyWith(letterSpacing: spacing);
  }

  /// Get text style with height
  static TextStyle withHeight(TextStyle style, double height) {
    return style.copyWith(height: height);
  }
}
