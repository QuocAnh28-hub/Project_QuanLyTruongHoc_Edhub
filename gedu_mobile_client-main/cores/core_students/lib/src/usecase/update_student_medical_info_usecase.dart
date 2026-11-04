import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../repository/student_repository.dart';
import 'update_student_medical_info_usecase_input.dart';
import 'update_student_medical_info_usecase_output.dart';

/// Use case for updating student medical info following base use case pattern
@injectable
class UpdateStudentMedicalInfoUseCase
    extends
        BaseFutureUseCase<
          UpdateStudentMedicalInfoInput,
          UpdateStudentMedicalInfoOutput
        > {
  final StudentRepository _studentRepository;

  const UpdateStudentMedicalInfoUseCase(this._studentRepository);

  @override
  Future<UpdateStudentMedicalInfoOutput> buildUseCase(
    UpdateStudentMedicalInfoInput input,
  ) async {
    // Validate input
    if (input.refId.isEmpty) {
      throw const AppLogicException(message: 'Reference ID is required');
    }

    if (input.studentId <= 0) {
      throw const AppLogicException(message: 'Valid student ID is required');
    }

    if (input.medicalList.isEmpty) {
      throw const AppLogicException(
        message: 'Medical info list cannot be empty',
      );
    }

    // Convert input to repository format
    final medicalListData = input.medicalList
        .map((item) => item.toJson())
        .toList();

    // Call repository
    final result = await _studentRepository.updateStudentMedicalInfo(
      input.refId,
      input.studentId,
      medicalListData,
    );

    return UpdateStudentMedicalInfoOutput(medicalInfoList: result);
  }
}
