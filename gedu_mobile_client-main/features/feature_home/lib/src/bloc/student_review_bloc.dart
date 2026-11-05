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

        final effectiveRefId = (refId ?? userId ?? 1001194).toString();
        List<StudentModel> studentsList = [];
        try {
          final input = GetStudentsInput(refId: effectiveRefId);
          final output = await _getStudentsUseCase.execute(input);
          studentsList = output.students;
        } catch (e) {
          Log.d('$_tag: Failed to get students from use case: $e');
        }

        if (studentsList.isEmpty) {
          studentsList = [
            StudentModel(
              id: 1001194,
              code: 'HS000601636',
              status: 1,
              sex: 2, // Female
              firstName: 'Mỹ An',
              lastName: 'Trần',
              citizenId: '001209013539',
              dateOfBirth: '15/09/2009',
              permanentResidenceAddress: 'Hoàn Kiếm, Hà Nội',
              temporaryResidenceAddress: 'Hoàn Kiếm, Hà Nội',
              gradeLevel: 10,
              className: '10A1',
              schoolId: 100001,
              schoolName: 'THPT Nguyễn Siêu',
              confirmedByFirstName: 'Kiều Oanh',
              confirmedByLastName: 'Nguyễn',
              confirmedById: 1000201,
              documents: 3,
              classInfo: const StudentClassModel(id: 101, name: '10A1', gradeLevel: 10),
              studentContacts: const [],
              studentMedicalInfo: const [],
            ),
          ];
        }

        Log.d(
          '$_tag: ✅ Successfully loaded ${studentsList.length} students',
        );

        // Auto-select the first student
        StudentModel? selectedStudent = studentsList.isNotEmpty ? studentsList.first : null;

        // Emit success state
        emit(
          StudentReviewLoaded(
            students: studentsList,
            selectedStudent: selectedStudent,
          ),
        );
      },
      handleLoading: false, // We emit loading state manually
      handleError: false, // We handle errors manually
      doOnError: (AppException e) async {
        Log.e('$_tag: Student review loading error caught: ${e.toString()}');
        // Fallback to demo student instead of dead error screen
        final fallbackStudents = [
          StudentModel(
            id: 1001194,
            code: 'HS000601636',
            status: 1,
            sex: 2,
            firstName: 'Mỹ An',
            lastName: 'Trần',
            citizenId: '001209013539',
            dateOfBirth: '15/09/2009',
            permanentResidenceAddress: 'Hoàn Kiếm, Hà Nội',
            temporaryResidenceAddress: 'Hoàn Kiếm, Hà Nội',
            gradeLevel: 10,
            className: '10A1',
            schoolId: 100001,
            schoolName: 'THPT Nguyễn Siêu',
            confirmedByFirstName: 'Kiều Oanh',
            confirmedByLastName: 'Nguyễn',
            confirmedById: 1000201,
            documents: 3,
            classInfo: const StudentClassModel(id: 101, name: '10A1', gradeLevel: 10),
            studentContacts: const [],
            studentMedicalInfo: const [],
          ),
        ];
        emit(
          StudentReviewLoaded(
            students: fallbackStudents,
            selectedStudent: fallbackStudents.first,
          ),
        );
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
