part of 'student_information_bloc.dart';

abstract class StudentInformationEvent extends BaseBlocEvent {
  const StudentInformationEvent();
}

class LoadStudentInformationDataEvent extends StudentInformationEvent {
  final String refId;
  final int studentId;

  const LoadStudentInformationDataEvent({
    required this.refId,
    required this.studentId,
  });

  @override
  List<Object> get props => [refId, studentId];
}

class ConfirmStudentInformationEvent extends StudentInformationEvent {
  final String refId;
  final int studentId;

  const ConfirmStudentInformationEvent({
    required this.refId,
    required this.studentId,
  });

  @override
  List<Object> get props => [refId, studentId];
}
