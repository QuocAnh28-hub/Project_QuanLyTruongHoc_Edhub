// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:lib_base/src/bloc/common/common_bloc.dart' as _i573;
import 'package:lib_base/src/common/common_mediator.dart' as _i781;
import 'package:lib_base/src/common/common_mediator_impl.dart' as _i886;
import 'package:lib_base/src/di/lib_base_module.dart' as _i483;
import 'package:lib_base/src/exception/exception_handler.dart' as _i863;
import 'package:lib_base/src/exception/exception_refresh_token_notifier.dart'
    as _i724;
import 'package:lib_base/src/exception/friendly_message_config.dart' as _i166;
import 'package:lib_base/src/exception/friendly_message_config_impl.dart'
    as _i113;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final libBaseModule = _$LibBaseModule();
    gh.factory<_i573.CommonBloc>(() => _i573.CommonBloc());
    gh.singleton<_i886.FeatureCommonMediatorImpl>(
      () => _i886.FeatureCommonMediatorImpl(),
    );
    gh.singleton<_i113.FriendlyMessageConfigImpl>(
      () => _i113.FriendlyMessageConfigImpl(),
    );
    gh.lazySingleton<_i166.FriendlyMessageConfig>(
      () => libBaseModule.friendlyMessageConfig,
    );
    gh.lazySingleton<_i781.FeatureCommonMediator>(
      () => libBaseModule.featureCommonMediator,
    );
    gh.lazySingleton<_i724.ExceptionRefreshTokenNotifier>(
      () => _i724.ExceptionRefreshTokenNotifier(),
    );
    gh.lazySingleton<_i863.ExceptionHandler>(
      () => _i863.ExceptionHandler(
        commonMediator: gh<_i781.FeatureCommonMediator>(),
        refreshNotifier: gh<_i724.ExceptionRefreshTokenNotifier>(),
        friendlyMessageConfig: gh<_i166.FriendlyMessageConfig>(),
      ),
    );
    return this;
  }
}

class _$LibBaseModule extends _i483.LibBaseModule {}
