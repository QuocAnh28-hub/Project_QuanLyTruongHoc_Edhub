import 'student_medical_info_group_enum.dart';
import 'student_medical_info_type_enum.dart';

/// Model for student medical information
class StudentMedicalInfoModel {
  final int id;
  final int group;
  final int type;
  final String info;

  const StudentMedicalInfoModel({
    required this.id,
    required this.group,
    required this.type,
    required this.info,
  });

  /// Get StudentMedicalInfoGroupEnum from group value
  StudentMedicalInfoGroupEnum? get groupEnum =>
      group != null ? StudentMedicalInfoGroupEnum.fromValue(group) : null;

  /// Get StudentMedicalInfoTypeEnum from type value
  StudentMedicalInfoTypeEnum? get typeEnum =>
      type != null ? StudentMedicalInfoTypeEnum.fromValue(type) : null;

  /// Get description from info field
  String? get description => info.isNotEmpty ? info : null;

  factory StudentMedicalInfoModel.fromJson(Map<String, dynamic> json) {
    return StudentMedicalInfoModel(
      id: json['id'] as int,
      group: json['group'] as int,
      type: json['type'] as int,
      info: json['info'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'group': group, 'type': type, 'info': info};
  }

  @override
  String toString() {
    return 'StudentMedicalInfoModel{id: $id, group: $group, type: $type, info: $info}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudentMedicalInfoModel &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          group == other.group &&
          type == other.type &&
          info == other.info;

  @override
  int get hashCode =>
      id.hashCode ^ group.hashCode ^ type.hashCode ^ info.hashCode;
}
