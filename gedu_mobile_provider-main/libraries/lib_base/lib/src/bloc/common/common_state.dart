import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:lib_utils/lib_utils.dart';

import '../../exception/app_exception_wrapper.dart';
import '../base_bloc_state.dart';

part 'common_state.freezed.dart';

@freezed
abstract class CommonState extends BaseBlocState with _$CommonState {
  const CommonState._();

  const factory CommonState({
    AppExceptionWrapper? appExceptionWrapper,
    @Default(0) int loadingCount,
    @Default(false) bool isLoading,
    SnackBarInfo? snackBar,
  }) = _CommonState;
}

class SnackBarInfo {
  final String message;
  final NotificationType notificationType;

  SnackBarInfo(this.message, this.notificationType);
}
