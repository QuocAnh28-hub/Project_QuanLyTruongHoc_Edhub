import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lib_utils/lib_utils.dart';
import 'package:rxdart/rxdart.dart';

import '../exception/app_exception.dart';
import '../exception/app_exception_wrapper.dart';
import '../exception/exception_handler.dart';
import '../exception/exception_message_mapper.dart';
import '../exception/remote_exception.dart';
import '../feature/base_flow.dart';
import '../log/log_mixin.dart';
import '../log/log_utils.dart';
import '../stream/dispose_bag.dart';
import 'base_bloc_event.dart';
import 'base_bloc_state.dart';
import 'common/common_bloc.dart';
import 'common/common_event.dart';
import 'mixin/event_transformer_mixin.dart';

abstract class BaseBloc<E extends BaseBlocEvent, S extends BaseBlocState>
    extends BaseBlocDelegate<E, S>
    with EventTransformerMixin, LogMixin {
  BaseBloc(super.initialState);
}

abstract class BaseBlocDelegate<
  E extends BaseBlocEvent,
  S extends BaseBlocState
>
    extends Bloc<E, S> {
  BaseBlocDelegate(super.initialState) {
    _eventDebounceHandlerSubscription = _eventDebounceHandler.listen((event) {
      add(event);
    });
  }

  late final ExceptionHandler exceptionHandler;
  late final ExceptionMessageMapper exceptionMessageMapper;
  late final DisposeBag disposeBag;
  late final CommonBloc _commonBloc;
  StreamSubscription<E>? _eventDebounceHandlerSubscription;

  final _eventDebounceController = StreamController<E>.broadcast();
  late final Stream<E> _eventDebounceHandler = _eventDebounceController.stream
      .debounceTime(const Duration(milliseconds: 300));

  set commonBloc(CommonBloc commonBloc) {
    _commonBloc = commonBloc;
  }

  CommonBloc get commonBloc =>
      this is CommonBloc ? this as CommonBloc : _commonBloc;

  @override
  Future<void> close() {
    Log.d("$runtimeType -> close}");
    _eventDebounceHandlerSubscription?.cancel();
    return super.close();
  }

  void addDebounce(E event) {
    _eventDebounceController.add(event);
  }

  @override
  void add(E event) {
    if (!isClosed) {
      super.add(event);
    } else {
      Log.e('Cannot add new event $event because $runtimeType was closed');
    }
  }

  Future<void> addException(AppExceptionWrapper appExceptionWrapper) async {
    commonBloc.add(ExceptionEmitted(appExceptionWrapper: appExceptionWrapper));

    return appExceptionWrapper.exceptionCompleter?.future;
  }

  void showLoading() {
    commonBloc.add(const LoadingVisibilityEmitted(isLoading: true));
  }

  void hideLoading() {
    commonBloc.add(const LoadingVisibilityEmitted(isLoading: false));
  }

  void showNotification(String message, NotificationType type) {
    commonBloc.add(ShowSnackBarEvent(message: message, type: type));
  }

  /// Show loading overlay with Lottie animation
  void showLoadingOverlay(
    BuildContext context, {
    String? message,
    String? animationPath,
    bool useShimmer = false,
  }) {
    // This will be implemented when the loading service is available
    // For now, we'll use the existing showLoading method
    showLoading();
  }

  /// Hide loading overlay
  void hideLoadingOverlay() {
    // This will be implemented when the loading service is available
    // For now, we'll use the existing hideLoading method
    hideLoading();
  }

  Future<void> runBlocCatchingDelegate(BlocCatchingArgument argument) async {
    await runBlocCatching(
      action: argument.action,
      doOnRetry: argument.doOnRetry,
      doOnError: argument.doOnError,
      doOnSubscribe: argument.doOnSubscribe,
      doOnSuccessOrError: argument.doOnSubscribeOrError,
      doOnEventCompleted: argument.doOnEventCompleted,
      handleLoading: argument.handleLoading,
      handleError: argument.handleError,
      handleRetry: argument.handleRetry,
      forceHandleError: argument.forceHandleError,
      overrideErrorMessage: argument.overrideErrorMessage,
    );
  }

  Future<void> runBlocCatching({
    required Future<void> Function() action,
    Future<void> Function()? doOnRetry,
    Future<void> Function(AppException)? doOnError,
    Future<void> Function()? doOnSubscribe,
    Future<void> Function()? doOnSuccessOrError,
    Future<void> Function()? doOnEventCompleted,
    bool handleLoading = true,
    bool handleError = true,
    bool handleRetry = true,
    bool Function(AppException)? forceHandleError,
    String? overrideErrorMessage,
  }) async {
    Completer<void>? recursion;
    try {
      await doOnSubscribe?.call();
      if (handleLoading) {
        showLoading();
      }

      await action.call();

      if (handleLoading) {
        hideLoading();
      }
      await doOnSuccessOrError?.call();
    } on AppException catch (e) {
      if (handleLoading) {
        hideLoading();
      }
      await doOnSuccessOrError?.call();
      await doOnError?.call(e);

      if (handleError || (forceHandleError?.call(e) ?? _forceHandleError(e))) {
        await addException(
          AppExceptionWrapper(
            appException: e,
            doOnRetry:
                doOnRetry ??
                (handleRetry
                    ? () async {
                        recursion = Completer();
                        await runBlocCatching(
                          action: action,
                          doOnEventCompleted: doOnEventCompleted,
                          doOnSubscribe: doOnSubscribe,
                          doOnSuccessOrError: doOnSuccessOrError,
                          doOnError: doOnError,
                          doOnRetry: doOnRetry,
                          forceHandleError: forceHandleError,
                          handleError: handleError,
                          handleLoading: handleLoading,
                          handleRetry: handleRetry,
                          overrideErrorMessage: overrideErrorMessage,
                        );
                        recursion?.complete();
                      }
                    : null),
            exceptionCompleter: Completer<void>(),
            overrideMessage: overrideErrorMessage,
          ),
        );
      }
    } finally {
      await recursion?.future;
      await doOnEventCompleted?.call();
    }
  }

  bool _forceHandleError(AppException appException) {
    return appException is RemoteException &&
        appException.kind == RemoteExceptionKind.refreshTokenFailed;
  }
}
