import 'package:json_annotation/json_annotation.dart';
import 'user_additional_dto.dart';

part 'user_dto.g.dart';

@JsonSerializable()
class UserDto {
  final int id;
  final String email;
  final String firstName;
  final String lastName;
  final int orgId;
  @JsonKey(name: 'refId', fromJson: _parseRefId)
  final int? refId;
  final UserAdditionalDto additional;
  @JsonKey(name: 'phone')
  final String? phone;

  const UserDto({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.orgId,
    required this.additional,
    this.refId, this.phone,
  });

  factory UserDto.fromJson(Map<String, dynamic> json) =>
      _$UserDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UserDtoToJson(this);
  
  /// Parse refId from multiple possible field names
  static int? _parseRefId(dynamic value) {
    if (value != null) {
      return (value as num).toInt();
    }
    return null;
  }
}
