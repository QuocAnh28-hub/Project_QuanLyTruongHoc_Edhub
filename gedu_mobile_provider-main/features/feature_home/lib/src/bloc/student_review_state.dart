import 'package:core_students/core_students.dart';
import 'package:lib_base/lib_base.dart';

/// Base class for student review states
abstract class StudentReviewState extends BaseBlocState {
  const StudentReviewState();
}

/// Initial state
class StudentReviewInitial extends StudentReviewState {
  const StudentReviewInitial();
}

/// Loading state
class StudentReviewLoading extends StudentReviewState {
  const StudentReviewLoading();
}

/// Loaded state with students data
class StudentReviewLoaded extends StudentReviewState {
  final List<StudentModel> students;
  final StudentModel? selectedStudent;

  const StudentReviewLoaded({
    required this.students,
    this.selectedStudent,
  });

  @override
  List<Object?> get props => [students, selectedStudent];

  /// Create a copy with updated selected student
  StudentReviewLoaded copyWith({
    List<StudentModel>? students,
    StudentModel? selectedStudent,
  }) {
    return StudentReviewLoaded(
      students: students ?? this.students,
      selectedStudent: selectedStudent ?? this.selectedStudent,
    );
  }
}

/// Error state
class StudentReviewError extends StudentReviewState {
  final String message;

  const StudentReviewError({required this.message});

  @override
  List<Object?> get props => [message];
}

/// Confirmed state - user has confirmed the review
class StudentReviewConfirmed extends StudentReviewState {
  const StudentReviewConfirmed();
} 