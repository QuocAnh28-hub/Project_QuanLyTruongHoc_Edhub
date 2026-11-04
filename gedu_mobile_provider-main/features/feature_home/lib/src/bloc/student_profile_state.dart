part of 'student_profile_bloc.dart';

abstract class StudentProfileState extends BaseBlocState {
  const StudentProfileState();
}

class StudentProfileInitial extends StudentProfileState {}

class StudentProfileLoading extends StudentProfileState {}

class StudentProfileSuccess extends StudentProfileState {
  final StudentModel student;

  const StudentProfileSuccess(this.student);

  @override
  List<Object> get props => [student];
}

class StudentProfileError extends StudentProfileState {
  final String message;

  const StudentProfileError(this.message);

  @override
  List<Object> get props => [message];
}
