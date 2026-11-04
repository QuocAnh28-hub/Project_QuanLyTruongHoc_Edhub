import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:core_students/core_students.dart';
import 'package:core_auth/core_auth.dart';
import 'package:dartx/dartx.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import 'home_event.dart';
import 'home_state.dart';

/// BLoC for handling home logic
@injectable
class HomeBloc extends BaseBloc<HomeEvent, HomeState> {
  static const String _tag = 'HomeBloc';

  final GetStudentsUseCase _getStudentsUseCase;
  final GetAccountInfoUseCase _getAccountInfoUseCase;

  HomeBloc(this._getStudentsUseCase, this._getAccountInfoUseCase)
    : super(const HomeInitial()) {
    on<LoadHomeDataEvent>(_handleLoadHomeData);
    on<SwitchStudentEvent>(_handleSwitchStudent);
    on<LogoutEvent>(_handleLogout);
  }

  /// Handle load home data event - initial load
  Future<void> _handleLoadHomeData(
    LoadHomeDataEvent event,
    Emitter<HomeState> emit,
  ) async {
    try {
      Log.d('$_tag: Loading home data');
      emit(const HomeLoading());

      // Get user data from storage
      final userData = AuthStorage.getUserData();
      final refId = AuthStorage.getRefId();

      Log.d('$_tag: User data retrieved - RefId: $refId');

      // Get account info from API
      final accountInfoResult = await _getAccountInfoUseCase.execute(
        const GetAccountInfoInput(),
      );

      // Get student data if refId is available
      List<StudentModel>? students;
      StudentModel? currentStudent;

      if (refId != null) {
        try {
          final result = await _getStudentsUseCase.execute(
            GetStudentsInput(refId: refId.toString()),
          );
          students = result.students;

          // Find the previously selected student from storage
          final selectedStudentData = AuthStorage.getSelectedStudent();
          if (selectedStudentData != null && students.isNotEmpty) {
            final selectedStudentId = selectedStudentData['id'] as int?;
            if (selectedStudentId != null) {
              currentStudent = students.firstOrNullWhere(
                (student) => student.id == selectedStudentId,
              );
            }
          }

          // If no previously selected student, use the first one
          if (currentStudent == null && students.isNotEmpty) {
            currentStudent = students.first;
          }

          Log.d(
            '$_tag: Found ${students.length} students, current: ${currentStudent?.displayName}',
          );
        } catch (e) {
          Log.e('$_tag: Failed to load student data: $e');
        }
      }

      Log.d('$_tag: Home data loaded successfully');
      emit(
        HomeSuccess(
          userData: userData,
          accountInfo: accountInfoResult,
          students: students,
          currentStudent: currentStudent,
        ),
      );
    } catch (e) {
      Log.e('$_tag: Load home data exception: $e');
      emit(HomeError('Failed to load home data: $e'));
    }
  }

  /// Handle switch student event - save new student and refresh
  Future<void> _handleSwitchStudent(
    SwitchStudentEvent event,
    Emitter<HomeState> emit,
  ) async {
    try {
      Log.d('$_tag: Switching to student: ${event.student.displayName}');

      // Save the selected student to storage
      final appPreferences = getIt<AppPreferences>();
      await appPreferences.saveSelectedStudent({
        'id': event.student.id, // ✅ Use 'id' key consistently
        'firstName': event.student.firstName,
        'lastName': event.student.lastName,
        'name': event.student.displayName,
        'status': event.student.status,
        'gender': event.student.sex,
        'className': event.student.currentClassName, // ✅ Add className as well
        'schoolName': event.student.schoolName,
        'code': event.student.code, // ✅ Add schoolName as well
        'confirmedById':
            event.student.confirmedById, // ✅ Add confirmedById as well
      });

      Log.d('$_tag: Student saved to storage');

      // Get current state and update with new student
      final currentState = state;
      if (currentState is HomeSuccess) {
        emit(currentState.copyWith(currentStudent: event.student));
        Log.d('$_tag: State updated with new student');
      }
    } catch (e) {
      Log.e('$_tag: Switch student exception: $e');
    }
  }

  /// Handle logout event
  Future<void> _handleLogout(LogoutEvent event, Emitter<HomeState> emit) async {
    try {
      Log.d('$_tag: Attempting logout');
      emit(const HomeLoading());

      final success = await AuthStorage.logout();
      if (success) {
        Log.d('$_tag: Logout successful');
        emit(const LogoutSuccess());
      } else {
        Log.e('$_tag: Logout failed');
        emit(const LogoutError('Failed to logout'));
      }
    } catch (e) {
      Log.e('$_tag: Logout exception: $e');
      emit(LogoutError('An unexpected error occurred: $e'));
    }
  }
}
