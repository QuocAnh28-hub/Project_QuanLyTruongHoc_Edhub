import 'package:lib_base/src/exception/app_exception.dart';

class ValidationException extends AppException {
  const ValidationException(this.kind, {this.errorMessage})
      : super(AppExceptionType.validation);

  final ValidationExceptionKind kind;
  final String? errorMessage;

  @override
  String toString() {
    return 'ValidationException: {kind: $kind}';
  }
}

enum ValidationExceptionKind {
  invalidEmail('invalidEmail'),
  emptyEmail('emptyEmail'),
  invalidPassword('invalidPassword'),
  invalidUserName('invalidUserName'),
  invalidPhoneNumber('invalidPhoneNumber'),
  invalidDateTime('invalidDateTime'),
  passwordsAreNotMatch('passwordsAreNotMatch'),
  errorAuthCanceled('errorAuthCanceled'),
  errorEmailAlreadyInUse('errorEmailAlreadyInUse'),
  errorSmallPassword('errorSmallPassword'),
  errorBadFormatEmail('errorBadFormatEmail'),
  errorInvalidPass('errorInvalidPass'),
  errorNoUserFound('errorNoUserFound'),
  errorTryAgainLater('errorTryAgainLater'),
  errorDifferentCredential('errorDifferentCredential'),
  errorUserDisabled('errorUserDisabled'),
  nullUser('nullUser'),
  errorNullEmptyError('errorNullEmptyError');

  final String key;

  const ValidationExceptionKind(this.key);
}
