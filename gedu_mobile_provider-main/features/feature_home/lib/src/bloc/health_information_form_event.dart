part of 'health_information_form_bloc.dart';

abstract class HealthInformationFormEvent extends BaseBlocEvent {
  const HealthInformationFormEvent();
}

class SubmitHealthInformationFormEvent extends HealthInformationFormEvent {
  final String refId;
  final int studentId;
  final List<StudentMedicalInfoRequest> medicalList;

  const SubmitHealthInformationFormEvent({
    required this.refId,
    required this.studentId,
    required this.medicalList,
  });

  @override
  List<Object> get props => [refId, studentId, medicalList];
}

class ResetHealthInformationFormEvent extends HealthInformationFormEvent {
  const ResetHealthInformationFormEvent();

  @override
  List<Object> get props => [];
}
