import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../usecase/login_usecase.dart';

/// Authentication service that provides high-level authentication operations
@injectable
class AuthService {
  final LoginUseCase _loginUseCase;

  AuthService(this._loginUseCase);

  /// Login with email and password
  Future<AuthResult> login(String email, String password) async {
    try {
      Log.d('🔍 AuthService: Making login request...');

      final input = LoginInput(email: email, password: password);
      final output = await _loginUseCase.execute(input);

      Log.d('🔍 AuthService: Login successful');
      return AuthResult.success(
        token: output.accessToken,
        user: {
          'firstName': output.firstName,
          'lastName': output.lastName,
          'email': output.email,
          'orgId': output.orgId,
        },
      );
    } on AppException catch (e) {
      Log.d('🔍 AuthService: Login failed: ${e.toString()}');
      return AuthResult.failure(
        message: e.toString(),
        statusCode: _getStatusCodeFromException(e),
      );
    } catch (e) {
      Log.d('🔍 AuthService: Unexpected error: $e');
      return AuthResult.failure(
        message: 'Unexpected error: $e',
        statusCode: 500,
      );
    }
  }

  /// Get status code from exception
  int _getStatusCodeFromException(AppException exception) {
    switch (exception.appExceptionType) {
      case AppExceptionType.logic:
        return 400;
      case AppExceptionType.remote:
        return 400;
      case AppExceptionType.validation:
        return 400;
      case AppExceptionType.parse:
        return 500;
      case AppExceptionType.platform:
        return 500;
      case AppExceptionType.remoteConfig:
        return 500;
      case AppExceptionType.uncaught:
        return 500;
    }
  }
}

/// Result class for authentication operations
class AuthResult {
  final bool isSuccess;
  final String? token;
  final String? message;
  final int? statusCode;
  final dynamic user; // Using dynamic for now, can be typed later

  AuthResult._({
    required this.isSuccess,
    this.token,
    this.message,
    this.statusCode,
    this.user,
  });

  factory AuthResult.success({required String token, dynamic user}) {
    return AuthResult._(isSuccess: true, token: token, user: user);
  }

  factory AuthResult.failure({required String message, int? statusCode}) {
    return AuthResult._(
      isSuccess: false,
      message: message,
      statusCode: statusCode,
    );
  }
}
