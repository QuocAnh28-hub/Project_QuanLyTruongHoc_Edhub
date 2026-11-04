import 'package:lib_base/lib_base.dart';

class DataResponse<T> {
  final T? response;
  final String? message;
  final bool? success;
  final ServerError? error;

  const DataResponse({this.response, this.message, this.success, this.error});

  factory DataResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    Log.d('🔍 DataResponse: fromJson called with: $json');

    // Check if the response contains errors
    ServerError? serverError;
    if (json.containsKey('errors') && json['errors'] != null) {
      Log.d('🔍 DataResponse: Found errors field: ${json['errors']}');
      try {
        serverError = ServerError.fromJson(json);
        Log.d('🔍 DataResponse: ServerError parsed successfully: $serverError');
      } catch (e) {
        Log.d('🔍 DataResponse: Failed to parse ServerError: $e');
        // If parsing fails, create a basic server error
        serverError = ServerError(
          generalMessage: json['message']?.toString() ?? 'Server error',
        );
      }
    } else {
      Log.d('🔍 DataResponse: No errors field found');
    }

    T? responseData;
    try {
      if (json['response'] != null) {
        Log.d(
          '🔍 DataResponse: Attempting to parse response data of type: ${T.toString()}',
        );
        Log.d('🔍 DataResponse: Raw response data: ${json['response']}');

        // Special handling for change password response
        if (T.toString().contains('ChangePasswordResponseDto')) {
          final responseJson = json['response'] as Map<String, dynamic>;
          if (responseJson.containsKey('message') &&
              !responseJson.containsKey('success')) {
            // Handle the case where response is just {message: "..."}
            responseData = fromJsonT({
              'success': true,
              'message': responseJson['message'],
            });
          } else {
            responseData = fromJsonT(json['response']);
          }
        } else {
          responseData = fromJsonT(json['response']);
        }
      }
      Log.d(
        '🔍 DataResponse: Successfully parsed response data: $responseData',
      );
    } catch (e, stackTrace) {
      final responseJson = json['response'];

      // Enhanced error logging with field-specific details
      Log.e(
        '❌ DataResponse: JSON Parsing Error Details:',
        name: 'JSON_PARSING_ERROR',
      );
      Log.e('❌ Target Type: ${T.toString()}');
      Log.e('❌ Error: ${e.toString()}');
      Log.e('❌ Error Type: ${e.runtimeType}');
      Log.e(
        '❌ Raw JSON: ${Log.prettyJson(responseJson is Map<String, dynamic> ? responseJson : {'data': responseJson})}',
      );

      // Try to identify problematic fields
      if (responseJson is Map<String, dynamic>) {
        Log.e('❌ Available Fields: ${responseJson.keys.toList()}');
        _logFieldAnalysis(responseJson);
      }

      Log.e('❌ Stack Trace:', stackTrace: stackTrace);

      // Create detailed error message
      String detailedErrorMessage =
          'JSON Parsing Failed for ${T.toString()}: ${e.toString()}';
      if (responseJson is Map<String, dynamic>) {
        detailedErrorMessage +=
            '\nAvailable fields: ${responseJson.keys.join(', ')}';
      }

      // If parsing fails, create a basic server error
      serverError = ServerError(generalMessage: detailedErrorMessage);
    }

    final dataResponse = DataResponse<T>(
      response: responseData,
      message: json['message'] as String?,
      success: json['success'] as bool? ?? (serverError == null),
      error: serverError,
    );

    Log.d(
      '🔍 DataResponse: Created DataResponse with hasError: ${dataResponse.hasError}',
    );
    return dataResponse;
  }

  Map<String, dynamic> toJson(Object? Function(T? value) toJsonT) {
    final Map<String, dynamic> result = {
      'response': response != null ? toJsonT(response) : null,
      'message': message,
      'success': success,
    };

    final currentError = error;
    if (currentError != null) {
      result.addAll(currentError.toJson());
    }

    return result;
  }

  /// Check if the response indicates an error (even with 200 status)
  bool get hasError => error != null || success == false;

  /// Get the error message from either the error object or the message field
  String? get errorMessage {
    final currentError = error;
    if (currentError != null) {
      return currentError.generalMessage ??
          currentError.errors.firstOrNull?.message;
    }
    return message;
  }

  /// Get the first error code if available
  String? get errorCode {
    if (error != null) {
      return error?.generalServerErrorId ??
          error?.errors.firstOrNull?.codeAsString;
    }
    return null;
  }

  /// Analyze JSON fields to help identify parsing issues
  static void _logFieldAnalysis(Map<String, dynamic> json) {
    try {
      Log.e('❌ Field Analysis:');
      json.forEach((key, value) {
        final valueType = value.runtimeType;
        final valuePreview = _getValuePreview(value);
        Log.e('❌   "$key": $valueType = $valuePreview');

        // Additional analysis for nested objects
        if (value is Map<String, dynamic>) {
          Log.e(
            '❌     └── Nested object with ${value.keys.length} fields: ${value.keys.take(5).join(', ')}${value.keys.length > 5 ? '...' : ''}',
          );
        } else if (value is List) {
          Log.e(
            '❌     └── List with ${value.length} items${value.isNotEmpty ? ' (first: ${_getValuePreview(value.first)})' : ''}',
          );
        }
      });
    } catch (e) {
      Log.e('❌ Field analysis failed: $e');
    }
  }

  /// Get a safe preview of a value for logging
  static String _getValuePreview(dynamic value) {
    if (value == null) return 'null';
    if (value is String) {
      return value.length > 50 ? '"${value.substring(0, 50)}..."' : '"$value"';
    }
    if (value is Map)
      return '{${value.keys.take(3).join(', ')}${value.keys.length > 3 ? '...' : ''}}';
    if (value is List)
      return '[${value.take(3).map((e) => e.toString()).join(', ')}${value.length > 3 ? '...' : ''}]';
    return value.toString();
  }
}
