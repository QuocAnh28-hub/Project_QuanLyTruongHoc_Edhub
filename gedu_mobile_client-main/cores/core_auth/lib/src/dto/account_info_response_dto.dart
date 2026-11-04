import 'package:json_annotation/json_annotation.dart';

part 'account_info_response_dto.g.dart';

@JsonSerializable()
class AccountInfoResponseDto {
  final int id;
  final String email;
  final String firstName;
  final String lastName;
  final int orgId;
  @JsonKey(name: 'refId', fromJson: _parseRefId)
  final int? refId;
  @JsonKey(name: 'phone')
  final String? phone;

  const AccountInfoResponseDto({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.orgId,
    this.refId,
    this.phone,
  });

  factory AccountInfoResponseDto.fromJson(Map<String, dynamic> json) =>
      _$AccountInfoResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AccountInfoResponseDtoToJson(this);

  /// Parse refId from multiple possible field names
  static int? _parseRefId(dynamic value) {
    if (value != null) {
      return (value as num).toInt();
    }
    return null;
  }
}
