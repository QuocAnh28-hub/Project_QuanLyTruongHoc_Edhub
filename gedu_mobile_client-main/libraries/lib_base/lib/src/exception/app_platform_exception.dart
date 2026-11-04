import 'app_exception.dart';

class AppPlatformException extends AppException {
  final String? platformMessage;

  const AppPlatformException(this.platformMessage)
    : super(AppExceptionType.platform);
}
