class ReligionModel {
  final int id;
  final String title;

  const ReligionModel({
    required this.id,
    required this.title,
  });

  factory ReligionModel.fromJson(Map<String, dynamic> json) {
    return ReligionModel(
      id: json['id'] as int,
      title: json['title'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
    };
  }

  @override
  String toString() {
    return 'ReligionModel{id: $id, title: $title}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReligionModel &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          title == other.title;

  @override
  int get hashCode => id.hashCode ^ title.hashCode;
}
