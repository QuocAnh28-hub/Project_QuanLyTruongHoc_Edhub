import 'package:lib_base/lib_base.dart';

/// Base class for change password form states
abstract class ChangePasswordFormState extends BaseBlocState {
  const ChangePasswordFormState();
}

/// Initial change password state
class ChangePasswordFormInitial extends ChangePasswordFormState {
  const ChangePasswordFormInitial();

  List<Object?> get props => [];
}

/// Loading change password state
class ChangePasswordFormLoading extends ChangePasswordFormState {
  const ChangePasswordFormLoading();

  List<Object?> get props => [];
}

/// Success change password state
class ChangePasswordFormSuccess extends ChangePasswordFormState {
  const ChangePasswordFormSuccess();

  List<Object?> get props => [];
}

/// Success change password - navigate to success page state
class ChangePasswordFormSuccessNavigateToSuccessPage
    extends ChangePasswordFormState {
  const ChangePasswordFormSuccessNavigateToSuccessPage();

  List<Object?> get props => [];
}

/// Error change password state
class ChangePasswordFormError extends ChangePasswordFormState {
  final String message;

  const ChangePasswordFormError(this.message);

  List<Object?> get props => [message];
}

/// Validation error change password state
class ChangePasswordFormValidationError extends ChangePasswordFormState {
  final String? currentPasswordError;
  final String? newPasswordError;
  final String? confirmPasswordError;

  const ChangePasswordFormValidationError({
    this.currentPasswordError,
    this.newPasswordError,
    this.confirmPasswordError,
  });

  List<Object?> get props => [
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
  ];
}
