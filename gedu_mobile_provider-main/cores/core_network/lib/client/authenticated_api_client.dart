import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_storage/core_storage.dart';

import '../config/network_config.dart';
import '../interceptors/global_error_interceptor.dart';
import 'rest_api_client.dart';

@LazySingleton()
class AuthenticatedApiClient extends RestApiClient {
  AuthenticatedApiClient(this.networkConfig, this.appPreferences)
    : super(
        baseUrl: networkConfig.baseUrl,
        interceptors: [
          _AuthInterceptor(appPreferences),
          _HeaderInterceptor(networkConfig),
          GlobalErrorInterceptor(),
        ],
      );

  final NetworkConfig networkConfig;
  final AppPreferences appPreferences;
}

class _AuthInterceptor extends Interceptor {
  final AppPreferences appPreferences;

  _AuthInterceptor(this.appPreferences);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    try {
      // Log the full request details
      Log.d('🔍 AuthenticatedApiClient: Making request:');
      Log.d('🔍 AuthenticatedApiClient:   - Method: ${options.method}');
      Log.d('🔍 AuthenticatedApiClient:   - Base URL: ${options.baseUrl}');
      Log.d('🔍 AuthenticatedApiClient:   - Path: ${options.path}');
      Log.d('🔍 AuthenticatedApiClient:   - Full URL: ${options.uri}');
      Log.d('🔍 AuthenticatedApiClient:   - Headers: ${options.headers}');

      // Get authentication token from preferences
      final token = appPreferences.getAuthToken();

      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
        options.headers['Access-Control-Allow-Origin'] = '*';
        options.headers['accept'] = '*/*';
        Log.d('🔍 AuthenticatedApiClient: ✅ Added auth token to request');
      } else {
        Log.d(
          '🔍 AuthenticatedApiClient: ⚠️  No auth token found, request will be unauthenticated',
        );
      }
    } catch (e) {
      Log.e('🔍 AuthenticatedApiClient: Failed to add auth token: $e');
    }

    handler.next(options);
  }
}

class _HeaderInterceptor extends Interceptor {
  final NetworkConfig networkConfig;

  _HeaderInterceptor(this.networkConfig);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Apply default headers from NetworkConfig
    options.headers.addAll(networkConfig.headers);
    handler.next(options);
  }
}
