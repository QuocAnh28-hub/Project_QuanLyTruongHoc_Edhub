import 'package:core_auth/core_auth.dart' as core_auth;
import 'package:core_localization/core_localization.dart';
import 'package:core_storage/core_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:lib_utils/lib_utils.dart';

import '../../coordinator/auth_feature_coordinator.dart';
import 'auth_event.dart';
import 'auth_state.dart';

/// Auth bloc for handling authentication logic
@injectable
class AuthBloc extends BaseBloc<AuthEvent, AuthState> {
  static const String _tag = 'AuthBloc';

  final core_auth.LoginUseCase _loginUseCase;
  final core_auth.ChangePasswordUseCase _changePasswordUseCase;
  final CommonBloc _commonBloc;
  final AppPreferences _appPreferences;
  final AuthFeatureCoordinator _coordinator;
  BuildContext? _context;

  AuthBloc(
    this._loginUseCase,
    this._changePasswordUseCase,
    this._commonBloc,
    this._appPreferences,
    this._coordinator,
  ) : super(AuthState.initial()) {
    // Set the common bloc
    commonBloc = _commonBloc;

    on<LoginEvent>(_onLoginEvent);
    on<LogoutEvent>(_onLogoutEvent);
    on<CheckAuthStatusEvent>(_onCheckAuthStatusEvent);
    on<ClearAuthDataEvent>(_onClearAuthDataEvent);
    on<ChangePasswordEvent>(_onChangePasswordEvent);
    on<ProvinceSelectedEvent>(_onProvinceSelected);
    on<FormFieldChangedEvent>(_onFormFieldChanged);
    on<RememberMeChangedEvent>(_onRememberMeChanged);
    on<ChangeLanguageEvent>(_onChangeLanguage);
    on<ShowForgotPasswordDialogEvent>(_onShowForgotPasswordDialog);
  }

  /// Set the context for loading overlay
  void setContext(BuildContext context) {
    _context = context;
  }

