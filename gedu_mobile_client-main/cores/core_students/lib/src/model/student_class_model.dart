/// Model for student class information
class StudentClassModel {
  final int id;
  final String name;
  final int gradeLevel;

  const StudentClassModel({
    required this.id,
    required this.name,
    required this.gradeLevel,
  });

  factory StudentClassModel.fromJson(Map<String, dynamic> json) {
    return StudentClassModel(
      id: json['id'] as int,
      name: json['name'] as String,
      gradeLevel: json['gradeLevel'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'gradeLevel': gradeLevel};
  }

  @override
  String toString() {
    return 'StudentClassModel{id: $id, name: $name, gradeLevel: $gradeLevel}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudentClassModel &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          gradeLevel == other.gradeLevel;

  @override
  int get hashCode => id.hashCode ^ name.hashCode ^ gradeLevel.hashCode;
}
