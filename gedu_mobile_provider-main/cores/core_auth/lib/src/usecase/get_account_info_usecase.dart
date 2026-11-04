import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../repository/auth_repository.dart';

/// Input for get account info use case
class GetAccountInfoInput extends BaseInput {
  const GetAccountInfoInput();
}

/// Output for get account info use case
class GetAccountInfoOutput extends BaseOutput {
  final String firstName;
  final String lastName;
  final String email;
  final int orgId;
  final int? refId;
  final String? phone;

  const GetAccountInfoOutput({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.orgId,
    this.refId,
    this.phone,
  });
}

/// Use case for getting account info following base use case pattern
@injectable
class GetAccountInfoUseCase
    extends BaseFutureUseCase<GetAccountInfoInput, GetAccountInfoOutput> {
  final AuthRepository _authRepository;

  const GetAccountInfoUseCase(this._authRepository);

  @override
  Future<GetAccountInfoOutput> buildUseCase(GetAccountInfoInput input) async {
    // Call repository
    final accountInfoResult = await _authRepository.getAccountInfo();

    return GetAccountInfoOutput(
      firstName: accountInfoResult.user.firstName,
      lastName: accountInfoResult.user.lastName,
      email: accountInfoResult.user.email,
      orgId: accountInfoResult.user.orgId,
      refId: accountInfoResult.user.refId,
      phone: accountInfoResult.user.phone,
    );
  }
}