  Future<void> _onLoginEvent(LoginEvent event, Emitter<AuthState> emit) async {
    Log.d('$_tag: Starting login process');

    // Show loading overlay
    _showLoading();

    // Emit loading state with current form data
    final currentState = state;
    emit(currentState.copyWith(isLoading: true, errorMessage: null));

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: Attempting login for phone: ${event.email}');

        final loginOutput = await _loginUseCase.execute(
          core_auth.LoginInput(email: event.email, password: event.password),
        );

        // Convert LoginOutput to user data map
        final userData = {
          'accessToken': loginOutput.accessToken,
          'firstName': loginOutput.firstName,
          'lastName': loginOutput.lastName,
          'email': loginOutput.email,
          'orgId': loginOutput.orgId,
          'refId': loginOutput.refId,
        };

        Log.d('$_tag: ✅ Login successful');
        Log.d('$_tag: 🎉 User authenticated successfully');

        // Save login credentials only if remember me is checked
        if (event.rememberMe) {
                await _saveLoginCredentials(
        event.email,
        event.password,
        event.province,
      );
          // Save remember me status
          await _appPreferences.saveRememberMeStatus(true);
          Log.d('$_tag: Remember me enabled - credentials and status saved');
        } else {
          Log.d('$_tag: Remember me not checked - skipping credential save');
          // Clear remember me status
          await _appPreferences.saveRememberMeStatus(false);
        }

        Log.d('$_tag: ✅ Login successful');
        Log.d('$_tag: 🎉 User authenticated successfully');

        // Check if password has been changed
        final passwordChanged = _appPreferences.getPasswordChanged();
        Log.d('$_tag: Password changed status: $passwordChanged');

        // Emit success state with userData and clear any error messages
        final currentState = state;
        emit(
          currentState.copyWith(
            isLoading: false,
            userData: userData,
            errorMessage: null, // Clear any previous error messages
          ),
        );

        if (!passwordChanged) {
          Log.d('$_tag: Password not changed, navigating to change password');
        } else {
          Log.d('$_tag: Password already changed, navigating to home');
        }
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        Log.e('$_tag: Login error caught: ${e.toString()}');
        final currentState = state;
        emit(
          currentState.copyWith(
            isLoading: false,
            errorMessage: _formatServerErrorMessage(e),
          ),
        );
        return;
      },
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );

    Log.d('$_tag: Login process completed');
  }

  Future<void> _onLogoutEvent(
    LogoutEvent event,
    Emitter<AuthState> emit,
  ) async {
    // Show loading overlay
    _showLoading();

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: 🚪 Attempting logout');

        // Check if remember me was enabled
        final rememberMeEnabled = _appPreferences.getRememberMeStatus();
        Log.d(
          '$_tag: Remember me status: ${rememberMeEnabled ? 'enabled' : 'disabled'}',
        );

        if (rememberMeEnabled) {
          // If remember me was enabled, only clear auth data (token and password)
          // Keep department and phone number for convenience
          await _clearAuthDataOnly();
        } else {
          // If remember me was not enabled, clear all credentials
          await _clearStoredCredentials();
        }

        // Simulate logout API call
        await Future.delayed(const Duration(seconds: 1));
        emit(AuthState.logoutSuccess());
      },
      handleLoading:
          false, // Disable automatic loading since we handle it manually
      handleError:
          false, // Disable automatic error handling since we handle it manually
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );
  }

  Future<void> _onCheckAuthStatusEvent(
    CheckAuthStatusEvent event,
    Emitter<AuthState> emit,
  ) async {
    // Show loading overlay
    _showLoading();

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: 🔍 Checking authentication status');

        // Log currently stored credentials
        await _logStoredCredentials();

        // Simulate auth status check
        await Future.delayed(const Duration(seconds: 1));
        emit(AuthState.success(isAuthenticated: false));
      },
      handleLoading:
          false, // Disable automatic loading since we handle it manually
      handleError:
          false, // Disable automatic error handling since we handle it manually
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );
  }

  Future<void> _onClearAuthDataEvent(
    ClearAuthDataEvent event,
    Emitter<AuthState> emit,
  ) async {
    Log.d('$_tag: 🧹 Clearing authentication data');

    // Get current state
    final currentState = state;
    // Clear userData but keep form fields
    emit(currentState.copyWith(userData: null, errorMessage: null));
    Log.d('$_tag: ✅ UserData cleared from AuthState');
  }

  Future<void> _onChangePasswordEvent(
    ChangePasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    // Show loading overlay
    _showLoading();

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: 🔐 Attempting to change password');

        // Call the real change password API
        final result = await _changePasswordUseCase.execute(
          core_auth.ChangePasswordInput(
            oldPassword: event.currentPassword,
            newPassword: event.newPassword,
          ),
        );

        if (result.success) {
          // Update stored password
          await _appPreferences.saveUserPassword(event.newPassword);
          Log.d('$_tag: ✅ Password updated in storage');
          emit(AuthState.changePasswordSuccess());

          // Use coordinator to navigate
          _coordinator.onChangePasswordSuccess();
        } else {
          Log.e('$_tag: ❌ Password change failed: ${result.message}');
          emit(
            AuthState.changePasswordError(
              result.message ?? 'Failed to change password',
            ),
          );

          // Use coordinator to handle failure
          _coordinator.onChangePasswordFailure(
            result.message ?? 'Failed to change password',
          );
        }
      },
      handleLoading:
          false, // Disable automatic loading since we handle it manually
      handleError:
          false, // Disable automatic error handling since we handle it manually
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );
  }

  /// Show loading overlay with Lottie animation
  void _showLoading() {
    if (_context != null) {
      final l10n = AppLocalizations.of(_context!);
      LoadingService().showLottieLoading(
        context: _context!,
        animationPath:
            'packages/lib_design_system/assets/animation/loading_animation.json',
        message: l10n?.loginLoadingMessage ?? 'Logging in...',
      );
    }
  }

  /// Hide loading overlay
  void _hideLoading() {
    LoadingService().hideLoading();
  }

  /// Show loading overlay with custom animation
  void showCustomLoading(BuildContext context) {
    showLoadingOverlay(
      context,
      animationPath: 'assets/animation/loading_animation.json',
      useShimmer: false, // Use Lottie animation
    );
  }

  /// Hide loading overlay
  void hideCustomLoading() {
    hideLoadingOverlay();
  }

  // ==================== NAVIGATION METHODS ====================

  /// Handle navigation after login success
  void handleLoginSuccess(BuildContext context) {
    Log.d('$_tag: Navigating to home after successful login');
    // Navigate to home screen
    // context.go('/home');
  }

  /// Handle login error
  void handleLoginError(BuildContext context, String message) {
    Log.e('$_tag: Login error: $message');
    // Show error message
    showNotification(message, NotificationType.negative);
  }

  /// Check and log currently stored credentials
  Future<void> _logStoredCredentials() async {
    try {
      Log.d('$_tag: 🔍 Checking currently stored credentials...');

      final phoneNumber = _appPreferences.getUserPhoneNumber();
      final password = _appPreferences.getUserPassword();
      final province = _appPreferences.getUserProvince();

      if (phoneNumber != null) {
        Log.d(
          '$_tag: 📱 Stored phone number: ${phoneNumber.replaceRange(0, phoneNumber.length - 4, '****')}',
        );
      } else {
        Log.d('$_tag: 📱 No phone number stored');
      }

      if (password != null) {
        Log.d('$_tag: 🔐 Stored password: ${'*' * password.length}');
      } else {
        Log.d('$_tag: 🔐 No password stored');
      }

      if (province != null) {
        Log.d('$_tag: 🏢 Stored province: $province');
      } else {
        Log.d('$_tag: 🏢 No province stored');
      }
    } catch (e) {
      Log.e('$_tag: ❌ Exception while checking stored credentials: $e');
    }
  }

  /// Clear stored login credentials
  Future<void> _clearStoredCredentials() async {
    try {
      Log.d('$_tag: 🗑️ Starting to clear stored login credentials...');

      final result = await _appPreferences.clearLoginCredentials();

      if (result) {
        Log.d('$_tag: ✅ Login credentials cleared successfully');
        Log.d('$_tag: 📱 Phone number removed from storage');
        Log.d('$_tag: 🔐 Password removed from storage');
        Log.d('$_tag: 🏢 Province removed from storage');
      } else {
        Log.e(
          '$_tag: ❌ Failed to clear login credentials - operation returned false',
        );
      }
    } catch (e) {
      Log.e('$_tag: ❌ Exception while clearing login credentials: $e');
    }
  }

  /// Clear only auth data (token and password) while preserving province and phone number
  Future<void> _clearAuthDataOnly() async {
    try {
      Log.d('$_tag: 🔐 Starting to clear auth data only...');

      final result = await _appPreferences.clearAuthDataOnly();

      if (result) {
        Log.d('$_tag: ✅ Auth data cleared successfully');
        Log.d('$_tag: 🔐 Password removed from storage');
        Log.d('$_tag: 🔑 Auth token removed from storage');
        Log.d('$_tag: 📱 Phone number preserved for convenience');
        Log.d('$_tag: 🏢 Province preserved for convenience');
      } else {
        Log.e('$_tag: ❌ Failed to clear auth data - operation returned false');
      }
    } catch (e) {
      Log.e('$_tag: ❌ Exception while clearing auth data: $e');
    }
  }

  /// Save login credentials to storage
  Future<void> _saveLoginCredentials(
    String phoneNumber,
    String password,
    String? province,
  ) async {
    try {
      Log.d('$_tag: Starting to save login credentials...');
      Log.d(
        '$_tag: Phone number: ${phoneNumber.replaceRange(0, phoneNumber.length - 4, '****')}',
      );
      Log.d('$_tag: Password: ${'*' * password.length}');
      Log.d('$_tag: Province: ${province ?? 'Not selected'}');

      final result = await _appPreferences.saveLoginCredentials(
        phoneNumber: phoneNumber,
        password: password,
        province: province,
      );

      if (result) {
        Log.d('$_tag: ✅ Login credentials saved successfully');
        Log.d(
          '$_tag: 📱 Phone number stored: ${phoneNumber.replaceRange(0, phoneNumber.length - 4, '****')}',
        );
        Log.d('$_tag: 🔐 Password stored: ${'*' * password.length}');
        if (province != null) {
          Log.d('$_tag: 🏢 Province stored: $province');
        }
      } else {
        Log.e(
          '$_tag: ❌ Failed to save login credentials - operation returned false',
        );
      }
    } catch (e) {
      Log.e('$_tag: ❌ Exception while saving login credentials: $e');
    }
  }

  /// Format server error message to be more user-friendly
  String _formatServerErrorMessage(AppException exception) {
    // Get the detailed error message from the exception
    String errorMessage = exception.toString();

    // Try to extract more specific error details
    if (exception is RemoteException) {
      // Get the general server message if available
      errorMessage = exception.generalServerMessage ?? errorMessage;

      // Handle specific remote exception kinds
      switch (exception.kind) {
        case RemoteExceptionKind.noInternet:
          return 'Không có kết nối internet. Vui lòng kiểm tra kết nối mạng và thử lại.';
        case RemoteExceptionKind.network:
          return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
        case RemoteExceptionKind.timeout:
          return 'Kết nối bị timeout. Vui lòng thử lại.';
        case RemoteExceptionKind.serverDefined:
        case RemoteExceptionKind.serverUndefined:
          // Use the server message if available
          break;
        case RemoteExceptionKind.refreshTokenFailed:
          return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        case RemoteExceptionKind.cancellation:
          return 'Yêu cầu đã bị hủy.';
        case RemoteExceptionKind.sslSecure:
          return 'Lỗi bảo mật kết nối. Vui lòng thử lại.';
        case RemoteExceptionKind.unknown:
          return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
      }
    }

    // Map common error messages to Vietnamese user-friendly versions
    if (errorMessage.toLowerCase().contains('network') ||
        errorMessage.toLowerCase().contains('connection')) {
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
    }
    if (errorMessage.toLowerCase().contains('invalid credentials') ||
        errorMessage.toLowerCase().contains('wrong password') ||
        errorMessage.toLowerCase().contains('incorrect')) {
      return 'Số điện thoại hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.';
    }
    if (errorMessage.toLowerCase().contains('user not found')) {
      return 'Không tìm thấy tài khoản với số điện thoại này. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.';
    }
    if (errorMessage.toLowerCase().contains('server error') ||
        errorMessage.toLowerCase().contains('internal error')) {
      return 'Lỗi máy chủ. Vui lòng thử lại sau.';
    }
    if (errorMessage.toLowerCase().contains('unauthorized') ||
        errorMessage.toLowerCase().contains('forbidden')) {
      return 'Tài khoản không có quyền truy cập. Vui lòng liên hệ quản trị viên.';
    }
    if (errorMessage.toLowerCase().contains('timeout')) {
      return 'Kết nối bị timeout. Vui lòng thử lại.';
    }

    // Return the original message if no specific mapping is found
    return errorMessage.isNotEmpty
        ? errorMessage
        : 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  /// Handle province selection
  Future<void> _onProvinceSelected(
    ProvinceSelectedEvent event,
    Emitter<AuthState> emit,
  ) async {
    Log.d('$_tag: Province selected: ${event.province}');

    // Get current form state
    final currentState = state;
    final newState = currentState.copyWith(
      selectedProvince: event.province,
      isFormValid: _validateForm(
        currentState.phoneNumber,
        currentState.password,
        event.province,
      ),
    );
    emit(newState);
  }

  /// Handle form field changes
  Future<void> _onFormFieldChanged(
    FormFieldChangedEvent event,
    Emitter<AuthState> emit,
  ) async {
    Log.d('$_tag: Form fields changed');

    final currentState = state;
    final newState = currentState.copyWith(
      phoneNumber: event.phoneNumber,
      password: event.password,
      isFormValid: _validateForm(
        event.phoneNumber,
        event.password,
        currentState.selectedProvince,
      ),
    );
    emit(newState);
  }

  /// Validate form fields
  bool _validateForm(String phoneNumber, String password, String? province) {
    return phoneNumber.trim().isNotEmpty && password.isNotEmpty;
    // Note: province is optional, so we don't validate it
  }

  /// Handle remember me checkbox changes
  Future<void> _onRememberMeChanged(
    RememberMeChangedEvent event,
    Emitter<AuthState> emit,
  ) async {
    Log.d('$_tag: Remember me changed: ${event.rememberMe}');

    final currentState = state;
    final newState = currentState.copyWith(rememberMe: event.rememberMe);
    emit(newState);
  }

  /// Handle language change
  Future<void> _onChangeLanguage(
    ChangeLanguageEvent event,
    Emitter<AuthState> emit,
  ) async {
    Log.d('$_tag: Language change requested');

    // Call auth coordinator to handle language change
    await _coordinator.changeLanguage(''); // This will be handled by the router
  }

  /// Handle show forgot password dialog
  Future<void> _onShowForgotPasswordDialog(
    ShowForgotPasswordDialogEvent event,
    Emitter<AuthState> emit,
  ) async {
    Log.d('$_tag: Show forgot password dialog requested');

    // Preserve current state and just set the dialog flag to true
    final currentState = state;
    emit(currentState.copyWith(showForgotPasswordDialog: true));

    // Reset the flag after a short delay to prevent multiple dialogs
    await Future.delayed(const Duration(milliseconds: 100));
    emit(currentState.copyWith(showForgotPasswordDialog: false));
  }
}
