part of 'student_profile_bloc.dart';

abstract class StudentProfileEvent extends BaseBlocEvent {
  const StudentProfileEvent();
}

class LoadStudentProfileEvent extends StudentProfileEvent {
  final String refId;
  final int studentId;

  const LoadStudentProfileEvent({required this.refId, required this.studentId});

  @override
  List<Object> get props => [refId, studentId];
}
