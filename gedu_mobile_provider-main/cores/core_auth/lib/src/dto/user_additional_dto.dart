import 'package:json_annotation/json_annotation.dart';

part 'user_additional_dto.g.dart';

/// Convert dynamic value to int, handling both String and num types
int? _intFromJson(dynamic value) {
  if (value == null) {
    return null;
  }
  if (value is int) {
    return value;
  }
  if (value is num) {
    return value.toInt();
  }
  if (value is String) {
    return int.tryParse(value);
  }
  return null;
}

@JsonSerializable()
class UserAdditionalDto {
  final String? schoolYear;
  final String? schoolYearName;
  @JsonKey(fromJson: _intFromJson)
  final int? provinceId;
  final String? schoolName;
  final String? schoolCode;
  @JsonKey(defaultValue: false)
  final bool canPreschool;
  @JsonKey(defaultValue: false)
  final bool canPrimarySchool;
  @JsonKey(defaultValue: false)
  final bool canLowerSecondarySchool;
  @JsonKey(defaultValue: false)
  final bool canUpperSecondarySchool;

  const UserAdditionalDto({
    this.schoolYear,
    this.schoolYearName,
    this.provinceId,
    this.schoolName,
    this.schoolCode,
    this.canPreschool = false,
    this.canPrimarySchool = false,
    this.canLowerSecondarySchool = false,
    this.canUpperSecondarySchool = false,
  });

  factory UserAdditionalDto.fromJson(Map<String, dynamic> json) =>
      _$UserAdditionalDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UserAdditionalDtoToJson(this);
}
