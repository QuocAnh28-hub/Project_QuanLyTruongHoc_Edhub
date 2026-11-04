part of 'academic_policy_bloc.dart';

abstract class AcademicPolicyEvent extends BaseBlocEvent {
  const AcademicPolicyEvent();
}

class LoadAcademicPolicyDataEvent extends AcademicPolicyEvent {
  final String refId;
  final int studentId;

  const LoadAcademicPolicyDataEvent({
    required this.refId,
    required this.studentId,
  });

  @override
  List<Object> get props => [refId, studentId];
}
