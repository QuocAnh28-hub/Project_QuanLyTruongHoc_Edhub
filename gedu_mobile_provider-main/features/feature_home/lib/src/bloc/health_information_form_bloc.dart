import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';

part 'health_information_form_event.dart';
part 'health_information_form_state.dart';

@injectable
class HealthInformationFormBloc
    extends BaseBloc<HealthInformationFormEvent, HealthInformationFormState> {
  final UpdateStudentMedicalInfoUseCase _updateStudentMedicalInfoUseCase;

  HealthInformationFormBloc(this._updateStudentMedicalInfoUseCase)
    : super(HealthInformationFormInitial()) {
    on<SubmitHealthInformationFormEvent>(_onSubmitHealthInformationForm);
    on<ResetHealthInformationFormEvent>(_onResetHealthInformationForm);
  }

  Future<void> _onSubmitHealthInformationForm(
    SubmitHealthInformationFormEvent event,
    Emitter<HealthInformationFormState> emit,
  ) async {
    await runBlocCatching(
      action: () async {
        emit(HealthInformationFormSubmitting());

        final result = await _updateStudentMedicalInfoUseCase.execute(
          UpdateStudentMedicalInfoInput(
            refId: event.refId,
            studentId: event.studentId,
            medicalList: event.medicalList,
          ),
        );

        emit(HealthInformationFormSuccess(result.medicalInfoList));
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        emit(HealthInformationFormError(e.toString()));
        return;
      },
    );
  }

  void _onResetHealthInformationForm(
    ResetHealthInformationFormEvent event,
    Emitter<HealthInformationFormState> emit,
  ) {
    emit(HealthInformationFormInitial());
  }
}
