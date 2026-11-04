/// UI model for additional user data
class UserAdditionalModel {
  final String? schoolYear;
  final String? schoolYearName;
  final int? provinceId;
  final String? schoolName;
  final String? schoolCode;
  final bool canPreschool;
  final bool canPrimarySchool;
  final bool canLowerSecondarySchool;
  final bool canUpperSecondarySchool;

  const UserAdditionalModel({
    this.schoolYear,
    this.schoolYearName,
    this.provinceId,
    this.schoolName,
    this.schoolCode,
    this.canPreschool = false,
    this.canPrimarySchool = false,
    this.canLowerSecondarySchool = false,
    this.canUpperSecondarySchool = false,
  });

  @override
  String toString() {
    return 'UserAdditionalModel{schoolYear: $schoolYear, schoolYearName: $schoolYearName, provinceId: $provinceId, schoolName: $schoolName, schoolCode: $schoolCode, canPreschool: $canPreschool, canPrimarySchool: $canPrimarySchool, canLowerSecondarySchool: $canLowerSecondarySchool, canUpperSecondarySchool: $canUpperSecondarySchool}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserAdditionalModel &&
          runtimeType == other.runtimeType &&
          schoolYear == other.schoolYear &&
          schoolYearName == other.schoolYearName &&
          provinceId == other.provinceId &&
          schoolName == other.schoolName &&
          schoolCode == other.schoolCode &&
          canPreschool == other.canPreschool &&
          canPrimarySchool == other.canPrimarySchool &&
          canLowerSecondarySchool == other.canLowerSecondarySchool &&
          canUpperSecondarySchool == other.canUpperSecondarySchool;

  @override
  int get hashCode =>
      schoolYear.hashCode ^
      schoolYearName.hashCode ^
      provinceId.hashCode ^
      schoolName.hashCode ^
      schoolCode.hashCode ^
      canPreschool.hashCode ^
      canPrimarySchool.hashCode ^
      canLowerSecondarySchool.hashCode ^
      canUpperSecondarySchool.hashCode;
}
