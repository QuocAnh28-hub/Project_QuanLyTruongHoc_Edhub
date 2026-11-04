import 'package:injectable/injectable.dart';
import '../common/common_mediator.dart';
import '../common/common_mediator_impl.dart';
import '../exception/friendly_message_config.dart';
import '../exception/friendly_message_config_impl.dart';

@module
abstract class LibBaseModule {
  @lazySingleton
  FriendlyMessageConfig get friendlyMessageConfig =>
      FriendlyMessageConfigImpl();

  @lazySingleton
  FeatureCommonMediator get featureCommonMediator =>
      FeatureCommonMediatorImpl();
}
