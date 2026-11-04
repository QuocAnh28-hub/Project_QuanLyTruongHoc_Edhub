import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../model/student_model.dart';
import '../repository/student_repository.dart';

/// Input for get students use case
class GetStudentsInput extends BaseInput {
  final String refId;

  const GetStudentsInput({required this.refId});
}

/// Output for get students use case
class GetStudentsOutput extends BaseOutput {
  final List<StudentModel> students;

  const GetStudentsOutput({required this.students});
}

/// Use case for getting students following base use case pattern
@injectable
class GetStudentsUseCase
    extends BaseFutureUseCase<GetStudentsInput, GetStudentsOutput> {
  final StudentRepository _studentRepository;

  const GetStudentsUseCase(this._studentRepository);

  @override
  Future<GetStudentsOutput> buildUseCase(GetStudentsInput input) async {
    // Validate input
    if (input.refId.isEmpty) {
      throw const AppLogicException(message: 'Reference ID is required');
    }

    // Call repository
    final students = await _studentRepository.getStudents(input.refId);

    return GetStudentsOutput(students: students);
  }
}
