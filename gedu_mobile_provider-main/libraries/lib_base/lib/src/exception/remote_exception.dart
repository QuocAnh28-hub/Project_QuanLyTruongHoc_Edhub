import 'package:dartx/dartx.dart';
import 'server_error_detail.dart';

import 'app_exception.dart';
import 'server_error.dart';

class RemoteException extends AppException {
  const RemoteException({
    required this.kind,
    this.httpErrorCode,
    this.serverError,
    this.rootException,
  }) : super(AppExceptionType.remote);

  final RemoteExceptionKind kind;
  final int? httpErrorCode;
  final ServerError? serverError;
  final Object? rootException;

  String get generalServerStatusCode =>
      serverError?.generalServerStatusCode ??
      serverError?.errors.firstOrNull?.serverStatusCode ??
      '-1';

  String? get generalServerErrorId =>
      serverError?.generalServerErrorId ??
      serverError?.errors.firstOrNull?.codeAsString;

  String? get generalServerMessage =>
      serverError?.generalMessage ?? serverError?.errors.firstOrNull?.message;

  bool get isExpiredSession =>
      kind == RemoteExceptionKind.refreshTokenFailed || httpErrorCode == 401;

  bool get isInternalServerError {
    final serverErrors = [500, 502, 503, 504];
    return serverErrors.contains(httpErrorCode);
  }

  String? get firstServerErrorType => serverError?.errors.firstOrNull?.type;

  @override
  String toString() {
    return '''RemoteException: {
      kind: $kind
      httpErrorCode: $httpErrorCode,
      serverError: $serverError,
      rootException: $rootException,
      generalServerMessage: $generalServerMessage,
      generalServerErrorCode: $generalServerStatusCode,
      generalServerErrorId: $generalServerErrorId,
      stackTrace: ${rootException is Error ? (rootException as Error).stackTrace : ''}}''';
  }
}

enum RemoteExceptionKind {
  noInternet,
  network,

  /// server has defined response
  serverDefined,

  /// server has not defined response
  serverUndefined,
  refreshTokenFailed,
  timeout,
  cancellation,
  unknown,
  sslSecure,
}
