import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';

part 'student_profile_event.dart';
part 'student_profile_state.dart';

@injectable
class StudentProfileBloc
    extends BaseBloc<StudentProfileEvent, StudentProfileState> {
  final GetStudentByIdUseCase _getStudentByIdUseCase;

  StudentProfileBloc(this._getStudentByIdUseCase)
    : super(StudentProfileInitial()) {
    on<LoadStudentProfileEvent>(_onLoadStudentProfile);
  }

  Future<void> _onLoadStudentProfile(
    LoadStudentProfileEvent event,
    Emitter<StudentProfileState> emit,
  ) async {
    await runBlocCatching(
      action: () async {
        emit(StudentProfileLoading());

        final result = await _getStudentByIdUseCase.execute(
          GetStudentByIdInput(refId: event.refId, studentId: event.studentId),
        );

        emit(StudentProfileSuccess(result.student));
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        emit(StudentProfileError(e.toString()));
        return;
      },
    );
  }
}
