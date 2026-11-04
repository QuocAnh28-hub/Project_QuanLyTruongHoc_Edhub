import 'package:core_students/core_students.dart';
import 'package:lib_base/lib_base.dart';

/// Base class for student review events
abstract class StudentReviewEvent extends BaseBlocEvent {
  const StudentReviewEvent();
}

/// Event to load student review data
class LoadStudentReviewEvent extends StudentReviewEvent {
  const LoadStudentReviewEvent();

  @override
  List<Object?> get props => [];
}

/// Event to select a student
class SelectStudentEvent extends StudentReviewEvent {
  final StudentModel student;

  const SelectStudentEvent({required this.student});

  @override
  List<Object?> get props => [student];
}

/// Event to confirm student review
class ConfirmStudentReviewEvent extends StudentReviewEvent {
  const ConfirmStudentReviewEvent();

  @override
  List<Object?> get props => [];
} 