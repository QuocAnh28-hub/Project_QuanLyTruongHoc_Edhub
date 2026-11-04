/// Enum for student admission types
enum AdmissionType {
  inDistrict(1),
  outOfDistrict(2),
  transfer(3);

  const AdmissionType(this.value);

  final int value;

  /// Get AdmissionType from value
  static AdmissionType fromValue(int value) {
    return AdmissionType.values.firstWhere(
      (type) => type.value == value,
      orElse: () => AdmissionType.inDistrict, // Default fallback
    );
  }
}
