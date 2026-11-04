import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../repository/auth_repository.dart';

/// Input for change password use case
class ChangePasswordInput extends BaseInput {
  final String oldPassword;
  final String newPassword;

  const ChangePasswordInput({
    required this.oldPassword,
    required this.newPassword,
  });
}

/// Output for change password use case
class ChangePasswordOutput extends BaseOutput {
  final bool success;
  final String? message;

  const ChangePasswordOutput({required this.success, this.message});
}

/// Use case for changing user password
@injectable
class ChangePasswordUseCase
    extends BaseFutureUseCase<ChangePasswordInput, ChangePasswordOutput> {
  final AuthRepository _authRepository;

  ChangePasswordUseCase(this._authRepository);

  @override
  Future<ChangePasswordOutput> buildUseCase(ChangePasswordInput input) async {
    try {
      final success = await _authRepository.changePassword(
        input.oldPassword,
        input.newPassword,
      );

      return ChangePasswordOutput(
        success: success,
        message: success
            ? 'Password changed successfully'
            : 'Failed to change password',
      );
    } catch (e) {
      Log.e('ChangePasswordUseCase: Error changing password: $e');

      // Extract user-friendly error message from exception
      String errorMessage = 'Failed to change password';

      if (e.toString().contains('Mật khẩu phải có ít nhất 8 ký tự')) {
        errorMessage =
            'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái in hoa, một chữ số và một ký tự đặc biệt.';
      } else if (e.toString().contains('RemoteException')) {
        // Extract message from RemoteException
        if (e.toString().contains('generalServerMessage:')) {
          final startIndex =
              e.toString().indexOf('generalServerMessage:') +
              'generalServerMessage:'.length;
          final endIndex = e.toString().indexOf(',', startIndex);
          if (endIndex > startIndex) {
            errorMessage = e.toString().substring(startIndex, endIndex).trim();
          }
        }
      }

      return ChangePasswordOutput(success: false, message: errorMessage);
    }
  }
}
