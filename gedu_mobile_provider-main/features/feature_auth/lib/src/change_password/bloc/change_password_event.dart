import 'package:lib_base/lib_base.dart';

/// Base class for change password form events
abstract class ChangePasswordFormEvent extends BaseBlocEvent {
  const ChangePasswordFormEvent();
}

/// Event to submit change password form
class ChangePasswordFormSubmitted extends ChangePasswordFormEvent {
  final String currentPassword;
  final String newPassword;
  final String confirmPassword;
  final bool isFirstTimeLogin;

  const ChangePasswordFormSubmitted({
    required this.currentPassword,
    required this.newPassword,
    required this.confirmPassword,
    this.isFirstTimeLogin = false,
  });

  List<Object?> get props => [
    currentPassword,
    newPassword,
    confirmPassword,
    isFirstTimeLogin,
  ];
}

/// Event to validate form
class ChangePasswordFormChanged extends ChangePasswordFormEvent {
  final String currentPassword;
  final String newPassword;
  final String confirmPassword;
  final bool isFirstTimeLogin;

  const ChangePasswordFormChanged({
    required this.currentPassword,
    required this.newPassword,
    required this.confirmPassword,
    this.isFirstTimeLogin = false,
  });

  List<Object?> get props => [
    currentPassword,
    newPassword,
    confirmPassword,
    isFirstTimeLogin,
  ];
}

/// Event to reset change password state
class ChangePasswordReset extends ChangePasswordFormEvent {
  const ChangePasswordReset();

  List<Object?> get props => [];
}
