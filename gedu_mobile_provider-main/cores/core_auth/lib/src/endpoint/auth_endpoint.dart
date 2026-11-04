import 'package:core_network/core_network.dart';
import 'package:injectable/injectable.dart';

/// Request info for login
class LoginRequestInfo extends GenericRequestInfo {
  final Map<String, dynamic> data;

  LoginRequestInfo({required this.data});

  @override
  RestMethod get method => RestMethod.post;

  @override
  String get path => '/auth/login';
}

/// Request info for logout
class LogoutRequestInfo extends GenericRequestInfo {
  @override
  RestMethod get method => RestMethod.post;

  @override
  String get path => '/auth/logout';
}

/// Request info for refresh token
class RefreshTokenRequestInfo extends GenericRequestInfo {
  final Map<String, dynamic> data;

  RefreshTokenRequestInfo({required this.data});

  @override
  RestMethod get method => RestMethod.post;

  @override
  String get path => '/auth/refresh';
}

/// Request info for get profile
class GetProfileRequestInfo extends GenericRequestInfo {
  @override
  RestMethod get method => RestMethod.get;

  @override
  String get path => '/auth/profile';
}

/// Request info for change password
class ChangePasswordRequestInfo extends GenericRequestInfo {
  final Map<String, dynamic> data;

  ChangePasswordRequestInfo({required this.data});

  @override
  RestMethod get method => RestMethod.post;

  @override
  String get path => '/auth/change-password';
}

/// Request info for get account info
class GetAccountInfoRequestInfo extends GenericRequestInfo {
  @override
  RestMethod get method => RestMethod.get;

  @override
  String get path => '/auth/account-info';
}

@injectable
class AuthEndpoint {
  /// Login endpoint
  static LoginRequestInfo login({
    required String email,
    required String password,
  }) {
    return LoginRequestInfo(data: {'email': email, 'password': password});
  }

  /// Logout endpoint
  static LogoutRequestInfo logout() {
    return LogoutRequestInfo();
  }

  /// Refresh token endpoint
  static RefreshTokenRequestInfo refreshToken({required String refreshToken}) {
    return RefreshTokenRequestInfo(data: {'refresh_token': refreshToken});
  }

  /// Get current user profile endpoint
  static GetProfileRequestInfo getProfile() {
    return GetProfileRequestInfo();
  }

  /// Change password endpoint
  static ChangePasswordRequestInfo changePassword({
    required String oldPassword,
    required String newPassword,
  }) {
    return ChangePasswordRequestInfo(
      data: {'oldPassword': oldPassword, 'newPassword': newPassword},
    );
  }

  /// Get account info endpoint
  static GetAccountInfoRequestInfo getAccountInfo() {
    return GetAccountInfoRequestInfo();
  }
}
