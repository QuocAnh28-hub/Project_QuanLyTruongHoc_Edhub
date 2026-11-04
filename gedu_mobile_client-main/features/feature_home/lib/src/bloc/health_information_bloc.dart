import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';

part 'health_information_event.dart';
part 'health_information_state.dart';

@injectable
class HealthInformationBloc
    extends BaseBloc<HealthInformationEvent, HealthInformationState> {
  final GetStudentByIdUseCase _getStudentByIdUseCase;

  HealthInformationBloc(this._getStudentByIdUseCase)
    : super(HealthInformationInitial()) {
    on<LoadHealthInformationDataEvent>(_onLoadHealthInformationData);
  }

  Future<void> _onLoadHealthInformationData(
    LoadHealthInformationDataEvent event,
    Emitter<HealthInformationState> emit,
  ) async {
    await runBlocCatching(
      action: () async {
        emit(HealthInformationLoading());

        final result = await _getStudentByIdUseCase.execute(
          GetStudentByIdInput(refId: event.refId, studentId: event.studentId),
        );

        emit(HealthInformationSuccess(result.student));
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        emit(HealthInformationError(e.toString()));
        return;
      },
    );
  }
}
