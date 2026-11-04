import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'server_error_detail.freezed.dart';
part 'server_error_detail.g.dart';

@freezed
abstract class ServerErrorDetail with _$ServerErrorDetail {
  const factory ServerErrorDetail({
    /// server-defined error code
    int? code,

    /// server-defined status code
    @Default('-1') String serverStatusCode,

    /// server-defined message
    @Default('') String message,

    /// server-defined field
    @Default('') String field,

    /// server-defined type enum
    @Default('') String type,
  }) = _ServerErrorDetail;

  factory ServerErrorDetail.fromJson(Map<String, dynamic> json) =>
      _$ServerErrorDetailFromJson(json);
}

/// Extension to provide string conversion for ServerErrorDetail
extension ServerErrorDetailExtension on ServerErrorDetail {
  /// Get code as string, handling null values
  String get codeAsString => code?.toString() ?? '';
}
