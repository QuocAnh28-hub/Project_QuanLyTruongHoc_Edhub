import 'package:json_annotation/json_annotation.dart';
import 'user_dto.dart';

part 'login_response_dto.g.dart';

@JsonSerializable()
class LoginResponseDto {
  @JsonKey(name: 'access_token')
  final String accessToken;
  final UserDto user;

  const LoginResponseDto({required this.accessToken, required this.user});

  factory LoginResponseDto.fromJson(Map<String, dynamic> json) =>
      _$LoginResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$LoginResponseDtoToJson(this);
}
