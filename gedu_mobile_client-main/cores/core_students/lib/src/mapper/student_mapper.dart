import '../dto/student_dto.dart';
import '../model/student_model.dart';
import '../model/student_class_model.dart';
import '../model/student_contact_model.dart';
import '../model/student_medical_info_model.dart';

class StudentMapper {
  static StudentModel fromDto(StudentDto dto) {
    return StudentModel(
      id: dto.id,
      code: dto.code,
      status: dto.status,
      avatar: dto.avatar,
      sex: dto.sex,
      admissionDate: dto.admissionDate,
      admissionSchoolYearId: dto.admissionSchoolYearId,
      admissionSchoolYearTitle: dto.admissionSchoolYearTitle,
      admissionType: dto.admissionType,
      firstName: dto.firstName,
      lastName: dto.lastName,
      citizenId: dto.citizenId,
      dateOfBirth: dto.dateOfBirth,
      dateOfIssue: dto.dateOfIssue,
      dateOfExpiry: dto.dateOfExpiry,
      placeOfIssue: dto.placeOfIssue,
      maritalStatus: dto.maritalStatus,
      occupation: dto.occupation,
      religionId: dto.religionId,
      ethnicityId: dto.ethnicityId,
      nationalityId: dto.nationalityId,
      nationalityTitle: dto.nationalityTitle,
      priorityPolicyId: dto.priorityPolicyId,
      priorityPolicyTitle: dto.priorityPolicyTitle,
      specialNeedsPolicyId: dto.specialNeedsPolicyId,
      specialNeedsPolicyTitle: dto.specialNeedsPolicyTitle,
      permanentResidenceAddress: dto.permanentResidenceAddress,
      temporaryResidenceAddress: dto.temporaryResidenceAddress,
      originPlaceProvinceId: dto.originPlaceProvinceId,
      originPlaceWardId: dto.originPlaceWardId,
      permanentResidenceProvinceId: dto.permanentResidenceProvinceId,
      permanentResidenceWardId: dto.permanentResidenceWardId,
      temporaryResidenceProvinceId: dto.temporaryResidenceProvinceId,
      temporaryResidenceWardId: dto.temporaryResidenceWardId,
      gradeLevel: dto.gradeLevel,
      classInfo: dto.classInfo != null
          ? StudentClassModel.fromJson(dto.classInfo!)
          : null,
      classId: dto.classId,
      mainContactId: dto.mainContactId,
      mainStudentContact: dto.mainStudentContact != null
          ? StudentContactModel.fromJson(dto.mainStudentContact!)
          : null,
      studentContacts:
          dto.studentContacts
              ?.map((contact) => StudentContactModel.fromJson(contact))
              .toList() ??
          [],
      studentMedicalInfo:
          dto.studentMedicalInfo
              ?.map((info) => StudentMedicalInfoModel.fromJson(info))
              .toList() ??
          [],
      documents: dto.documents ?? 0,
      // Legacy fields
      schoolId: dto.schoolId,
      schoolName: dto.schoolName,
      confirmedByFirstName: dto.confirmedByFirstName,
      confirmedByLastName: dto.confirmedByLastName,
      confirmedById: dto.confirmedById,
      className: dto.className,
      classStatus: dto.classStatus,
    );
  }

  static List<StudentModel> fromDtoList(List<StudentDto> dtos) {
    return dtos.map((dto) => fromDto(dto)).toList();
  }
}
