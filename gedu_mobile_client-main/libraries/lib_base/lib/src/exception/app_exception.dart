abstract class AppException implements Exception {
  final bool ignorable;
  final AppExceptionType appExceptionType;

  const AppException(this.appExceptionType, {this.ignorable = false});
}

enum AppExceptionType {
  remote,
  parse,
  platform,
  remoteConfig,
  uncaught,
  validation,
  logic,
}

class AppLogicException extends AppException {
  final String message;

  const AppLogicException({
    required this.message,
  }) : super(AppExceptionType.logic);
}