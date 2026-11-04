// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'server_error_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ServerErrorDetail _$ServerErrorDetailFromJson(Map<String, dynamic> json) =>
    _ServerErrorDetail(
      code: (json['code'] as num?)?.toInt(),
      serverStatusCode: json['serverStatusCode'] as String? ?? '-1',
      message: json['message'] as String? ?? '',
      field: json['field'] as String? ?? '',
      type: json['type'] as String? ?? '',
    );

Map<String, dynamic> _$ServerErrorDetailToJson(_ServerErrorDetail instance) =>
    <String, dynamic>{
      'code': instance.code,
      'serverStatusCode': instance.serverStatusCode,
      'message': instance.message,
      'field': instance.field,
      'type': instance.type,
    };
