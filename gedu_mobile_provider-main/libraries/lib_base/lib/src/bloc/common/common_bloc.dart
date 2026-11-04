import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../base_bloc.dart';
import 'common_event.dart';
import 'common_state.dart';

@Injectable()
class CommonBloc extends BaseBlocDelegate<CommonEvent, CommonState> {
  CommonBloc() : super(const CommonState()) {
    // Set itself as the common bloc to avoid circular dependency
    commonBloc = this;

    on<LoadingVisibilityEmitted>(_onLoadingVisibilityEmitted);
    on<ExceptionEmitted>(_onExceptionEmitted);
    on<ShowSnackBarEvent>(_onShowSnackBarEvent);
  }

  FutureOr<void> _onLoadingVisibilityEmitted(
    LoadingVisibilityEmitted event,
    Emitter<CommonState> emit,
  ) {
    emit(
      state.copyWith(
        isLoading: state.loadingCount == 0 && event.isLoading
            ? true
            : state.loadingCount == 1 && !event.isLoading ||
                  state.loadingCount <= 0
            ? false
            : state.isLoading,
        loadingCount: event.isLoading
            ? state.loadingCount + 1
            : state.loadingCount - 1,
      ),
    );
  }

  FutureOr<void> _onExceptionEmitted(
    ExceptionEmitted event,
    Emitter<CommonState> emit,
  ) {
    emit(state.copyWith(appExceptionWrapper: event.appExceptionWrapper));
  }

  void _onShowSnackBarEvent(
    ShowSnackBarEvent event,
    Emitter<CommonState> emit,
  ) {
    emit(state.copyWith(snackBar: SnackBarInfo(event.message, event.type)));
  }
}
