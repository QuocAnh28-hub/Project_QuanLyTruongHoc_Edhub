import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';
import 'package:core_storage/core_storage.dart';
import '../router/home_router.dart';

import 'student_review_event.dart';
import 'student_review_state.dart';

/// BLoC for handling student review logic
/// This bloc manages the student selection and review process
@injectable
class StudentReviewBloc
    extends BaseBloc<StudentReviewEvent, StudentReviewState> {
  static const String _tag = 'StudentReviewBloc';

  final GetStudentsUseCase _getStudentsUseCase;
  final AppPreferences _appPreferences;
  BuildContext? _context;

  StudentReviewBloc(this._getStudentsUseCase, this._appPreferences)
    : super(const StudentReviewInitial()) {
    on<LoadStudentReviewEvent>(_onLoadStudentReview);
    on<SelectStudentEvent>(_onSelectStudent);
    on<ConfirmStudentReviewEvent>(_onConfirmStudentReview);
  }

  /// Set the context for loading overlay
  void setContext(BuildContext context) {
    _context = context;
  }

  Future<void> _onLoadStudentReview(
    LoadStudentReviewEvent event,
    Emitter<StudentReviewState> emit,
  ) async {
    Log.d('$_tag: Starting student review loading process');

    // Show loading overlay
    _showLoading();

    // Emit loading state
    emit(const StudentReviewLoading());

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: Loading student review data');

        final refId = AuthStorage.getRefId();
        final userId = AuthStorage.getUserId();

        Log.d('$_tag: 📊 User data retrieved:');
        Log.d('$_tag:   - RefId: $refId');
        Log.d('$_tag:   - UserId: $userId');

        if (refId == null && userId == null) {
          throw AppLogicException(
            message: 'Không tìm thấy thông tin người dùng',
          );
        }

        final input = GetStudentsInput(refId: (refId ?? userId).toString());
        final output = await _getStudentsUseCase.execute(input);

        Log.d(
          '$_tag: ✅ Successfully loaded ${output.students.length} students',
        );

        // Auto-select the first student if only one student
        StudentModel? selectedStudent;
        if (output.students.length == 1) {
          selectedStudent = output.students.first;
          Log.d(
            '$_tag: Auto-selected single student: ${selectedStudent.displayName}',
          );
        }

        // Emit success state
        emit(
          StudentReviewLoaded(
            students: output.students,
            selectedStudent: selectedStudent,
          ),
        );
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        Log.e('$_tag: Student review loading error caught: ${e.toString()}');
        emit(StudentReviewError(message: e.toString()));
        return;
      },
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );

    Log.d('$_tag: Student review loading process completed');
  }

  void _onSelectStudent(
    SelectStudentEvent event,
    Emitter<StudentReviewState> emit,
  ) {
    try {
      Log.d('$_tag: Selecting student: ${event.student.displayName}');

      final currentState = state;
      if (currentState is StudentReviewLoaded) {
        emit(currentState.copyWith(selectedStudent: event.student));
        Log.d('$_tag: ✅ Student selected successfully');
      }
    } catch (e) {
      Log.e('$_tag: ❌ Failed to select student: $e');
    }
  }

  Future<void> _onConfirmStudentReview(
    ConfirmStudentReviewEvent event,
    Emitter<StudentReviewState> emit,
  ) async {
    Log.d('$_tag: Starting student review confirmation process');

    // Show loading overlay
    _showLoading();

    await runBlocCatching(
      action: () async {
        Log.d('$_tag: Confirming student review');

        final currentState = state;
        if (currentState is StudentReviewLoaded &&
            currentState.selectedStudent != null) {
          // Save that the user has confirmed the review
          await _appPreferences.saveStudentReviewConfirmed(true);

          // Save the selected student information
          final selectedStudent = currentState.selectedStudent!;
          await _appPreferences.saveSelectedStudent({
            'id': selectedStudent.id, // Using code as ID
            'firstName': selectedStudent.firstName,
            'lastName': selectedStudent.lastName,
            'name':
                selectedStudent.displayName, // Keep for backward compatibility
            'status': selectedStudent.status,
            'gender': selectedStudent.sex,
            'code': selectedStudent.code,
          });

          Log.d('$_tag: ✅ Student review confirmed and saved');
          Log.d('$_tag: 📝 Selected student: ${selectedStudent.displayName}');

          // Navigate to dashboard after successful confirmation
          if (_context != null) {
            Log.d('$_tag: Navigating to dashboard');
            HomeRouter.navigateToDashboard(_context!);
          }
        } else {
          throw AppLogicException(
            message: 'Vui lòng chọn học sinh để tiếp tục',
          );
        }
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        Log.e(
          '$_tag: Student review confirmation error caught: ${e.toString()}',
        );
        emit(StudentReviewError(message: e.toString()));
        return;
      },
      doOnSuccessOrError: () async {
        // Hide loading overlay
        _hideLoading();
        return;
      },
    );

    Log.d('$_tag: Student review confirmation process completed');
  }

  /// Show loading overlay with Lottie animation
  void _showLoading() {
    if (_context != null) {
      LoadingService().showLottieLoading(
        context: _context!,
        animationPath:
            'packages/lib_design_system/assets/animation/loading_animation.json',
        message: 'Đang tải thông tin học sinh...',
      );
    }
  }

  /// Hide loading overlay
  void _hideLoading() {
    LoadingService().hideLoading();
  }
}
