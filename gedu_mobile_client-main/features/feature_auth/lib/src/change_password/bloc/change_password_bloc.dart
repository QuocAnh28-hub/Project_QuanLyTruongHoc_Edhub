import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_auth/core_auth.dart' as core_auth;
import 'package:core_storage/core_storage.dart';
import 'package:core_localization/core_localization.dart';

import 'change_password_event.dart';
import 'change_password_state.dart';

/// Change password bloc for handling password change logic
@injectable
class ChangePasswordBloc
    extends BaseBloc<ChangePasswordFormEvent, ChangePasswordFormState> {
  static const String _tag = 'ChangePasswordBloc';

  final core_auth.ChangePasswordUseCase _changePasswordUseCase;
  final AppPreferences _appPreferences;
  BuildContext? _context;

  ChangePasswordBloc(this._changePasswordUseCase, this._appPreferences)
    : super(const ChangePasswordFormInitial()) {
    on<ChangePasswordFormSubmitted>(_onChangePasswordSubmitted);
    on<ChangePasswordFormChanged>(_onChangePasswordFormChanged);
    on<ChangePasswordReset>(_onChangePasswordReset);
  }

  /// Set the context for loading overlay
  void setContext(BuildContext context) {
    _context = context;
  }

  /// Show loading overlay
  void _showLoading() {
    if (_context != null) {
      final l10n = AppLocalizations.of(_context!);
      LoadingService().showLottieLoading(
        context: _context!,
        animationPath:
            'packages/lib_design_system/assets/animation/loading_animation.json',
        message: l10n?.changePasswordLoadingMessage ?? 'Updating password...',
      );
    }
  }

  /// Hide loading overlay
  void _hideLoading() {
    LoadingService().hideLoading();
  }

  /// Handle change password form submission
  Future<void> _onChangePasswordSubmitted(
    ChangePasswordFormSubmitted event,
    Emitter<ChangePasswordFormState> emit,
  ) async {
    Log.d('$_tag: Starting change password process');

    // Validate form first
    final validationResult = _validateForm(
      event.currentPassword,
      event.newPassword,
      event.confirmPassword,
      event.isFirstTimeLogin,
    );

    if (validationResult != null) {
      emit(validationResult);
      return;
    }

    // Show loading overlay
    _showLoading();

    // Emit loading state
    emit(const ChangePasswordFormLoading());

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: 🔐 Attempting to change password');

        // Call the change password use case
        final result = await _changePasswordUseCase.execute(
          core_auth.ChangePasswordInput(
            oldPassword: event.currentPassword,
            newPassword: event.newPassword,
          ),
        );

        if (result.success) {
          // Update stored password
          await _appPreferences.saveUserPassword(event.newPassword);

          // Mark password as changed
          await _appPreferences.savePasswordChanged(true);

          Log.d('$_tag: ✅ Password updated in storage and marked as changed');
          emit(const ChangePasswordFormSuccessNavigateToSuccessPage());
        } else {
          Log.e('$_tag: ❌ Password change failed: ${result.message}');
          emit(
            ChangePasswordFormError(
              result.message ?? 'Failed to change password',
            ),
          );
        }
      },
      handleLoading:
          false, // Disable automatic loading since we handle it manually
      handleError:
          false, // Disable automatic error handling since we handle it manually
      doOnError: (AppException e) async {
        Log.e('$_tag: Change password error caught: ${e.toString()}');
        final errorMessage = _formatServerErrorMessage(e);
        emit(ChangePasswordFormError(errorMessage));
        return;
      },
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );

    Log.d('$_tag: Change password process completed');
  }

  /// Handle form changes for validation
  Future<void> _onChangePasswordFormChanged(
    ChangePasswordFormChanged event,
    Emitter<ChangePasswordFormState> emit,
  ) async {
    Log.d('$_tag: Form changed, validating...');

    final validationResult = _validateForm(
      event.currentPassword,
      event.newPassword,
      event.confirmPassword,
      event.isFirstTimeLogin,
    );

    if (validationResult != null) {
      emit(validationResult);
    } else {
      emit(const ChangePasswordFormInitial());
    }
  }

  /// Handle reset state
  Future<void> _onChangePasswordReset(
    ChangePasswordReset event,
    Emitter<ChangePasswordFormState> emit,
  ) async {
    Log.d('$_tag: Resetting change password state');
    emit(const ChangePasswordFormInitial());
  }

  /// Validate form inputs
  ChangePasswordFormValidationError? _validateForm(
    String currentPassword,
    String newPassword,
    String confirmPassword,
    bool isFirstTimeLogin,
  ) {
    String? currentPasswordError;
    String? newPasswordError;
    String? confirmPasswordError;

    // Validate current password (only for non-first-time login)
    if (!isFirstTimeLogin) {
      if (currentPassword.isEmpty) {
        currentPasswordError = 'Vui lòng nhập mật khẩu hiện tại';
      }
    }

    // Validate new password
    if (newPassword.isEmpty) {
      newPasswordError = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 8) {
      newPasswordError = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!_isValidPassword(newPassword)) {
      newPasswordError =
          'Mật khẩu phải có ít nhất một chữ cái in hoa, một chữ số và một ký tự đặc biệt';
    }

    // Validate confirm password
    if (confirmPassword.isEmpty) {
      confirmPasswordError = 'Vui lòng xác nhận mật khẩu mới';
    } else if (confirmPassword != newPassword) {
      confirmPasswordError = 'Mật khẩu xác nhận không khớp';
    }

    // Return validation error if any field has an error
    if (currentPasswordError != null ||
        newPasswordError != null ||
        confirmPasswordError != null) {
      return ChangePasswordFormValidationError(
        currentPasswordError: currentPasswordError,
        newPasswordError: newPasswordError,
        confirmPasswordError: confirmPasswordError,
      );
    }

    return null;
  }

  /// Validate password strength
  bool _isValidPassword(String password) {
    // Check for at least 8 characters
    if (password.length < 8) return false;

    // Check for at least one uppercase letter
    if (!password.contains(RegExp(r'[A-Z]'))) return false;

    // Check for at least one digit
    if (!password.contains(RegExp(r'[0-9]'))) return false;

    // Check for at least one special character
    if (!password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) return false;

    return true;
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
    if (errorMessage.toLowerCase().contains('old password') ||
        errorMessage.toLowerCase().contains('current password') ||
        errorMessage.toLowerCase().contains('incorrect password')) {
      return 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.';
    }
    if (errorMessage.toLowerCase().contains('new password') ||
        errorMessage.toLowerCase().contains('password requirements')) {
      return 'Mật khẩu mới không đáp ứng yêu cầu. Vui lòng thử lại.';
    }
    if (errorMessage.toLowerCase().contains('server error') ||
        errorMessage.toLowerCase().contains('internal error')) {
      return 'Lỗi máy chủ. Vui lòng thử lại sau.';
    }
    if (errorMessage.toLowerCase().contains('unauthorized') ||
        errorMessage.toLowerCase().contains('forbidden')) {
      return 'Tài khoản không có quyền thay đổi mật khẩu. Vui lòng liên hệ quản trị viên.';
    }
    if (errorMessage.toLowerCase().contains('timeout')) {
      return 'Kết nối bị timeout. Vui lòng thử lại.';
    }

    // Return the original message if no specific mapping is found
    return errorMessage.isNotEmpty
        ? errorMessage
        : 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
}
