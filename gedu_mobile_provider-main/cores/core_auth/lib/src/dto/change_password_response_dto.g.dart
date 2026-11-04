// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'change_password_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChangePasswordResponseDto _$ChangePasswordResponseDtoFromJson(
  Map<String, dynamic> json,
) => ChangePasswordResponseDto(
  success: json['success'] as bool,
  message: json['message'] as String?,
);

Map<String, dynamic> _$ChangePasswordResponseDtoToJson(
  ChangePasswordResponseDto instance,
) => <String, dynamic>{
  'success': instance.success,
  'message': instance.message,
};
