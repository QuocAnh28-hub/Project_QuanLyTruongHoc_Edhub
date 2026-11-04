import 'package:flutter/services.dart';

import '../../exception/app_exception.dart';
import '../../exception/app_platform_exception.dart';
import '../../exception/app_uncaught_exception.dart';
import '../../log/log_config.dart';
import 'base_input.dart';
import 'base_output.dart';
import 'base_use_case.dart';

abstract class BaseFutureUseCase<Input extends BaseInput,
Output extends BaseOutput> extends BaseUseCase<Input, Future<Output>> {
  const BaseFutureUseCase();

  Future<Output> execute(Input input) async {
    try {
      if (LogConfig.enableLogUseCaseInput) {
        logD('FutureUseCase Input: $input');
      }
      final output = await buildUseCase(input);
      if (LogConfig.enableLogUseCaseOutput) {
        logD('FutureUseCase Output: $output');
      }

      return output;
    } catch (e) {
      if (LogConfig.enableLogUseCaseError) {
        logE('FutureUseCase Error: $e');
      }

      if (e is PlatformException) {
        throw AppPlatformException(e.message);
      }

      throw e is AppException ? e : AppUncaughtException(e);
    }
  }
}
