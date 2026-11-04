part of 'health_information_form_bloc.dart';

abstract class HealthInformationFormState extends BaseBlocState {
  const HealthInformationFormState();
}

class HealthInformationFormInitial extends HealthInformationFormState {}

class HealthInformationFormSubmitting extends HealthInformationFormState {}

class HealthInformationFormSuccess extends HealthInformationFormState {
  final List<StudentMedicalInfoResponse> medicalInfoList;

  const HealthInformationFormSuccess(this.medicalInfoList);

  @override
  List<Object> get props => [medicalInfoList];
}

class HealthInformationFormError extends HealthInformationFormState {
  final String message;

  const HealthInformationFormError(this.message);

  @override
  List<Object> get props => [message];
}
