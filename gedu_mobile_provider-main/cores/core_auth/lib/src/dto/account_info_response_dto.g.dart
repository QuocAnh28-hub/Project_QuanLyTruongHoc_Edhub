// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_info_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AccountInfoResponseDto _$AccountInfoResponseDtoFromJson(
  Map<String, dynamic> json,
) => AccountInfoResponseDto(
  id: (json['id'] as num).toInt(),
  email: json['email'] as String,
  firstName: json['firstName'] as String,
  lastName: json['lastName'] as String,
  orgId: (json['orgId'] as num).toInt(),
  refId: AccountInfoResponseDto._parseRefId(json['refId']),
  phone: json['phone'] as String?,
);

Map<String, dynamic> _$AccountInfoResponseDtoToJson(
  AccountInfoResponseDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'email': instance.email,
  'firstName': instance.firstName,
  'lastName': instance.lastName,
  'orgId': instance.orgId,
  'refId': instance.refId,
  'phone': instance.phone,
};
