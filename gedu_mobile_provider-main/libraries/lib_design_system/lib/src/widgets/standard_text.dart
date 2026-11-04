import 'package:flutter/material.dart';
import '../typography/text_styles.dart';

/// Standard text widget for consistent typography across the app
class StandardText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final Color? color;
  final FontWeight? fontWeight;
  final double? fontSize;
  final double? height;
  final double? letterSpacing;

  const StandardText(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
    this.fontWeight,
    this.fontSize,
    this.height,
    this.letterSpacing,
  });

  /// Display large text
  const StandardText.displayLarge(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.displayLarge,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Display medium text
  const StandardText.displayMedium(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.displayMedium,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Display small text
  const StandardText.displaySmall(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.displaySmall,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Headline large text
  const StandardText.headlineLarge(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.headlineLarge,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Headline medium text
  const StandardText.headlineMedium(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.headlineMedium,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Headline small text
  const StandardText.headlineSmall(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.headlineSmall,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Title large text
  const StandardText.titleLarge(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.titleLarge,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Title medium text
  const StandardText.titleMedium(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.titleMedium,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Title small text
  const StandardText.titleSmall(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.titleSmall,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Body large text
  const StandardText.bodyLarge(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.bodyLarge,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Body medium text
  const StandardText.bodyMedium(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.bodyMedium,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Body small text
  const StandardText.bodySmall(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.bodySmall,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Label large text
  const StandardText.labelLarge(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.labelLarge,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Label medium text
  const StandardText.labelMedium(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.labelMedium,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Label small text
  const StandardText.labelSmall(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.labelSmall,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Caption text
  const StandardText.caption(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.caption,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Overline text
  const StandardText.overline(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.overline,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Button large text
  const StandardText.buttonLarge(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.buttonLarge,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Button medium text
  const StandardText.buttonMedium(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.buttonMedium,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Button small text
  const StandardText.buttonSmall(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.buttonSmall,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  /// Onboarding subtitle text
  const StandardText.onboardingSubtitle(
    this.text, {
    super.key,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.color,
  }) : style = TextStyles.onboardingSubtitle,
       fontWeight = null,
       fontSize = null,
       height = null,
       letterSpacing = null;

  @override
  Widget build(BuildContext context) {
    TextStyle finalStyle = style ?? TextStyles.bodyMedium;

    // Apply custom properties if provided
    if (color != null) {
      finalStyle = finalStyle.copyWith(color: color);
    }
    if (fontWeight != null) {
      finalStyle = finalStyle.copyWith(fontWeight: fontWeight);
    }
    if (fontSize != null) {
      finalStyle = finalStyle.copyWith(fontSize: fontSize);
    }
    if (height != null) {
      finalStyle = finalStyle.copyWith(height: height);
    }
    if (letterSpacing != null) {
      finalStyle = finalStyle.copyWith(letterSpacing: letterSpacing);
    }

    return Text(
      text,
      style: finalStyle,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }
}
