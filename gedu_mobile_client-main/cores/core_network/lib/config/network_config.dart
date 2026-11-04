import 'package:injectable/injectable.dart';

class NetworkConfig {
  final String baseUrl;
  final Duration connectTimeout;
  final Duration receiveTimeout;
  final Duration sendTimeout;
  final Map<String, String> defaultHeaders;

  const NetworkConfig({
    required this.baseUrl,
    this.connectTimeout = const Duration(seconds: 30),
    this.receiveTimeout = const Duration(seconds: 30),
    this.sendTimeout = const Duration(seconds: 30),
    this.defaultHeaders = const {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  factory NetworkConfig.fromEnvironment() {
    return NetworkConfig(baseUrl: const String.fromEnvironment('API_BASE_URL'));
  }

  /// Create NetworkConfig from flavor configuration
  @factoryMethod
  static NetworkConfig fromFlavor(String apiBaseUrl, Duration timeout) {
    return NetworkConfig(
      baseUrl: apiBaseUrl,
      connectTimeout: timeout,
      receiveTimeout: timeout,
      sendTimeout: timeout,
    );
  }

  /// Get default headers as a copy to avoid mutation
  Map<String, String> get headers => Map<String, String>.from(defaultHeaders);
}
