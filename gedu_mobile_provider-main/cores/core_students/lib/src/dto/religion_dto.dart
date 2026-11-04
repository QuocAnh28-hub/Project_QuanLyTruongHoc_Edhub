import 'package:json_annotation/json_annotation.dart';

part 'religion_dto.g.dart';

@JsonSerializable()
class ReligionDto {
  final int id;
  final String title;

  const ReligionDto({required this.id, required this.title});

  factory ReligionDto.fromJson(Map<String, dynamic> json) =>
      _$ReligionDtoFromJson(json);

  @override
  String toString() {
    return 'ReligionDto{id: $id, title: $title}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReligionDto &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          title == other.title;

  @override
  int get hashCode => id.hashCode ^ title.hashCode;
}
