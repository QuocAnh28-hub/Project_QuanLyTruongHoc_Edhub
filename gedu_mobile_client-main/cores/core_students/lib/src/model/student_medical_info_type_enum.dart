import 'student_medical_info_group_enum.dart';

/// Enum for student medical info types
enum StudentMedicalInfoTypeEnum {
  undetermined(1, StudentMedicalInfoGroupEnum.undetermined),
  foodAllergy(2, StudentMedicalInfoGroupEnum.allergy),
  drugAllergy(3, StudentMedicalInfoGroupEnum.allergy),
  chronicOrUnderlying(4, StudentMedicalInfoGroupEnum.chronicOrUnderlying);

  const StudentMedicalInfoTypeEnum(this.value, this.group);

  final int value;
  final StudentMedicalInfoGroupEnum group;

  /// Get StudentMedicalInfoTypeEnum from value
  static StudentMedicalInfoTypeEnum fromValue(int value) {
    return StudentMedicalInfoTypeEnum.values.firstWhere(
      (type) => type.value == value,
      orElse: () => StudentMedicalInfoTypeEnum.undetermined, // Default fallback
    );
  }
}
