import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../repository/auth_repository.dart';

/// Input for login use case
class LoginInput extends BaseInput {
  final String email;
  final String password;

  const LoginInput({required this.email, required this.password});
}

/// Output for login use case
class LoginOutput extends BaseOutput {
  final String accessToken;
  final String firstName;
  final String lastName;
  final String email;
  final int orgId;
  final int? refId;

  const LoginOutput({
    required this.accessToken,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.orgId,
    this.refId,
  });
}

/// Use case for login operations following base use case pattern
@injectable
class LoginUseCase extends BaseFutureUseCase<LoginInput, LoginOutput> {
  final AuthRepository _authRepository;

  const LoginUseCase(this._authRepository);

  @override
  Future<LoginOutput> buildUseCase(LoginInput input) async {
    // Validate input
    if (input.email.isEmpty || input.password.isEmpty) {
      throw const AppLogicException(message: 'Email and password are required');
    }

    // Call repository - now returns LoginResult directly
    final loginResult = await _authRepository.login(
      input.email,
      input.password,
    );

    return LoginOutput(
      accessToken: loginResult.accessToken,
      firstName: loginResult.user.firstName,
      lastName: loginResult.user.lastName,
      email: loginResult.user.email,
      orgId: loginResult.user.orgId,
      refId: loginResult.user.refId,
    );
  }
}
