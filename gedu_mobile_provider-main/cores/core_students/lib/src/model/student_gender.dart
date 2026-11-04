/// Enum for student gender
enum StudentGender {
  /// Nam - Male
  male(1),
  
  /// Nữ - Female
  female(2);

  const StudentGender(this.value);

  /// Numeric value of the gender
  final int value;

  /// Get StudentGender from numeric value
  static StudentGender fromValue(int value) {
    return StudentGender.values.firstWhere(
      (gender) => gender.value == value,
      orElse: () => StudentGender.male,
    );
  }

  /// Check if student is male
  bool get isMale => this == StudentGender.male;

  /// Check if student is female
  bool get isFemale => this == StudentGender.female;
} 