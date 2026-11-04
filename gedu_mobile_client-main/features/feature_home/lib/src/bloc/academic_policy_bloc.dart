import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';

part 'academic_policy_event.dart';
part 'academic_policy_state.dart';

@injectable
class AcademicPolicyBloc
    extends BaseBloc<AcademicPolicyEvent, AcademicPolicyState> {
  final GetStudentByIdUseCase _getStudentByIdUseCase;

  AcademicPolicyBloc(this._getStudentByIdUseCase)
    : super(AcademicPolicyInitial()) {
    on<LoadAcademicPolicyDataEvent>(_onLoadAcademicPolicyData);
  }

  Future<void> _onLoadAcademicPolicyData(
    LoadAcademicPolicyDataEvent event,
    Emitter<AcademicPolicyState> emit,
  ) async {
    await runBlocCatching(
      action: () async {
        emit(AcademicPolicyLoading());

        final result = await _getStudentByIdUseCase.execute(
          GetStudentByIdInput(refId: event.refId, studentId: event.studentId),
        );

        emit(AcademicPolicySuccess(result.student));
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        emit(AcademicPolicyError(e.toString()));
        return;
      },
    );
  }
}
