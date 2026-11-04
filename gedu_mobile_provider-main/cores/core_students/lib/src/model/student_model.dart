import 'student_status.dart';
import 'student_gender.dart';
import 'student_class_model.dart';
import 'student_contact_model.dart';
import 'student_medical_info_model.dart';
import 'admission_type.dart';
import 'package:lib_utils/lib_utils.dart';

/// UI model for student data
class StudentModel {
  final int id;
  final String code;
  final int status;
  final String? avatar;
  final int sex;
  final String? admissionDate;
  final int? admissionSchoolYearId;
  final String? admissionSchoolYearTitle;
  final int? admissionType;
  final String firstName;
  final String lastName;
  final String? citizenId;
  final String? dateOfBirth;
  final String? dateOfIssue;
  final String? dateOfExpiry;
  final String? placeOfIssue;
  final int? maritalStatus;
  final String? occupation;
  final int? religionId;
  final int? ethnicityId;
  final int? nationalityId;
  final String? nationalityTitle;
  final int? priorityPolicyId;
  final String? priorityPolicyTitle;
  final int? specialNeedsPolicyId;
  final String? specialNeedsPolicyTitle;
  final String permanentResidenceAddress;
  final String temporaryResidenceAddress;
  final int? originPlaceProvinceId;
  final int? originPlaceWardId;
  final int? permanentResidenceProvinceId;
  final int? permanentResidenceWardId;
  final int? temporaryResidenceProvinceId;
  final int? temporaryResidenceWardId;
  final int? gradeLevel;
  final StudentClassModel? classInfo;
  final int? classId;
  final int? mainContactId;
  final StudentContactModel? mainStudentContact;
  final List<StudentContactModel> studentContacts;
  final List<StudentMedicalInfoModel> studentMedicalInfo;
  final int documents;

  // Legacy fields for backward compatibility
  final int? schoolId;
  final String? schoolName;
  final String? confirmedByFirstName;
  final String? confirmedByLastName;
  final int? confirmedById;
  final String? className;
  final int? classStatus;

  const StudentModel({
    required this.id,
    required this.code,
    required this.status,
    this.avatar,
    required this.sex,
    this.admissionDate,
    this.admissionSchoolYearId,
    this.admissionSchoolYearTitle,
    this.admissionType,
    required this.firstName,
    required this.lastName,
    this.citizenId,
    this.dateOfBirth,
    this.dateOfIssue,
    this.dateOfExpiry,
    this.placeOfIssue,
    this.maritalStatus,
    this.occupation,
    this.religionId,
    this.ethnicityId,
    this.nationalityId,
    this.nationalityTitle,
    this.priorityPolicyId,
    this.priorityPolicyTitle,
    this.specialNeedsPolicyId,
    this.specialNeedsPolicyTitle,
    required this.permanentResidenceAddress,
    required this.temporaryResidenceAddress,
    this.originPlaceProvinceId,
    this.originPlaceWardId,
    this.permanentResidenceProvinceId,
    this.permanentResidenceWardId,
    this.temporaryResidenceProvinceId,
    this.temporaryResidenceWardId,
    this.gradeLevel,
    this.classInfo,
    this.classId,
    this.mainContactId,
    this.mainStudentContact,
    required this.studentContacts,
    required this.studentMedicalInfo,
    required this.documents,
    // Legacy fields
    this.schoolId,
    this.schoolName,
    this.confirmedByFirstName,
    this.confirmedByLastName,
    this.confirmedById,
    this.className,
    this.classStatus,
  });

  /// Get full name (firstName + lastName)
  String get fullName => '$lastName $firstName';

  /// Get display name (lastName + firstName for Vietnamese format)
  String get displayName => '$lastName $firstName';

  /// Get age from dateOfBirth
  int? get age {
    if (dateOfBirth == null) return null;
    try {
      final birthDate = DateTime.parse(dateOfBirth!);
      final currentDate = DateTime.now();
      return currentDate.year - birthDate.year;
    } catch (e) {
      return null;
    }
  }

  /// Get year of birth from dateOfBirth
  int? get yearOfBirth {
    if (dateOfBirth == null) return null;
    try {
      final birthDate = DateTime.parse(dateOfBirth!);
      return birthDate.year;
    } catch (e) {
      return null;
    }
  }

