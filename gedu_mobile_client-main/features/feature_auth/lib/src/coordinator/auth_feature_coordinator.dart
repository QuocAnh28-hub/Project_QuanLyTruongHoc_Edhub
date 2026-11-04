import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_base/src/navigator/base_navigator.dart';

import '../../feature_auth.dart';

/// Feature coordinator for authentication module
@injectable
class AuthFeatureCoordinator extends FeatureModuleCoordinator
    implements BaseAuthNavigator {
  static const String _tag = 'AuthFeatureCoordinator';

  final AppPreferences _appPreferences;

  // Callback for language change (set by app coordinator)
  Future<void> Function(String)? _languageChangeCallback;

  AuthFeatureCoordinator(this._appPreferences);

  @override
  List<RouteBase> get routes => [
    // Onboarding route
    GoRoute(
      path: AuthRoutes.onboarding.path,
      name: AuthRoutes.onboarding.name,
      builder: (context, state) => const OnboardingPage(),
    ),

    // Change password route
    GoRoute(
      path: AuthRoutes.changePassword.path,
      name: AuthRoutes.changePassword.name,
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        final isFirstTimeLogin = extra?['isFirstTimeLogin'] as bool? ?? false;
        return BlocProvider(
          create: (context) => getIt<ChangePasswordBloc>(),
          child: ChangePasswordPage(isFirstTimeLogin: isFirstTimeLogin),
        );
      },
    ),

    // Change password success route
    GoRoute(
      path: AuthRoutes.changePasswordSuccess.path,
      name: AuthRoutes.changePasswordSuccess.name,
      builder: (context, state) => const ChangePasswordSuccessPage(),
    ),
  ];

  // ==================== AUTH NAVIGATION METHODS ====================

  /// Navigate to change password page
  void navigateToChangePassword(
    BuildContext context, {
    bool isFirstTimeLogin = false,
  }) {
    Log.d(
      '$_tag: Navigating to change password (firstTime: $isFirstTimeLogin)',
    );
    context.go(
      AuthRoutes.changePassword.path,
      extra: {'isFirstTimeLogin': isFirstTimeLogin},
    );
  }

  /// Navigate to change password success page
  void navigateToChangePasswordSuccess(BuildContext context) {
    Log.d('$_tag: Navigating to change password success');
    context.go(AuthRoutes.changePasswordSuccess.path);
  }

  /// Navigate to login page
  void navigateToLogin(BuildContext context) {
    Log.d('$_tag: Navigating to login');
    context.go('/login');
  }

  /// Navigate to onboarding page
  void navigateToOnboarding(BuildContext context) {
    Log.d('$_tag: Navigating to onboarding');
    context.go(AuthRoutes.onboarding.path);
  }

  // ==================== LEGACY NAVIGATION METHODS (for backward compatibility) ====================

  /// Navigate to login page
  void goToLogin() {
    Log.d('$_tag: Navigating to login');
    // This will be handled by the app coordinator
  }

  /// Navigate to register page
  void goToRegister() {
    Log.d('$_tag: Navigating to register');
    // This will be handled by the app coordinator
  }

  /// Navigate to forgot password page
  void goToForgotPassword() {
    Log.d('$_tag: Navigating to forgot password');
    // This will be handled by the app coordinator
  }

  /// Navigate to reset password page
  void goToResetPassword() {
    Log.d('$_tag: Navigating to reset password');
    // This will be handled by the app coordinator
  }

  /// Navigate to change password page
  void goToChangePassword({bool isFirstTimeLogin = false}) {
    Log.d(
      '$_tag: Navigating to change password (firstTime: $isFirstTimeLogin)',
    );
    final context = GlobalVariable.navState.currentContext;
    if (context != null) {
      context.push(
        AuthRoutes.changePassword.path,
        extra: {'isFirstTimeLogin': isFirstTimeLogin},
      );
    } else {
      Log.e('$_tag: No context available for navigation');
    }
  }

  /// Navigate to verify email page
  void goToVerifyEmail() {
    Log.d('$_tag: Navigating to verify email');
    // This will be handled by the app coordinator
  }

  /// Navigate to logout
  void goToLogout() {
    Log.d('$_tag: Navigating to logout');
    // This will be handled by the app coordinator
  }

  // ==================== AUTHENTICATION METHODS ====================

  /// Handle successful login
  void onLoginSuccess() {
    Log.d('$_tag: Login successful, checking student review status');

    // Check if user has already confirmed student review
    final studentReviewConfirmed = _appPreferences.getStudentReviewConfirmed();
    Log.d('$_tag: Student review confirmed: $studentReviewConfirmed');

    final context = GlobalVariable.navState.currentContext;
    if (context != null) {
      if (studentReviewConfirmed) {
        // User has already confirmed student review, navigate to home
        Log.d('$_tag: Student review confirmed, navigating to home');
        context.go('/home');
      } else {
        // User needs to review student information first
        Log.d(
          '$_tag: Student review not confirmed, navigating to student review',
        );
        context.go('/student-review');
      }
    }
  }

  /// Handle login failure
  void onLoginFailure(String message) {
    Log.d('$_tag: Login failed: $message');
    // This will be handled by the app coordinator
  }

  /// Handle logout
  void onLogout() {
    Log.d('$_tag: Logout successful, navigating to login');
    // This will be handled by the app coordinator
  }

  /// Handle logout failure
  void onLogoutFailure(String message) {
    Log.d('$_tag: Logout failed: $message');
    // This will be handled by the app coordinator
  }

  /// Handle change password success
  void onChangePasswordSuccess() {
    Log.d('$_tag: Change password successful');
    final context = GlobalVariable.navState.currentContext;
    if (context != null) {
      // Navigate to change password success page
      context.push(AuthRoutes.changePasswordSuccess.path);
    } else {
      Log.e('$_tag: No context available for navigation');
    }
  }

  /// Handle change password failure
  void onChangePasswordFailure(String message) {
    Log.d('$_tag: Change password failed: $message');
    // Show error message (this will be handled by the UI)
  }

  /// Check if user is authenticated
  bool get isAuthenticated => AuthStorage.isAuthenticated;

  /// Get current user email
  String? get currentUserEmail => AuthStorage.getUserEmail();

  /// Get current user full name
  String? get currentUserFullName => AuthStorage.getUserFullName();

  /// Get current user ID
  int? get currentUserId => AuthStorage.getUserId();

  /// Get current organization ID
  int? get currentOrgId => AuthStorage.getOrgId();

  // ==================== UTILITY METHODS ====================

  /// Show authentication error
  void showAuthError(String message) {
    Log.d('$_tag: Showing auth error: $message');
    // This will be handled by the app coordinator
  }

  /// Show authentication success
  void showAuthSuccess(String message) {
    Log.d('$_tag: Showing auth success: $message');
    // This will be handled by the app coordinator
  }

  /// Show confirmation dialog for logout
  Future<bool?> showLogoutConfirmation() async {
    // This will be handled by the app coordinator
    return null;
  }

  /// Show confirmation dialog for delete account
  Future<bool?> showDeleteAccountConfirmation() async {
    // This will be handled by the app coordinator
    return null;
  }

  /// Get user data
  Map<String, dynamic>? getUserData() {
    return AuthStorage.getUserData();
  }

  /// Clear user data
  Future<bool> clearUserData() async {
    return await AuthStorage.logout();
  }

  // ==================== LANGUAGE MANAGEMENT ====================

  /// Set language change callback (called by app coordinator)
  void setLanguageChangeCallback(Future<void> Function(String) callback) {
    _languageChangeCallback = callback;
    Log.d('$_tag: Language change callback set');
  }

  /// Change app language
  /// This will be delegated to the app coordinator
  Future<void> changeLanguage(String languageCode) async {
    Log.d('$_tag: Requesting language change to: $languageCode');

    if (_languageChangeCallback != null) {
      await _languageChangeCallback!(languageCode);
    }
  }
}
