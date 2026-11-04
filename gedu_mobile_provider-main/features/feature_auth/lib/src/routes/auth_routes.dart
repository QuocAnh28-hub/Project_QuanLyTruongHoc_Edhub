import 'package:lib_base/lib_base.dart';

/// Auth feature routes
class AuthRoutes {
  const AuthRoutes();

  /// Onboarding route
  static final AppRoute onboarding = AppRoute(
    path: '/onboarding',
    name: 'onboarding',
  );

  /// Login route
  static final AppRoute login = AppRoute(path: '/login', name: 'login');

  /// Logout route
  static final AppRoute logout = AppRoute(
    path: '/auth/logout',
    name: 'auth_logout',
  );

  /// Register route
  static final AppRoute register = AppRoute(
    path: '/auth/register',
    name: 'auth_register',
  );

  /// Forgot password route
  static final AppRoute forgotPassword = AppRoute(
    path: '/auth/forgot-password',
    name: 'auth_forgot_password',
  );

  /// Reset password route
  static final AppRoute resetPassword = AppRoute(
    path: '/auth/reset-password',
    name: 'auth_reset_password',
  );

  /// Verify email route
  static final AppRoute verifyEmail = AppRoute(
    path: '/auth/verify-email',
    name: 'auth_verify_email',
  );

  /// Change password route
  static final AppRoute changePassword = AppRoute(
    path: '/auth/change-password',
    name: 'auth_change_password',
  );

  /// Change password success route
  static final AppRoute changePasswordSuccess = AppRoute(
    path: '/auth/change-password-success',
    name: 'auth_change_password_success',
  );

  List<AppRoute> get all => [
    onboarding,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    changePassword,
    changePasswordSuccess,
  ];
}

/// Route configuration class for auth feature
class AppRoute extends FeatureModulePath {
  final String path;
  final String name;
  final Map<String, String>? parameters;
  final Object? extra;

  AppRoute({
    required this.path,
    required this.name,
    this.parameters,
    this.extra,
  });

  @override
  String get fullPath => path;

  /// Get route with parameters
  AppRoute withParameters(Map<String, String> parameters) {
    return AppRoute(
      path: path,
      name: name,
      parameters: parameters,
      extra: extra,
    );
  }

  /// Get route with extra data
  AppRoute withExtra(Object extra) {
    return AppRoute(
      path: path,
      name: name,
      parameters: parameters,
      extra: extra,
    );
  }

  @override
  String toString() {
    return 'AppRoute(path: $path, name: $name)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AppRoute && other.path == path && other.name == name;
  }

  @override
  int get hashCode => path.hashCode ^ name.hashCode;
}
