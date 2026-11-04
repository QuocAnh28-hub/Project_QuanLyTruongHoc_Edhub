import 'package:core_students/core_students.dart';
import 'package:lib_base/lib_base.dart';

/// Base class for home events
abstract class HomeEvent extends BaseBlocEvent {
  const HomeEvent();
}

/// Event to load home data (initial load)
class LoadHomeDataEvent extends HomeEvent {
  const LoadHomeDataEvent();

  @override
  List<Object?> get props => [];
}

/// Event to switch to a different student
class SwitchStudentEvent extends HomeEvent {
  const SwitchStudentEvent({required this.student});

  final StudentModel student;

  @override
  List<Object?> get props => [student];
}

/// Event to logout user
class LogoutEvent extends HomeEvent {
  const LogoutEvent();

  @override
  List<Object?> get props => [];
}
