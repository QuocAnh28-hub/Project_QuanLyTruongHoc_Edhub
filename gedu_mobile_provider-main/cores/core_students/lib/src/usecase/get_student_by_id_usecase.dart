import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../model/student_model.dart';
import '../repository/student_repository.dart';

/// Input for get student by ID use case
class GetStudentByIdInput extends BaseInput {
  final String refId;
  final int studentId;

  const GetStudentByIdInput({required this.refId, required this.studentId});
}

/// Output for get student by ID use case
class GetStudentByIdOutput extends BaseOutput {
  final StudentModel student;

  const GetStudentByIdOutput({required this.student});
}

/// Use case for getting a single student by ID following base use case pattern
@injectable
class GetStudentByIdUseCase
    extends BaseFutureUseCase<GetStudentByIdInput, GetStudentByIdOutput> {
  final StudentRepository _studentRepository;

  const GetStudentByIdUseCase(this._studentRepository);

  @override
  Future<GetStudentByIdOutput> buildUseCase(GetStudentByIdInput input) async {
    // Validate input
    if (input.refId.isEmpty) {
      throw const AppLogicException(message: 'Reference ID is required');
    }

    // Call repository
    final student = await _studentRepository.getStudentById(
      input.refId,
      input.studentId.toString(),
    );

    return GetStudentByIdOutput(student: student);
  }
}
