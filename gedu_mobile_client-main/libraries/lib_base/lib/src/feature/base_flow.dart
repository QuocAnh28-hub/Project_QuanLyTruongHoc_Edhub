import '../exception/app_exception.dart';

abstract class BaseFlowResult {}

abstract class BaseFlowInput {}

abstract class BaseSafeTypeFlow<
  Input extends BaseFlowInput,
  Output extends BaseFlowResult
> {
  Future<Output> start({required Input data});
}

class BlocCatchingArgument {
  final Future<void> Function() action;
  final Future<void> Function()? doOnRetry;
  final Future<void> Function(AppException)? doOnError;
  final Future<void> Function()? doOnSubscribe;
  final Future<void> Function()? doOnSubscribeOrError;
  final Future<void> Function()? doOnEventCompleted;
  final bool handleLoading;
  final bool handleError;
  final bool handleRetry;
  final bool Function(AppException)? forceHandleError;
  final String? overrideErrorMessage;

  BlocCatchingArgument({
    required this.action,
    this.handleLoading = false,
    this.handleError = false,
    this.handleRetry = false,
    this.doOnRetry,
    this.doOnError,
    this.doOnSubscribe,
    this.doOnSubscribeOrError,
    this.doOnEventCompleted,
    this.forceHandleError,
    this.overrideErrorMessage,
  });
}