import 'package:flutter/material.dart';

import 'spacing_constants.dart';
import '../colors/app_colors.dart';

/// Main app spacing class that provides access to all design system spacing values
class AppSpacing {
  AppSpacing._();

  // Base spacing values
  static const double space0_25x = SpacingConstants.space0_25x;
  static const double space0_5x = SpacingConstants.space0_5x;
  static const double space1x = SpacingConstants.space1x;
  static const double space1_5x = SpacingConstants.space1_5x;
  static const double space2x = SpacingConstants.space2x;
  static const double space3x = SpacingConstants.space3x;
  static const double space4x = SpacingConstants.space4x;
  static const double space5x = SpacingConstants.space5x;
  static const double space6x = SpacingConstants.space6x;
  static const double space8x = SpacingConstants.space8x;
  static const double space10x = SpacingConstants.space10x;
  static const double space12x = SpacingConstants.space12x;
  static const double space16x = SpacingConstants.space16x;
  static const double space20x = SpacingConstants.space20x;
  static const double space24x = SpacingConstants.space24x;
  static const double space32x = SpacingConstants.space32x;

  // Component spacing
  static const double buttonPadding = SpacingConstants.buttonPadding;
  static const double cardPadding = SpacingConstants.cardPadding;
  static const double inputPadding = SpacingConstants.inputPadding;
  static const double listItemPadding = SpacingConstants.listItemPadding;
  static const double dialogPadding = SpacingConstants.dialogPadding;
  static const double bottomSheetPadding = SpacingConstants.bottomSheetPadding;

  // Layout spacing
  static const double screenPadding = SpacingConstants.screenPadding;
  static const double sectionSpacing = SpacingConstants.sectionSpacing;
  static const double contentSpacing = SpacingConstants.contentSpacing;
  static const double headerSpacing = SpacingConstants.headerSpacing;
  static const double footerSpacing = SpacingConstants.footerSpacing;

  // Border radius
  static const double borderRadius2px = SpacingConstants.borderRadius2px;
  static const double borderRadius4px = SpacingConstants.borderRadius4px;
  static const double borderRadius8px = SpacingConstants.borderRadius8px;
  static const double borderRadius12px = SpacingConstants.borderRadius12px;
  static const double borderRadius16px = SpacingConstants.borderRadius16px;
  static const double borderRadius24px = SpacingConstants.borderRadius24px;
  static const double borderRadius32px = SpacingConstants.borderRadius32px;

  // Border width
  static const double borderWidth0_5px = SpacingConstants.borderWidth0_5px;
  static const double borderWidth1px = SpacingConstants.borderWidth1px;
  static const double borderWidth2px = SpacingConstants.borderWidth2px;
  static const double borderWidth3px = SpacingConstants.borderWidth3px;
  static const double borderWidth4px = SpacingConstants.borderWidth4px;

  // Text field border style
  static const double textFieldBorderRadius =
      SpacingConstants.textFieldBorderRadius;

  // Shadow elevation
  static const double elevation1px = SpacingConstants.elevation1px;
  static const double elevation2px = SpacingConstants.elevation2px;
  static const double elevation4px = SpacingConstants.elevation4px;
  static const double elevation8px = SpacingConstants.elevation8px;
  static const double elevation16px = SpacingConstants.elevation16px;
  static const double elevation24px = SpacingConstants.elevation24px;

  static const double space14x = SpacingConstants.space14x;

  /// Get EdgeInsets with all sides equal
  static EdgeInsets all(double value) {
    return EdgeInsets.all(value);
  }

  /// Get EdgeInsets with horizontal padding
  static EdgeInsets horizontal(double value) {
    return EdgeInsets.symmetric(horizontal: value);
  }

  /// Get EdgeInsets with vertical padding
  static EdgeInsets vertical(double value) {
    return EdgeInsets.symmetric(vertical: value);
  }

  /// Get EdgeInsets with symmetric padding
  static EdgeInsets symmetric({
    double horizontal = 0.0,
    double vertical = 0.0,
  }) {
    return EdgeInsets.symmetric(horizontal: horizontal, vertical: vertical);
  }

  /// Get EdgeInsets with specific padding for each side
  static EdgeInsets only({
    double left = 0.0,
    double top = 0.0,
    double right = 0.0,
    double bottom = 0.0,
  }) {
    return EdgeInsets.only(left: left, top: top, right: right, bottom: bottom);
  }

  /// Get BorderRadius with all corners equal
  static BorderRadius borderRadius(double value) {
    return BorderRadius.circular(value);
  }

  /// Get BorderRadius with specific values for each corner
  static BorderRadius borderRadiusOnly({
    double topLeft = 0.0,
    double topRight = 0.0,
    double bottomLeft = 0.0,
    double bottomRight = 0.0,
  }) {
    return BorderRadius.only(
      topLeft: Radius.circular(topLeft),
      topRight: Radius.circular(topRight),
      bottomLeft: Radius.circular(bottomLeft),
      bottomRight: Radius.circular(bottomRight),
    );
  }

  /// Get text field border radius (4px)
  static BorderRadius getTextFieldBorderRadius() {
    return BorderRadius.circular(textFieldBorderRadius);
  }

  /// Get text field border side
  static BorderSide getTextFieldBorderSide({double width = 1.0}) {
    return BorderSide(color: AppColors.textFieldBorder, width: width);
  }

  /// Get text field decoration
  static InputDecoration getTextFieldDecoration({
    String? hintText,
    String? labelText,
    Widget? prefixIcon,
    Widget? suffixIcon,
    bool isError = false,
  }) {
    return InputDecoration(
      hintText: hintText,
      labelText: labelText,
      prefixIcon: prefixIcon,
      suffixIcon: suffixIcon,
      border: OutlineInputBorder(
        borderRadius: getTextFieldBorderRadius(),
        borderSide: getTextFieldBorderSide(),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: getTextFieldBorderRadius(),
        borderSide: getTextFieldBorderSide(),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: getTextFieldBorderRadius(),
        borderSide: getTextFieldBorderSide(),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: getTextFieldBorderRadius(),
        borderSide: BorderSide(color: Colors.red, width: 1.0),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: getTextFieldBorderRadius(),
        borderSide: BorderSide(color: Colors.red, width: 1.0),
      ),
      contentPadding: EdgeInsets.symmetric(
        horizontal: space4x,
        vertical: space3x,
      ),
    );
  }
}
