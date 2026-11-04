/// Enum for student medical info groups
enum StudentMedicalInfoGroupEnum {
  undetermined(1),
  allergy(2),
  chronicOrUnderlying(3);

  const StudentMedicalInfoGroupEnum(this.value);

  final int value;

  /// Get StudentMedicalInfoGroupEnum from value
  static StudentMedicalInfoGroupEnum fromValue(int value) {
    return StudentMedicalInfoGroupEnum.values.firstWhere(
      (group) => group.value == value,
      orElse: () =>
          StudentMedicalInfoGroupEnum.undetermined, // Default fallback
    );
  }
}
