import 'package:lib_base/lib_base.dart';

/// Base class for authentication events
abstract class AuthEvent extends BaseBlocEvent {
  const AuthEvent();
}

/// Event to login user
class LoginEvent extends AuthEvent {
  final String email;
  final String password;
  final String? province;
  final bool rememberMe;

  const LoginEvent({
    required this.email,
    required this.password,
    this.province,
    this.rememberMe = false,
  });

  List<Object?> get props => [email, password, province, rememberMe];
}

/// Event to save login credentials
class SaveLoginCredentialsEvent extends AuthEvent {
  final String phoneNumber;
  final String password;
  final String? province;

  const SaveLoginCredentialsEvent({
    required this.phoneNumber,
    required this.password,
    this.province,
  });

  List<Object?> get props => [phoneNumber, password, province];
}

/// Event to logout user
class LogoutEvent extends AuthEvent {
  const LogoutEvent();

  List<Object?> get props => [];
}

/// Event to check authentication status
class CheckAuthStatusEvent extends AuthEvent {
  const CheckAuthStatusEvent();

  List<Object?> get props => [];
}

/// Event to clear authentication data
class ClearAuthDataEvent extends AuthEvent {
  const ClearAuthDataEvent();

  List<Object?> get props => [];
}

/// Event to change password
class ChangePasswordEvent extends AuthEvent {
  final String currentPassword;
  final String newPassword;

  const ChangePasswordEvent({
    required this.currentPassword,
    required this.newPassword,
  });

  List<Object?> get props => [currentPassword, newPassword];
}

/// Event to select province
class ProvinceSelectedEvent extends AuthEvent {
  final String province;

  const ProvinceSelectedEvent({required this.province});

  List<Object?> get props => [province];
}

/// Event when form fields change
class FormFieldChangedEvent extends AuthEvent {
  final String phoneNumber;
  final String password;

  const FormFieldChangedEvent({
    required this.phoneNumber,
    required this.password,
  });

  List<Object?> get props => [phoneNumber, password];
}

/// Event when remember me checkbox changes
class RememberMeChangedEvent extends AuthEvent {
  final bool rememberMe;

  const RememberMeChangedEvent({required this.rememberMe});

  List<Object?> get props => [rememberMe];
}

/// Event to change language
class ChangeLanguageEvent extends AuthEvent {
  const ChangeLanguageEvent();

  List<Object?> get props => [];
}

/// Event to show forgot password dialog
class ShowForgotPasswordDialogEvent extends AuthEvent {
  const ShowForgotPasswordDialogEvent();

  List<Object?> get props => [];
}
