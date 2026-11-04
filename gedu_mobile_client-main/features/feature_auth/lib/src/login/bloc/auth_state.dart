import 'package:lib_base/lib_base.dart';

/// Unified authentication state that handles all auth-related states
class AuthState extends BaseBlocState {
  // Status flags
  final bool isLoading;
  final bool isAuthenticated;
  final bool showForgotPasswordDialog;
  final bool showChangePasswordSuccess;

  // Form data
  final String? selectedProvince;
  final String? selectedLanguage;
  final String phoneNumber;
  final String password;
  final bool isFormValid;
  final bool rememberMe;

  // User data
  final Map<String, dynamic>? userData;

  // Error handling
  final String? errorMessage;
  final String? logoutErrorMessage;
  final String? changePasswordErrorMessage;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.showForgotPasswordDialog = false,
    this.showChangePasswordSuccess = false,
    this.selectedProvince,
    this.selectedLanguage,
    this.phoneNumber = '',
    this.password = '',
    this.isFormValid = false,
    this.rememberMe = false,
    this.userData,
    this.errorMessage,
    this.logoutErrorMessage,
    this.changePasswordErrorMessage,
  });

  /// Create initial state
  factory AuthState.initial() => const AuthState();

  /// Create loading state
  factory AuthState.loading() => const AuthState(isLoading: true);

  /// Create success state
  factory AuthState.success({
    required bool isAuthenticated,
    Map<String, dynamic>? userData,
  }) => AuthState(isAuthenticated: isAuthenticated, userData: userData);

  /// Create error state
  factory AuthState.error(String message) => AuthState(errorMessage: message);

  /// Create logout success state
  factory AuthState.logoutSuccess() => const AuthState();

  /// Create logout error state
  factory AuthState.logoutError(String message) =>
      AuthState(logoutErrorMessage: message);

  /// Create change password success state
  factory AuthState.changePasswordSuccess() =>
      const AuthState(showChangePasswordSuccess: true);

  /// Create change password error state
  factory AuthState.changePasswordError(String message) =>
      AuthState(changePasswordErrorMessage: message);

  /// Create forgot password dialog state
  factory AuthState.showForgotPasswordDialog() =>
      const AuthState(showForgotPasswordDialog: true);

  /// Create form state
  factory AuthState.form({
    String? selectedProvince,
    String? selectedLanguage,
    String phoneNumber = '',
    String password = '',
    bool isFormValid = false,
    bool rememberMe = false,
    bool isLoading = false,
    String? errorMessage,
    Map<String, dynamic>? userData,
  }) => AuthState(
    selectedProvince: selectedProvince,
    selectedLanguage: selectedLanguage,
    phoneNumber: phoneNumber,
    password: password,
    isFormValid: isFormValid,
    rememberMe: rememberMe,
    isLoading: isLoading,
    errorMessage: errorMessage,
    userData: userData,
  );

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    bool? showForgotPasswordDialog,
    bool? showChangePasswordSuccess,
    String? selectedProvince,
    String? selectedLanguage,
    String? phoneNumber,
    String? password,
    bool? isFormValid,
    bool? rememberMe,
    Map<String, dynamic>? userData,
    String? errorMessage,
    String? logoutErrorMessage,
    String? changePasswordErrorMessage,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      showForgotPasswordDialog:
          showForgotPasswordDialog ?? this.showForgotPasswordDialog,
      showChangePasswordSuccess:
          showChangePasswordSuccess ?? this.showChangePasswordSuccess,
      selectedProvince: selectedProvince ?? this.selectedProvince,
      selectedLanguage: selectedLanguage ?? this.selectedLanguage,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      password: password ?? this.password,
      isFormValid: isFormValid ?? this.isFormValid,
      rememberMe: rememberMe ?? this.rememberMe,
      userData: userData ?? this.userData,
      errorMessage: errorMessage ?? this.errorMessage,
      logoutErrorMessage: logoutErrorMessage ?? this.logoutErrorMessage,
      changePasswordErrorMessage:
          changePasswordErrorMessage ?? this.changePasswordErrorMessage,
    );
  }
}
