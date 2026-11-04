import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lib_utils/lib_utils.dart';

import '../../common/common_mediator.dart';
import '../../di/di.dart';
import '../../exception/app_exception.dart';
import '../../exception/app_exception_wrapper.dart';
import '../../exception/exception_handler.dart';
import '../../exception/exception_message_mapper.dart';
import '../../log/log_mixin.dart';
import '../../stream/dispose_bag.dart';
import '../base_bloc.dart';
import '../common/common_bloc.dart';
import '../common/common_state.dart';

abstract class BasePageState<T extends StatefulWidget, B extends BaseBloc>
    extends BasePageStateDelegate<T, B>
    with LogMixin {}

abstract class BasePageStateDelegate<
  T extends StatefulWidget,
  B extends BaseBloc
>
    extends BasePageStateDelegateWithCommon<T>
    with AutomaticKeepAliveClientMixin {
  late final B bloc = getIt.get<B>(instanceName: instanceName)
    ..disposeBag = disposeBag
    ..commonBloc = commonBloc
    ..exceptionHandler = exceptionHandler
    ..exceptionMessageMapper = exceptionMessageMapper;

  String? get instanceName => null;

  @override
  bool get wantKeepAlive => false;

  @override
  Widget build(BuildContext context) {
    _setupStatusBarStyle(context);
    if (wantKeepAlive) {
      super.build(context);
    }

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => bloc),
        BlocProvider(create: (_) => commonBloc),
      ],
      child: buildBlocProviderChild(context),
    );
  }

  @override
  void dispose() {
    if (closeBlocWhenDisposed) {
      bloc.close();
    }

    super.dispose();
  }

  void _setupStatusBarStyle(BuildContext context) {
    final brightness = Theme.of(context).colorScheme.brightness;
    if (brightness == Brightness.light) {
      SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle.dark.copyWith(
          statusBarColor: Colors.transparent,
          systemNavigationBarColor: Colors.white,
          statusBarIconBrightness: Brightness.dark,
          systemNavigationBarIconBrightness: Brightness.dark,
        ),
      );
    } else {
      SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle.light.copyWith(
          statusBarColor: Colors.transparent,
          systemNavigationBarColor: Colors.black,
          statusBarIconBrightness: Brightness.light,
          systemNavigationBarIconBrightness: Brightness.light,
        ),
      );
    }
  }
}

abstract class BasePageStateDelegateWithCommon<T extends StatefulWidget>
    extends State<T> {
  late final FeatureCommonMediator commonMediator = getIt
      .get<FeatureCommonMediator>();
  late final ExceptionMessageMapper exceptionMessageMapper =
      ExceptionMessageMapper();
  late final ExceptionHandler exceptionHandler = getIt.get<ExceptionHandler>();

  late final CommonBloc commonBloc = getIt.get<CommonBloc>()
    ..disposeBag = disposeBag
    ..exceptionHandler = exceptionHandler
    ..exceptionMessageMapper = exceptionMessageMapper;

  late final DisposeBag disposeBag = DisposeBag();

  bool get isAppWidget => false;

  /// default will close bloc when disposed
  bool get closeBlocWhenDisposed => true;

  Widget buildBlocProviderChild(BuildContext context) {
    return MultiBlocListener(
      listeners: [
        BlocListener<CommonBloc, CommonState>(
          listenWhen: (previous, current) =>
              previous.appExceptionWrapper != current.appExceptionWrapper &&
              current.appExceptionWrapper != null,
          listener: (context, state) {
            final exceptionWrapper = state.appExceptionWrapper;
            if (exceptionWrapper != null) {
              handleException(exceptionWrapper, context);
            }
          },
        ),
        BlocListener<CommonBloc, CommonState>(
          listenWhen: (previous, current) =>
              previous.snackBar != current.snackBar && current.snackBar != null,
          listener: (context, state) {
            showToast(
              state.snackBar?.message ?? '',
              state.snackBar?.notificationType ?? NotificationType.negative,
            );
          },
        ),
      ],
      child: buildPageListeners(
        child: isAppWidget
            ? buildPage(context)
            : Stack(
                children: [
                  buildPage(context),
                  BlocBuilder<CommonBloc, CommonState>(
                    buildWhen: (previous, current) =>
                        previous.isLoading != current.isLoading,
                    builder: (context, state) => Visibility(
                      visible: state.isLoading,
                      child: buildPageLoading(),
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [BlocProvider(create: (_) => commonBloc)],
      child: buildBlocProviderChild(context),
    );
  }

  Widget buildPageListeners({required Widget child}) => child;

  Widget buildPageLoading() => commonMediator.loadingFullscreen();

  Widget buildPage(BuildContext context);

  @override
  void dispose() {
    super.dispose();
    if (closeBlocWhenDisposed) {
      disposeBag.dispose();
    }
  }

  void handleException(
    AppExceptionWrapper appExceptionWrapper,
    BuildContext context,
  ) {
    exceptionHandler
        .handleException(
          appExceptionWrapper,
          handleExceptionMessage(appExceptionWrapper.appException),
          context,
        )
        .then((value) {
          appExceptionWrapper.exceptionCompleter?.complete();
        });
  }

  String handleExceptionMessage(AppException appException) {
    return exceptionMessageMapper.map(appException);
  }

  void showSuccessToast(String message) {
    showToast(message, NotificationType.positive);
  }

  void showErrorToast(String message) {
    showToast(message, NotificationType.negative);
  }

  void showToast(String message, NotificationType type) {
    commonMediator.showToast(message, type, context);
  }
}
