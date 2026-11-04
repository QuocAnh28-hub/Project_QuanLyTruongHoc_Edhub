// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'server_error.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ServerError _$ServerErrorFromJson(Map<String, dynamic> json) => _ServerError(
  generalServerStatusCode: json['generalServerStatusCode'] as String?,
  generalServerErrorId: json['generalServerErrorId'] as String?,
  generalMessage: json['generalMessage'] as String?,
  status: json['status'] as String?,
  errors:
      (json['errors'] as List<dynamic>?)
          ?.map((e) => ServerErrorDetail.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const <ServerErrorDetail>[],
);

Map<String, dynamic> _$ServerErrorToJson(_ServerError instance) =>
    <String, dynamic>{
      'generalServerStatusCode': instance.generalServerStatusCode,
      'generalServerErrorId': instance.generalServerErrorId,
      'generalMessage': instance.generalMessage,
      'status': instance.status,
      'errors': instance.errors,
    };
