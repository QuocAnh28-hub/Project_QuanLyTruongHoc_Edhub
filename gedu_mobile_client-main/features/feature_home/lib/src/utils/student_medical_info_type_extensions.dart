import 'package:core_students/core_students.dart';
import 'package:core_localization/core_localization.dart';

/// Extensions for StudentMedicalInfoTypeEnum to handle UI-specific logic
extension StudentMedicalInfoTypeUIExtension on StudentMedicalInfoTypeEnum {
  /// Get the localized display text for this medical info type
  String getLocalizedDisplayText(AppLocalizations? l10n) {
    switch (this) {
      case StudentMedicalInfoTypeEnum.undetermined:
        return l10n?.medicalInfoTypeUndetermined ?? 'Khác';
      case StudentMedicalInfoTypeEnum.foodAllergy:
        return l10n?.medicalInfoTypeFoodAllergy ?? 'Dị ứng Thực phẩm';
      case StudentMedicalInfoTypeEnum.drugAllergy:
        return l10n?.medicalInfoTypeDrugAllergy ?? 'Dị ứng Thuốc';
      case StudentMedicalInfoTypeEnum.chronicOrUnderlying:
        return l10n?.medicalInfoTypeChronicOrUnderlying ??
            'Bệnh mãn tính/Bệnh nền';
    }
  }
}
