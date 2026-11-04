import 'package:core_students/core_students.dart';
import 'package:core_localization/core_localization.dart';

/// Extensions for StudentMedicalInfoGroupEnum to handle UI-specific logic
extension StudentMedicalInfoGroupUIExtension on StudentMedicalInfoGroupEnum {
  /// Get the localized display text for this medical info group
  String getLocalizedDisplayText(AppLocalizations? l10n) {
    switch (this) {
      case StudentMedicalInfoGroupEnum.undetermined:
        return l10n?.medicalInfoGroupUndetermined ?? 'Khác';
      case StudentMedicalInfoGroupEnum.allergy:
        return l10n?.medicalInfoGroupAllergy ?? 'Dị ứng';
      case StudentMedicalInfoGroupEnum.chronicOrUnderlying:
        return l10n?.medicalInfoGroupChronicOrUnderlying ??
            'Bệnh mãn tính/Bệnh nền';
    }
  }
}
