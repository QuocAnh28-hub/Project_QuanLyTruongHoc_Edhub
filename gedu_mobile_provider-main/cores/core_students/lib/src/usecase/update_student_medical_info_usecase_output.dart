import 'package:lib_base/lib_base.dart';

/// Output for update student medical info use case
class UpdateStudentMedicalInfoOutput extends BaseOutput {
  final List<StudentMedicalInfoResponse> medicalInfoList;

  const UpdateStudentMedicalInfoOutput({required this.medicalInfoList});
}

/// Response model for student medical info
class StudentMedicalInfoResponse {
  final int id;
  final int studentId;
  final int group;
  final int type;
  final String info;
  final String createdAt;
  final String? createdBy;
  final String updatedAt;
  final String? updatedBy;

  const StudentMedicalInfoResponse({
    required this.id,
    required this.studentId,
    required this.group,
    required this.type,
    required this.info,
    required this.createdAt,
    this.createdBy,
    required this.updatedAt,
    this.updatedBy,
  });

  factory StudentMedicalInfoResponse.fromJson(Map<String, dynamic> json) {
    return StudentMedicalInfoResponse(
      id: json['id'] as int,
      studentId: json['studentId'] as int,
      group: json['group'] as int,
      type: json['type'] as int,
      info: json['info'] as String,
      createdAt: json['createdAt'] as String,
      createdBy: json['createdBy'] as String?,
      updatedAt: json['updatedAt'] as String,
      updatedBy: json['updatedBy'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'studentId': studentId,
      'group': group,
      'type': type,
      'info': info,
      'createdAt': createdAt,
      'createdBy': createdBy,
      'updatedAt': updatedAt,
      'updatedBy': updatedBy,
    };
  }
}
