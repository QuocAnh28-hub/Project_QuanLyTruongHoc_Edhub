import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';
import 'package:core_auth/core_auth.dart';

/// Base class for home states
abstract class HomeState extends BaseBlocState {
  const HomeState();
}

/// Initial home state
class HomeInitial extends HomeState {
  const HomeInitial();

  @override
  List<Object?> get props => [];
}

/// Loading home state
class HomeLoading extends HomeState {
  const HomeLoading();

  @override
  List<Object?> get props => [];
}

/// Success home state
class HomeSuccess extends HomeState {
  final Map<String, dynamic>? userData;
  final List<StudentModel>? students;
  final StudentModel? currentStudent;
  final GetAccountInfoOutput? accountInfo;
  final bool showStudentSelection;

  const HomeSuccess({
    this.userData,
    this.students,
    this.currentStudent,
    this.accountInfo,
    this.showStudentSelection = false,
  });

  HomeSuccess copyWith({
    Map<String, dynamic>? userData,
    List<StudentModel>? students,
    StudentModel? currentStudent,
    GetAccountInfoOutput? accountInfo,
    bool? showStudentSelection,
  }) {
    return HomeSuccess(
      userData: userData ?? this.userData,
      students: students ?? this.students,
      currentStudent: currentStudent ?? this.currentStudent,
      accountInfo: accountInfo ?? this.accountInfo,
      showStudentSelection: showStudentSelection ?? this.showStudentSelection,
    );
  }

  @override
  List<Object?> get props => [
    userData,
    students,
    currentStudent,
    accountInfo,
    showStudentSelection,
  ];
}

/// Error home state
class HomeError extends HomeState {
  final String message;

  const HomeError(this.message);

  @override
  List<Object?> get props => [message];
}

/// Logout success state
class LogoutSuccess extends HomeState {
  const LogoutSuccess();

  @override
  List<Object?> get props => [];
}

/// Logout error state
class LogoutError extends HomeState {
  final String message;

  const LogoutError(this.message);

  @override
  List<Object?> get props => [message];
}
