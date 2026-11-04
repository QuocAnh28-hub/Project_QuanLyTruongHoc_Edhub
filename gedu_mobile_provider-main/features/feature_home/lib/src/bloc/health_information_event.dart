part of 'health_information_bloc.dart';

abstract class HealthInformationEvent extends BaseBlocEvent {
  const HealthInformationEvent();
}

class LoadHealthInformationDataEvent extends HealthInformationEvent {
  final String refId;
  final int studentId;

  const LoadHealthInformationDataEvent({
    required this.refId,
    required this.studentId,
  });

  @override
  List<Object> get props => [refId, studentId];
}