  /// Get class name from classInfo
  String? get currentClassName => classInfo?.name ?? className;

  /// Get grade level from classInfo
  int? get studentGradeLevel => classInfo?.gradeLevel;

  /// Get StudentStatus enum from status value
  StudentStatus get statusEnum => StudentStatus.fromValue(status);

  /// Get StudentGender enum from sex value
  StudentGender get sexEnum => StudentGender.fromValue(sex);

  /// Get AdmissionType enum from admissionType value
  AdmissionType? get admissionTypeEnum =>
      admissionType != null ? AdmissionType.fromValue(admissionType!) : null;

  /// Get class name from classInfo or fallback to className
  String? get displayClassName => classInfo?.name ?? className;

  /// Get formatted admission date for display (DD/MM/YYYY)
  String get admissionDateDisplay {
    if (admissionDate == null || admissionDate!.isEmpty) {
      return 'N/A';
    }

    try {
      // Parse using the server format (ISO 8601 with Z)
      final date = DaDateFormat.serverFormat.parse(admissionDate!);
      // Format to DD/MM/YYYY
      return DaDateFormat.ddMMyyyyWith(separator: Separator.slash).format(date);
    } catch (e) {
      // If parsing fails, return the original string
      return admissionDate!;
    }
  }

  /// Get formatted date of birth for display (DD/MM/YYYY)
  String get dateOfBirthDisplay {
    if (dateOfBirth == null || dateOfBirth!.isEmpty) {
      return 'N/A';
    }

    try {
      // Parse using the server format (ISO 8601 with Z)
      final date = DaDateFormat.serverFormat.parse(dateOfBirth!);
      // Format to DD/MM/YYYY
      return DaDateFormat.ddMMyyyyWith(separator: Separator.slash).format(date);
    } catch (e) {
      // If parsing fails, return the original string
      return dateOfBirth!;
    }
  }

