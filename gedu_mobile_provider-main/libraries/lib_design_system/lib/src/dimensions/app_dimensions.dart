import 'package:flutter/material.dart';

import 'dimension_constants.dart';

/// Main app dimensions class that provides access to all design system dimension values
class AppDimensions {
  AppDimensions._();

  // Button dimensions
  static const double buttonHeight = DimensionConstants.buttonHeight;
  static const double buttonHeightSmall = DimensionConstants.buttonHeightSmall;
  static const double buttonHeightLarge = DimensionConstants.buttonHeightLarge;
  static const double buttonMinWidth = DimensionConstants.buttonMinWidth;
  static const double buttonBorderRadius =
      DimensionConstants.buttonBorderRadius;

  // Input dimensions
  static const double inputHeight = DimensionConstants.inputHeight;
  static const double inputHeightSmall = DimensionConstants.inputHeightSmall;
  static const double inputHeightLarge = DimensionConstants.inputHeightLarge;
  static const double inputBorderRadius = DimensionConstants.inputBorderRadius;
  static const double inputBorderWidth = DimensionConstants.inputBorderWidth;

  // Card dimensions
  static const double cardBorderRadius = DimensionConstants.cardBorderRadius;
  static const double cardElevation = DimensionConstants.cardElevation;
  static const double cardMinHeight = DimensionConstants.cardMinHeight;

  // Avatar dimensions
  static const double avatarSizeSmall = DimensionConstants.avatarSizeSmall;
  static const double avatarSizeMedium = DimensionConstants.avatarSizeMedium;
  static const double avatarSizeLarge = DimensionConstants.avatarSizeLarge;
  static const double avatarSizeXLarge = DimensionConstants.avatarSizeXLarge;

  // Icon dimensions
  static const double iconSizeSmall = DimensionConstants.iconSizeSmall;
  static const double iconSizeMedium = DimensionConstants.iconSizeMedium;
  static const double iconSizeLarge = DimensionConstants.iconSizeLarge;
  static const double iconSizeXLarge = DimensionConstants.iconSizeXLarge;

  // App bar dimensions
  static const double appBarHeight = DimensionConstants.appBarHeight;
  static const double appBarElevation = DimensionConstants.appBarElevation;

  // Bottom navigation dimensions
  static const double bottomNavigationHeight =
      DimensionConstants.bottomNavigationHeight;
  static const double bottomNavigationElevation =
      DimensionConstants.bottomNavigationElevation;

  // Floating action button dimensions
  static const double fabSize = DimensionConstants.fabSize;
  static const double fabSizeSmall = DimensionConstants.fabSizeSmall;
  static const double fabSizeLarge = DimensionConstants.fabSizeLarge;

  // Dialog dimensions
  static const double dialogBorderRadius =
      DimensionConstants.dialogBorderRadius;
  static const double dialogMaxWidth = DimensionConstants.dialogMaxWidth;
  static const double dialogMaxHeight = DimensionConstants.dialogMaxHeight;

  // Bottom sheet dimensions
  static const double bottomSheetBorderRadius =
      DimensionConstants.bottomSheetBorderRadius;
  static const double bottomSheetMaxHeight =
      DimensionConstants.bottomSheetMaxHeight;

  // Snackbar dimensions
  static const double snackbarHeight = DimensionConstants.snackbarHeight;
  static const double snackbarBorderRadius =
      DimensionConstants.snackbarBorderRadius;

  // Progress indicator dimensions
  static const double progressIndicatorSize =
      DimensionConstants.progressIndicatorSize;
  static const double progressIndicatorSizeSmall =
      DimensionConstants.progressIndicatorSizeSmall;
  static const double progressIndicatorSizeLarge =
      DimensionConstants.progressIndicatorSizeLarge;

  // Divider dimensions
  static const double dividerHeight = DimensionConstants.dividerHeight;
  static const double dividerHeightThick =
      DimensionConstants.dividerHeightThick;

  // Chip dimensions
  static const double chipHeight = DimensionConstants.chipHeight;
  static const double chipBorderRadius = DimensionConstants.chipBorderRadius;

  // Badge dimensions
  static const double badgeSize = DimensionConstants.badgeSize;
  static const double badgeSizeSmall = DimensionConstants.badgeSizeSmall;
  static const double badgeSizeLarge = DimensionConstants.badgeSizeLarge;

  // Tooltip dimensions
  static const double tooltipBorderRadius =
      DimensionConstants.tooltipBorderRadius;
  static const double tooltipMaxWidth = DimensionConstants.tooltipMaxWidth;

  // Switch dimensions
  static const double switchWidth = DimensionConstants.switchWidth;
  static const double switchHeight = DimensionConstants.switchHeight;

  // Checkbox dimensions
  static const double checkboxSize = DimensionConstants.checkboxSize;
  static const double checkboxSizeSmall = DimensionConstants.checkboxSizeSmall;
  static const double checkboxSizeLarge = DimensionConstants.checkboxSizeLarge;

  // Radio button dimensions
  static const double radioSize = DimensionConstants.radioSize;
  static const double radioSizeSmall = DimensionConstants.radioSizeSmall;
  static const double radioSizeLarge = DimensionConstants.radioSizeLarge;

  // Slider dimensions
  static const double sliderHeight = DimensionConstants.sliderHeight;
  static const double sliderThumbSize = DimensionConstants.sliderThumbSize;
  static const double sliderTrackHeight = DimensionConstants.sliderTrackHeight;

  // Tab dimensions
  static const double tabHeight = DimensionConstants.tabHeight;
  static const double tabIndicatorHeight =
      DimensionConstants.tabIndicatorHeight;

  // List tile dimensions
  static const double listTileHeight = DimensionConstants.listTileHeight;
  static const double listTileHeightDense =
      DimensionConstants.listTileHeightDense;
  static const double listTileLeadingWidth =
      DimensionConstants.listTileLeadingWidth;
  static const double listTileTrailingWidth =
      DimensionConstants.listTileTrailingWidth;

  // Expansion tile dimensions
  static const double expansionTileHeaderHeight =
      DimensionConstants.expansionTileHeaderHeight;
  static const double expansionTileIconSize =
      DimensionConstants.expansionTileIconSize;

  // Stepper dimensions
  static const double stepperIconSize = DimensionConstants.stepperIconSize;
  static const double stepperLineWidth = DimensionConstants.stepperLineWidth;

  // Date picker dimensions
  static const double datePickerHeaderHeight =
      DimensionConstants.datePickerHeaderHeight;
  static const double datePickerDaySize = DimensionConstants.datePickerDaySize;

  // Time picker dimensions
  static const double timePickerHeaderHeight =
      DimensionConstants.timePickerHeaderHeight;
  static const double timePickerHourMinuteSize =
      DimensionConstants.timePickerHourMinuteSize;

  /// Get Size with width and height
  static Size size(double width, double height) {
    return Size(width, height);
  }

  /// Get Size with square dimensions
  static Size square(double size) {
    return Size(size, size);
  }

  /// Get Size with zero dimensions
  static Size get zero => Size.zero;

  /// Get Size with infinite dimensions
  static Size get infinite => Size.infinite;
}
