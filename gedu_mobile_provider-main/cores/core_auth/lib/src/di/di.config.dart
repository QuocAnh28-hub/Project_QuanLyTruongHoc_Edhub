// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:core_auth/src/endpoint/auth_endpoint.dart' as _i836;
import 'package:core_auth/src/repository/auth_repository.dart' as _i770;
import 'package:core_auth/src/service/auth_service.dart' as _i235;
import 'package:core_auth/src/usecase/change_password_usecase.dart' as _i611;
import 'package:core_auth/src/usecase/get_account_info_usecase.dart' as _i492;
import 'package:core_auth/src/usecase/login_usecase.dart' as _i286;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    gh.factory<_i836.AuthEndpoint>(() => _i836.AuthEndpoint());
    gh.factory<_i770.AuthRepository>(() => _i770.AuthRepositoryImpl());
    gh.factory<_i286.LoginUseCase>(
      () => _i286.LoginUseCase(gh<_i770.AuthRepository>()),
    );
    gh.factory<_i492.GetAccountInfoUseCase>(
      () => _i492.GetAccountInfoUseCase(gh<_i770.AuthRepository>()),
    );
    gh.factory<_i611.ChangePasswordUseCase>(
      () => _i611.ChangePasswordUseCase(gh<_i770.AuthRepository>()),
    );
    gh.factory<_i235.AuthService>(
      () => _i235.AuthService(gh<_i286.LoginUseCase>()),
    );
    return this;
  }
}
