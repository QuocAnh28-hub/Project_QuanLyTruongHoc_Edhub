// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'religion_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReligionDto _$ReligionDtoFromJson(Map<String, dynamic> json) => ReligionDto(
  id: (json['id'] as num).toInt(),
  title: json['title'] as String,
);

Map<String, dynamic> _$ReligionDtoToJson(ReligionDto instance) =>
    <String, dynamic>{'id': instance.id, 'title': instance.title};
