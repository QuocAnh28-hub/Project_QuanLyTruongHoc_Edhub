import 'package:dio/dio.dart';
import 'package:lib_base/lib_base.dart';

import '../base/response/data_response.dart';

enum RestMethod { get, post, put, patch, delete }

abstract class GenericRequestInfo {
  RestMethod get method;

  String get path;
}

abstract class RestApiClient {
  final Dio _dio;

  RestApiClient({
    required String baseUrl,
    List<Interceptor>? interceptors,
    Interceptor? inspectorInterceptor,
  }) : _dio = Dio(
         BaseOptions(
           baseUrl: baseUrl,
           connectTimeout: const Duration(seconds: 30),
           receiveTimeout: const Duration(seconds: 30),
           sendTimeout: const Duration(seconds: 30),
         ),
       ) {
    if (interceptors != null) {
      _dio.interceptors.addAll(interceptors);
    }
    if (inspectorInterceptor != null) {
      _dio.interceptors.add(inspectorInterceptor);
    }
  }

  Future<DataResponse<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(Object? json)? fromJson,
  }) async {
    try {
      Log.d('🔍 RestApiClient: Making GET request to: $path');
      Log.d('🔍 RestApiClient: Query parameters: $queryParameters');

      final response = await _dio.get(path, queryParameters: queryParameters);

      Log.d('🔍 RestApiClient: Response received:');
      Log.d('🔍 RestApiClient:   - Status Code: ${response.statusCode}');
      Log.d('🔍 RestApiClient:   - Status Message: ${response.statusMessage}');
      Log.d('🔍 RestApiClient:   - Data: ${response.data}');

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      Log.e('🔍 RestApiClient: GET request failed: $e');
      Log.e('🔍 RestApiClient: Error type: ${e.runtimeType}');

      // If it's already a RemoteException, re-throw it directly
      if (e is RemoteException) {
        Log.d(
          '🔍 RestApiClient: Re-throwing existing RemoteException: ${e.kind}',
        );
        rethrow;
      }
      throw _handleError(e);
    }
  }

  Future<DataResponse<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(Object? json)? fromJson,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      // If it's already a RemoteException, re-throw it directly
      if (e is RemoteException) {
        Log.d(
          '🔍 RestApiClient: Re-throwing existing RemoteException: ${e.kind}',
        );
        rethrow;
      }
      throw _handleError(e);
    }
  }

  Future<DataResponse<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(Object? json)? fromJson,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      // If it's already a RemoteException, re-throw it directly
      if (e is RemoteException) {
        Log.d(
          '🔍 RestApiClient: Re-throwing existing RemoteException: ${e.kind}',
        );
        rethrow;
      }
      throw _handleError(e);
    }
  }

  Future<DataResponse<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(Object? json)? fromJson,
  }) async {
    try {
      final response = await _dio.patch(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      // If it's already a RemoteException, re-throw it directly
      if (e is RemoteException) {
        Log.d(
          '🔍 RestApiClient: Re-throwing existing RemoteException: ${e.kind}',
        );
        rethrow;
      }
      throw _handleError(e);
    }
  }

  Future<DataResponse<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    T Function(Object? json)? fromJson,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
      );
      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      // If it's already a RemoteException, re-throw it directly
      if (e is RemoteException) {
        Log.d(
          '🔍 RestApiClient: Re-throwing existing RemoteException: ${e.kind}',
        );
        rethrow;
      }
      throw _handleError(e);
    }
  }

  DataResponse<T> _handleResponse<T>(
    Response response,
    T Function(Object? json)? fromJson,
  ) {
    Log.d(
      '🔍 RestApiClient: _handleResponse called with status: ${response.statusCode}',
    );
    Log.d('🔍 RestApiClient: Response data: ${response.data}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      // Even with 200 status, check if the response contains errors
      final responseData = response.data as Map<String, dynamic>? ?? {};
      Log.d('🔍 RestApiClient: Response data as Map: $responseData');

      // Create DataResponse which will handle error detection
      DataResponse<T> dataResponse;
      try {
        dataResponse = DataResponse<T>.fromJson(
          responseData,
          fromJson ?? (json) => json as T,
        );

        Log.d('🔍 RestApiClient: DataResponse created');
        Log.d('🔍 RestApiClient: hasError: ${dataResponse.hasError}');
        Log.d('🔍 RestApiClient: error: ${dataResponse.error}');
        Log.d('🔍 RestApiClient: errorMessage: ${dataResponse.errorMessage}');

        // If the response indicates an error, throw a RemoteException
        if (dataResponse.hasError) {
          Log.d('🔍 RestApiClient: Throwing RemoteException');
          throw RemoteException(
            kind: RemoteExceptionKind.serverDefined,
            httpErrorCode: response.statusCode,
            serverError: dataResponse.error,
            rootException: Exception('Server returned error in 200 response'),
          );
        }

        Log.d('🔍 RestApiClient: Returning successful DataResponse');
        return dataResponse;
      } catch (e) {
        Log.d('🔍 RestApiClient: Exception in _handleResponse: $e');
        rethrow;
      }
    } else {
      Log.d('🔍 RestApiClient: Throwing HTTP error exception');
      throw Exception('HTTP ${response.statusCode}: ${response.statusMessage}');
    }
  }

  Exception _handleError(dynamic error) {
    // If it's already a RemoteException, return it as is
    if (error is RemoteException) {
      Log.d(
        '🔍 RestApiClient: _handleError: Returning existing RemoteException: ${error.kind}',
      );
      return error;
    }

    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.sendTimeout:
        case DioExceptionType.receiveTimeout:
          return RemoteException(
            kind: RemoteExceptionKind.timeout,
            rootException: error,
          );
        case DioExceptionType.badResponse:
          return _handleServerError(error);
        case DioExceptionType.cancel:
          return RemoteException(
            kind: RemoteExceptionKind.cancellation,
            rootException: error,
          );
        case DioExceptionType.connectionError:
          return RemoteException(
            kind: RemoteExceptionKind.noInternet,
            rootException: error,
          );
        default:
          return RemoteException(
            kind: RemoteExceptionKind.network,
            rootException: error,
          );
      }
    }
    return RemoteException(
      kind: RemoteExceptionKind.unknown,
      rootException: error,
    );
  }

  RemoteException _handleServerError(DioException error) {
    final statusCode = error.response?.statusCode;
    final responseData = error.response?.data;

    ServerError? serverError;
    if (responseData is Map<String, dynamic>) {
      try {
        serverError = ServerError.fromJson(responseData);
      } catch (e) {
        // If parsing fails, create a basic server error
        serverError = ServerError(
          generalMessage: responseData['message']?.toString() ?? 'Server error',
        );
      }
    }

    return RemoteException(
      kind: RemoteExceptionKind.serverDefined,
      httpErrorCode: statusCode,
      serverError: serverError,
      rootException: error,
    );
  }
}
