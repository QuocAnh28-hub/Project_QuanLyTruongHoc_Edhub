import 'package:flutter/foundation.dart';

import '../../log/log_mixin.dart';
import 'base_input.dart';

abstract class BaseUseCase<Input extends BaseInput, Output> with LogMixin {
  const BaseUseCase();

  @protected
  Output buildUseCase(Input input);
}
