import 'package:lib_base/lib_base.dart';

/// Input for update student medical info use case
class UpdateStudentMedicalInfoInput extends BaseInput {
  final String refId;
  final int studentId;
  final List<StudentMedicalInfoRequest> medicalList;

  const UpdateStudentMedicalInfoInput({
    required this.refId,
    required this.studentId,
    required this.medicalList,
  });
}

/// Request model for student medical info
class StudentMedicalInfoRequest {
  final int group;
  final int type;
  final String info;

  const StudentMedicalInfoRequest({
    required this.group,
    required this.type,
    required this.info,
  });

  Map<String, dynamic> toJson() {
    return {'group': group, 'type': type, 'info': info};
  }
}
