import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../repository/student_repository.dart';

/// Input for confirm student contact info use case
class ConfirmStudentContactInfoInput extends BaseInput {
  final String refId;
  final int studentId;

  const ConfirmStudentContactInfoInput({
    required this.refId,
    required this.studentId,
  });
}

/// Output for confirm student contact info use case
class ConfirmStudentContactInfoOutput extends BaseOutput {
  const ConfirmStudentContactInfoOutput();
}

/// Use case for confirming student contact info following base use case pattern
@injectable
class ConfirmStudentContactInfoUseCase
    extends
        BaseFutureUseCase<
          ConfirmStudentContactInfoInput,
          ConfirmStudentContactInfoOutput
        > {
  final StudentRepository _studentRepository;

  const ConfirmStudentContactInfoUseCase(this._studentRepository);

  @override
  Future<ConfirmStudentContactInfoOutput> buildUseCase(
    ConfirmStudentContactInfoInput input,
  ) async {
    // Validate input
    if (input.refId.isEmpty) {
      throw const AppLogicException(message: 'Reference ID is required');
    }

    // Call repository
    await _studentRepository.confirmStudentContactInfo(
      input.refId,
      input.studentId,
    );

    return const ConfirmStudentContactInfoOutput();
  }
}
