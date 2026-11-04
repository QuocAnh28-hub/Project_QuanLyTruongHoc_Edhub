// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_additional_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserAdditionalDto _$UserAdditionalDtoFromJson(
  Map<String, dynamic> json,
) => UserAdditionalDto(
  schoolYear: json['schoolYear'] as String?,
  schoolYearName: json['schoolYearName'] as String?,
  provinceId: _intFromJson(json['provinceId']),
  schoolName: json['schoolName'] as String?,
  schoolCode: json['schoolCode'] as String?,
  canPreschool: json['canPreschool'] as bool? ?? false,
  canPrimarySchool: json['canPrimarySchool'] as bool? ?? false,
  canLowerSecondarySchool: json['canLowerSecondarySchool'] as bool? ?? false,
  canUpperSecondarySchool: json['canUpperSecondarySchool'] as bool? ?? false,
);

Map<String, dynamic> _$UserAdditionalDtoToJson(UserAdditionalDto instance) =>
    <String, dynamic>{
      'schoolYear': instance.schoolYear,
      'schoolYearName': instance.schoolYearName,
      'provinceId': instance.provinceId,
      'schoolName': instance.schoolName,
      'schoolCode': instance.schoolCode,
      'canPreschool': instance.canPreschool,
      'canPrimarySchool': instance.canPrimarySchool,
      'canLowerSecondarySchool': instance.canLowerSecondarySchool,
      'canUpperSecondarySchool': instance.canUpperSecondarySchool,
    };
