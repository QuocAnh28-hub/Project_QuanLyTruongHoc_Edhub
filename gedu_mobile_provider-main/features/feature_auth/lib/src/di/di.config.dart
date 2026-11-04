// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:core_auth/core_auth.dart' as _i608;
import 'package:core_storage/core_storage.dart' as _i78;
import 'package:feature_auth/src/change_password/bloc/change_password_bloc.dart'
    as _i612;
import 'package:feature_auth/src/coordinator/auth_feature_coordinator.dart'
    as _i174;
import 'package:feature_auth/src/login/bloc/auth_bloc.dart' as _i869;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:lib_base/lib_base.dart' as _i628;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    gh.factory<_i174.AuthFeatureCoordinator>(
      () => _i174.AuthFeatureCoordinator(gh<_i78.AppPreferences>()),
    );
    gh.factory<_i612.ChangePasswordBloc>(
      () => _i612.ChangePasswordBloc(
        gh<_i608.ChangePasswordUseCase>(),
        gh<_i78.AppPreferences>(),
      ),
    );
    gh.factory<_i869.AuthBloc>(
      () => _i869.AuthBloc(
        gh<_i608.LoginUseCase>(),
        gh<_i608.ChangePasswordUseCase>(),
        gh<_i628.CommonBloc>(),
        gh<_i78.AppPreferences>(),
        gh<_i174.AuthFeatureCoordinator>(),
      ),
    );
    return this;
  }
}
