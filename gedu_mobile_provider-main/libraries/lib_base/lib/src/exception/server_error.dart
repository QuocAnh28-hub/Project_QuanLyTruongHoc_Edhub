import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';
import 'server_error_detail.dart';

part 'server_error.freezed.dart';

part 'server_error.g.dart';

@freezed
abstract class ServerError with _$ServerError {
  const factory ServerError({
    /// server-defined status code
    String? generalServerStatusCode,

    /// server-defined error id
    String? generalServerErrorId,

    /// server-defined message
    String? generalMessage,

    /// server-defined message
    String? status,
    @Default(<ServerErrorDetail>[]) List<ServerErrorDetail> errors,
  }) = _ServerError;

  factory ServerError.fromJson(Map<String, dynamic> json) =>
      _$ServerErrorFromJson(json);
}

enum ServerStatusCode {
  success(code: "200"),
  internalServerError(code: "500");

  const ServerStatusCode({required this.code});

  final String code;
}
