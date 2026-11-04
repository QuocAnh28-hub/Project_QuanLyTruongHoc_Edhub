// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:core_network/client/authenticated_api_client.dart' as _i826;
import 'package:core_network/client/non_authenticated_api_client.dart' as _i483;
import 'package:core_network/config/network_config.dart' as _i759;
import 'package:core_storage/core_storage.dart' as _i78;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    gh.lazySingleton<_i483.NonAuthenticatedApiClient>(
      () => _i483.NonAuthenticatedApiClient(gh<_i759.NetworkConfig>()),
    );
    gh.lazySingleton<_i826.AuthenticatedApiClient>(
      () => _i826.AuthenticatedApiClient(
        gh<_i759.NetworkConfig>(),
        gh<_i78.AppPreferences>(),
      ),
    );
    return this;
  }
}
