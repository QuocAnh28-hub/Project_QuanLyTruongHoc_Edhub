import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:lib_utils/lib_utils.dart';

import '../../exception/app_exception_wrapper.dart';
import '../base_bloc_event.dart';

part 'common_event.freezed.dart';

abstract class CommonEvent extends BaseBlocEvent {
  const CommonEvent();
}

@freezed
abstract class ExceptionEmitted extends CommonEvent with _$ExceptionEmitted {
  const ExceptionEmitted._();
  const factory ExceptionEmitted({
    required AppExceptionWrapper appExceptionWrapper,
  }) = _ExceptionEmitted;
}

@freezed
abstract class LoadingVisibilityEmitted extends CommonEvent
    with _$LoadingVisibilityEmitted {
  const LoadingVisibilityEmitted._();
  const factory LoadingVisibilityEmitted({
    required bool isLoading,
  }) = _LoadingVisibilityEmitted;
}

@freezed
abstract class ShowSnackBarEvent extends CommonEvent with _$ShowSnackBarEvent {
  const ShowSnackBarEvent._();
  const factory ShowSnackBarEvent({
    required String message,
    required NotificationType type,
  }) = _ShowSnackBarEvent;
}
