import 'package:core_students/core_students.dart';
import 'package:core_localization/core_localization.dart';

/// Extensions for AdmissionType enum to handle UI-specific logic
extension AdmissionTypeUIExtension on AdmissionType {
  /// Get the display text for this admission type
  String get displayText {
    switch (this) {
      case AdmissionType.inDistrict:
        return 'Đúng tuyến';
      case AdmissionType.outOfDistrict:
        return 'Trái tuyến';
      case AdmissionType.transfer:
        return 'Chuyển trường đến';
    }
  }

  /// Get the localized display text for this admission type
  String getLocalizedDisplayText(AppLocalizations? l10n) {
    switch (this) {
      case AdmissionType.inDistrict:
        return l10n?.admissionTypeInDistrict ?? 'Đúng tuyến';
      case AdmissionType.outOfDistrict:
        return l10n?.admissionTypeOutOfDistrict ?? 'Trái tuyến';
      case AdmissionType.transfer:
        return l10n?.admissionTypeTransfer ?? 'Chuyển trường đến';
    }
  }
}
