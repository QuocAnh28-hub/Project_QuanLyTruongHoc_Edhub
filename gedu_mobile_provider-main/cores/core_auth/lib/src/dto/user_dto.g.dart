// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserDto _$UserDtoFromJson(Map<String, dynamic> json) => UserDto(
  id: (json['id'] as num).toInt(),
  email: json['email'] as String,
  firstName: json['firstName'] as String,
  lastName: json['lastName'] as String,
  orgId: (json['orgId'] as num).toInt(),
  additional: UserAdditionalDto.fromJson(
    json['additional'] as Map<String, dynamic>,
  ),
  refId: UserDto._parseRefId(json['refId']),
);

Map<String, dynamic> _$UserDtoToJson(UserDto instance) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'firstName': instance.firstName,
  'lastName': instance.lastName,
  'orgId': instance.orgId,
  'refId': instance.refId,
  'additional': instance.additional,
};