  @override
  String toString() {
    return 'StudentModel{id: $id, code: $code, status: $status, avatar: $avatar, sex: $sex, admissionDate: $admissionDate, admissionSchoolYearId: $admissionSchoolYearId, admissionSchoolYearTitle: $admissionSchoolYearTitle, admissionType: $admissionType, firstName: $firstName, lastName: $lastName, citizenId: $citizenId, dateOfBirth: $dateOfBirth, dateOfIssue: $dateOfIssue, dateOfExpiry: $dateOfExpiry, placeOfIssue: $placeOfIssue, maritalStatus: $maritalStatus, occupation: $occupation, religionId: $religionId, ethnicityId: $ethnicityId, nationalityId: $nationalityId, nationalityTitle: $nationalityTitle, priorityPolicyId: $priorityPolicyId, priorityPolicyTitle: $priorityPolicyTitle, specialNeedsPolicyId: $specialNeedsPolicyId, specialNeedsPolicyTitle: $specialNeedsPolicyTitle, permanentResidenceAddress: $permanentResidenceAddress, temporaryResidenceAddress: $temporaryResidenceAddress, originPlaceProvinceId: $originPlaceProvinceId, originPlaceWardId: $originPlaceWardId, permanentResidenceProvinceId: $permanentResidenceProvinceId, permanentResidenceWardId: $permanentResidenceWardId, temporaryResidenceProvinceId: $temporaryResidenceProvinceId, temporaryResidenceWardId: $temporaryResidenceWardId, gradeLevel: $gradeLevel, classInfo: $classInfo, classId: $classId, mainContactId: $mainContactId, mainStudentContact: $mainStudentContact, studentContacts: $studentContacts, studentMedicalInfo: $studentMedicalInfo, documents: $documents, schoolId: $schoolId, schoolName: $schoolName, confirmedByFirstName: $confirmedByFirstName, confirmedByLastName: $confirmedByLastName, confirmedById: $confirmedById, className: $className, classStatus: $classStatus}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudentModel &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          code == other.code &&
          status == other.status &&
          avatar == other.avatar &&
          sex == other.sex &&
          admissionDate == other.admissionDate &&
          admissionSchoolYearId == other.admissionSchoolYearId &&
          admissionSchoolYearTitle == other.admissionSchoolYearTitle &&
          admissionType == other.admissionType &&
          firstName == other.firstName &&
          lastName == other.lastName &&
          citizenId == other.citizenId &&
          dateOfBirth == other.dateOfBirth &&
          dateOfIssue == other.dateOfIssue &&
          dateOfExpiry == other.dateOfExpiry &&
          placeOfIssue == other.placeOfIssue &&
          maritalStatus == other.maritalStatus &&
          occupation == other.occupation &&
          religionId == other.religionId &&
          ethnicityId == other.ethnicityId &&
          nationalityId == other.nationalityId &&
          nationalityTitle == other.nationalityTitle &&
          priorityPolicyId == other.priorityPolicyId &&
          priorityPolicyTitle == other.priorityPolicyTitle &&
          specialNeedsPolicyId == other.specialNeedsPolicyId &&
          specialNeedsPolicyTitle == other.specialNeedsPolicyTitle &&
          permanentResidenceAddress == other.permanentResidenceAddress &&
          temporaryResidenceAddress == other.temporaryResidenceAddress &&
          originPlaceProvinceId == other.originPlaceProvinceId &&
          originPlaceWardId == other.originPlaceWardId &&
          permanentResidenceProvinceId == other.permanentResidenceProvinceId &&
          permanentResidenceWardId == other.permanentResidenceWardId &&
          temporaryResidenceProvinceId == other.temporaryResidenceProvinceId &&
          temporaryResidenceWardId == other.temporaryResidenceWardId &&
          gradeLevel == other.gradeLevel &&
          classInfo == other.classInfo &&
          classId == other.classId &&
          mainContactId == other.mainContactId &&
          mainStudentContact == other.mainStudentContact &&
          studentContacts == other.studentContacts &&
          studentMedicalInfo == other.studentMedicalInfo &&
          documents == other.documents &&
          schoolId == other.schoolId &&
          schoolName == other.schoolName &&
          confirmedByFirstName == other.confirmedByFirstName &&
          confirmedByLastName == other.confirmedByLastName &&
          confirmedById == other.confirmedById &&
          className == other.className &&
          classStatus == other.classStatus;

  @override
  int get hashCode =>
      id.hashCode ^
      code.hashCode ^
      status.hashCode ^
      avatar.hashCode ^
      sex.hashCode ^
      admissionDate.hashCode ^
      admissionSchoolYearId.hashCode ^
      admissionSchoolYearTitle.hashCode ^
      admissionType.hashCode ^
      firstName.hashCode ^
      lastName.hashCode ^
      citizenId.hashCode ^
      dateOfBirth.hashCode ^
      dateOfIssue.hashCode ^
      dateOfExpiry.hashCode ^
      placeOfIssue.hashCode ^
      maritalStatus.hashCode ^
      occupation.hashCode ^
      religionId.hashCode ^
      ethnicityId.hashCode ^
      nationalityId.hashCode ^
      nationalityTitle.hashCode ^
      priorityPolicyId.hashCode ^
      priorityPolicyTitle.hashCode ^
      specialNeedsPolicyId.hashCode ^
      specialNeedsPolicyTitle.hashCode ^
      permanentResidenceAddress.hashCode ^
      temporaryResidenceAddress.hashCode ^
      originPlaceProvinceId.hashCode ^
      originPlaceWardId.hashCode ^
      permanentResidenceProvinceId.hashCode ^
      permanentResidenceWardId.hashCode ^
      temporaryResidenceProvinceId.hashCode ^
      temporaryResidenceWardId.hashCode ^
      gradeLevel.hashCode ^
      classInfo.hashCode ^
      classId.hashCode ^
      mainContactId.hashCode ^
      mainStudentContact.hashCode ^
      studentContacts.hashCode ^
      studentMedicalInfo.hashCode ^
      documents.hashCode ^
      schoolId.hashCode ^
      schoolName.hashCode ^
      confirmedByFirstName.hashCode ^
      confirmedByLastName.hashCode ^
      confirmedById.hashCode ^
      className.hashCode ^
      classStatus.hashCode;
}
