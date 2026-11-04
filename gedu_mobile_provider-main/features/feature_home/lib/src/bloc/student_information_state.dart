part of 'student_information_bloc.dart';

abstract class StudentInformationState extends BaseBlocState {
  const StudentInformationState();
}

class StudentInformationInitial extends StudentInformationState {}

class StudentInformationLoading extends StudentInformationState {}

class StudentInformationSuccess extends StudentInformationState {
  final StudentModel student;
  final List<ReligionModel> religions;

  const StudentInformationSuccess(this.student, {this.religions = const []});

  @override
  List<Object> get props => [student, religions];
}

class StudentInformationError extends StudentInformationState {
  final String message;

  const StudentInformationError(this.message);

  @override
  List<Object> get props => [message];
}
