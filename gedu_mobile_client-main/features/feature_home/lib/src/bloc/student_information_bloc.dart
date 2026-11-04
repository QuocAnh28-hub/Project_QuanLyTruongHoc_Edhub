import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';

part 'student_information_event.dart';
part 'student_information_state.dart';

@injectable
class StudentInformationBloc
    extends BaseBloc<StudentInformationEvent, StudentInformationState> {
  final GetStudentByIdUseCase _getStudentByIdUseCase;
  final GetReligionsUseCase _getReligionsUseCase;
  final ConfirmStudentContactInfoUseCase _confirmStudentContactInfoUseCase;

  StudentInformationBloc(
    this._getStudentByIdUseCase,
    this._getReligionsUseCase,
    this._confirmStudentContactInfoUseCase,
  ) : super(StudentInformationInitial()) {
    on<LoadStudentInformationDataEvent>(_onLoadStudentInformationData);
    on<ConfirmStudentInformationEvent>(_onConfirmStudentInformation);
  }

  Future<void> _onLoadStudentInformationData(
    LoadStudentInformationDataEvent event,
    Emitter<StudentInformationState> emit,
  ) async {
    await runBlocCatching(
      action: () async {
        emit(StudentInformationLoading());

        final result = await _getStudentByIdUseCase.execute(
          GetStudentByIdInput(refId: event.refId, studentId: event.studentId),
        );

        // Load religions after getting student data
        final religionsResult = await _getReligionsUseCase.execute(
          const GetReligionsInput(),
        );

        emit(
          StudentInformationSuccess(
            result.student,
            religions: religionsResult.religions,
          ),
        );
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        emit(StudentInformationError(e.toString()));
        return;
      },
    );
  }

  Future<void> _onConfirmStudentInformation(
    ConfirmStudentInformationEvent event,
    Emitter<StudentInformationState> emit,
  ) async {
    await runBlocCatching(
      action: () async {
        try {
          // Call the confirmation use case - it will throw an exception if it fails
          await _confirmStudentContactInfoUseCase.execute(
            ConfirmStudentContactInfoInput(
              refId: event.refId,
              studentId: event.studentId,
            ),
          );

          // If we reach here, confirmation was successful
          // Reload student data to get updated confirmation status
          final result = await _getStudentByIdUseCase.execute(
            GetStudentByIdInput(refId: event.refId, studentId: event.studentId),
          );

          // Load religions after getting student data
          final religionsResult = await _getReligionsUseCase.execute(
            const GetReligionsInput(),
          );

          emit(
            StudentInformationSuccess(
              result.student,
              religions: religionsResult.religions,
            ),
          );
        } catch (e) {
          // Check if the error is "already confirmed"
          if (e.toString().contains(
            'Thông tin của học sinh đã được xác nhận',
          )) {
            // Student is already confirmed, just reload the data
            final result = await _getStudentByIdUseCase.execute(
              GetStudentByIdInput(
                refId: event.refId,
                studentId: event.studentId,
              ),
            );

            final religionsResult = await _getReligionsUseCase.execute(
              const GetReligionsInput(),
            );

            emit(
              StudentInformationSuccess(
                result.student,
                religions: religionsResult.religions,
              ),
            );
          } else {
            // Re-throw other errors
            rethrow;
          }
        }
      },
      handleLoading: false,
      handleError: false,
      doOnError: (AppException e) async {
        emit(StudentInformationError(e.toString()));
        return;
      },
    );
  }
}
