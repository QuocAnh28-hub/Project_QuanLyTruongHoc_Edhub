import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../config/network_config.dart';
import 'rest_api_client.dart';

@LazySingleton()
class NonAuthenticatedApiClient extends RestApiClient {
  NonAuthenticatedApiClient(this.networkConfig)
    : super(
        baseUrl: networkConfig.baseUrl,
        interceptors: [_HeaderInterceptor(networkConfig)],
      );

  final NetworkConfig networkConfig;
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
