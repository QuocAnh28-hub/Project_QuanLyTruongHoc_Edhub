part of 'academic_policy_bloc.dart';

abstract class AcademicPolicyState extends BaseBlocState {
  const AcademicPolicyState();
}

class AcademicPolicyInitial extends AcademicPolicyState {}

class AcademicPolicyLoading extends AcademicPolicyState {}

class AcademicPolicySuccess extends AcademicPolicyState {
  final StudentModel student;

  const AcademicPolicySuccess(this.student);

  @override
  List<Object> get props => [student];
}

class AcademicPolicyError extends AcademicPolicyState {
  final String message;

  const AcademicPolicyError(this.message);

  @override
  List<Object> get props => [message];
}
