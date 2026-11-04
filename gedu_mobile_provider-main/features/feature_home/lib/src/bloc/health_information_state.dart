part of 'health_information_bloc.dart';

abstract class HealthInformationState extends BaseBlocState {
  const HealthInformationState();
}

class HealthInformationInitial extends HealthInformationState {}

class HealthInformationLoading extends HealthInformationState {}

class HealthInformationSuccess extends HealthInformationState {
  final StudentModel student;

  const HealthInformationSuccess(this.student);

  @override
  List<Object> get props => [student];
}

class HealthInformationError extends HealthInformationState {
  final String message;

  const HealthInformationError(this.message);

  @override
  List<Object> get props => [message];
}
