import 'package:core_students/core_students.dart';
import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_localization/core_localization.dart';

/// Extensions for StudentStatus enum to handle UI-specific logic
extension StudentStatusUIExtension on StudentStatus {
  /// Get the color for this status
  Color get color {
    switch (this) {
      case StudentStatus.waitingForEnrollment:
        return AppColors.warning;
      case StudentStatus.currentlyStudying:
        return AppColors.success;
      case StudentStatus.onHold:
        return AppColors.info;
      case StudentStatus.graduated:
        return AppColors.primary;
      case StudentStatus.droppedOut:
        return AppColors.error;
    }
  }

  /// Get the display text for this status
  String get displayText {
    switch (this) {
      case StudentStatus.waitingForEnrollment:
        return 'CHỜ NHẬP HỌC';
      case StudentStatus.currentlyStudying:
        return 'ĐANG HỌC';
      case StudentStatus.onHold:
        return 'BẢO LƯU';
      case StudentStatus.graduated:
        return 'ĐÃ TỐT NGHIỆP';
      case StudentStatus.droppedOut:
        return 'ĐÃ THÔI HỌC';
    }
  }

  /// Get the localized display text for this status
  String getLocalizedDisplayText(AppLocalizations? l10n) {
    switch (this) {
      case StudentStatus.waitingForEnrollment:
        return l10n?.studentStatusWaitingForEnrollment ?? 'CHỜ NHẬP HỌC';
      case StudentStatus.currentlyStudying:
        return l10n?.studentStatusCurrentlyStudying ?? 'ĐANG HỌC';
      case StudentStatus.onHold:
        return l10n?.studentStatusOnHold ?? 'BẢO LƯU';
      case StudentStatus.graduated:
        return l10n?.studentStatusGraduated ?? 'ĐÃ TỐT NGHIỆP';
      case StudentStatus.droppedOut:
        return l10n?.studentStatusDroppedOut ?? 'ĐÃ THÔI HỌC';
    }
  }

  /// Get the background color for status badges
  Color get badgeBackgroundColor {
    switch (this) {
      case StudentStatus.waitingForEnrollment:
        return AppColors.warningBadgeBackground;
      case StudentStatus.currentlyStudying:
        return AppColors.successBadgeBackground;
      case StudentStatus.onHold:
        return AppColors.neutralBadgeBackground;
      case StudentStatus.graduated:
        return AppColors.successBadgeBackground;
      case StudentStatus.droppedOut:
        return AppColors.warningBadgeBackground;
    }
  }

  /// Get the border color for status badges
  Color get badgeBorderColor {
    switch (this) {
      case StudentStatus.waitingForEnrollment:
        return AppColors.warningBadgeBorder;
      case StudentStatus.currentlyStudying:
        return AppColors.successBadgeBorder.withValues(alpha: 0.2);
      case StudentStatus.onHold:
        return AppColors.neutralBadgeBorder.withValues(alpha: 0.2);
      case StudentStatus.graduated:
        return AppColors.successBadgeBorder.withValues(alpha: 0.2);
      case StudentStatus.droppedOut:
        return AppColors.warningBadgeBorder;
    }
  }

  /// Get the text color for status badges
  Color get badgeTextColor {
    switch (this) {
      case StudentStatus.waitingForEnrollment:
        return AppColors.warningBadgeText;
      case StudentStatus.currentlyStudying:
        return AppColors.successBadgeText;
      case StudentStatus.onHold:
        return AppColors.black;
      case StudentStatus.graduated:
        return AppColors.successBadgeText;
      case StudentStatus.droppedOut:
        return AppColors.warningBadgeText;
    }
  }
}
