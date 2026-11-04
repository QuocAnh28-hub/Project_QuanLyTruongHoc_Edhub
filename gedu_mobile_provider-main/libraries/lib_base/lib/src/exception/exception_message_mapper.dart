import '../di/di.dart';
import 'app_exception.dart';
import 'friendly_message_config.dart';
import 'remote_exception.dart';
import 'validation_exception.dart';

class ExceptionMessageMapper {
  ExceptionMessageMapper();

  final friendlyMessageConfig = getIt.get<FriendlyMessageConfig>();

  String map(AppException appException) {
    switch (appException.appExceptionType) {
      case AppExceptionType.platform:
        return friendlyMessageConfig.platformMessage;
      case AppExceptionType.remote:
        final exception = appException as RemoteException;
        switch (exception.kind) {
          case RemoteExceptionKind.noInternet:
            return friendlyMessageConfig.noInternetMessage;
          case RemoteExceptionKind.network:
            return friendlyMessageConfig.noInternetMessage;
          case RemoteExceptionKind.serverDefined:
            if (exception.httpErrorCode == 401) {
              return friendlyMessageConfig.refreshTokenFailedMessage;
            }

            // Check for general message first
            String message = exception.serverError?.generalMessage ?? '';

            // If no general message, check the first error detail
            if (message.isEmpty &&
                exception.serverError?.errors.isNotEmpty == true) {
              final serverError = exception.serverError;
              if (serverError != null) {
                final firstError = serverError.errors.first;
                message = firstError.message;
              }
            }

            return message.isNotEmpty
                ? message
                : friendlyMessageConfig.serverDefinedMessage;
          case RemoteExceptionKind.serverUndefined:
            return friendlyMessageConfig.serverUndefinedMessage;
          case RemoteExceptionKind.timeout:
            return friendlyMessageConfig.timeoutMessage;
          case RemoteExceptionKind.cancellation:
            return friendlyMessageConfig.cancellationMessage;
          case RemoteExceptionKind.unknown:
            return friendlyMessageConfig.unknownMessage;
          case RemoteExceptionKind.refreshTokenFailed:
            return friendlyMessageConfig.refreshTokenFailedMessage;
          case RemoteExceptionKind.sslSecure:
            return friendlyMessageConfig.connectionSecurityMessage;
        }
      case AppExceptionType.parse:
        return friendlyMessageConfig.dataParsingMessage;
      case AppExceptionType.remoteConfig:
        return friendlyMessageConfig.loadConfigurationMessage;
      case AppExceptionType.uncaught:
        return friendlyMessageConfig.somethingWrongMessage;
      case AppExceptionType.validation:
        final exception = appException as ValidationException;
        if (exception.kind == ValidationExceptionKind.errorNullEmptyError) {
          return exception.errorMessage ?? exception.kind.key;
        }
        return exception.kind.key;
      case AppExceptionType.logic:
        return (appException as AppLogicException).message;
    }
  }
}
