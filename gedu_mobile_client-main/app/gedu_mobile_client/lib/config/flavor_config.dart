import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:lib_base/lib_base.dart';

/// Flavor configuration for different environments
enum Flavor { development, staging, production }

/// Configuration for each flavor
class FlavorConfig {
  final Flavor flavor;
  final String appName;
  final String appId;
  final String baseUrl;
  final Duration timeout;
  final bool enableLogging;
  final String appIcon;
  final String appVersion;
  final String buildNumber;

  const FlavorConfig({
    required this.flavor,
    required this.appName,
    required this.appId,
    required this.baseUrl,
    required this.timeout,
    required this.enableLogging,
    required this.appIcon,
    required this.appVersion,
    required this.buildNumber,
  });

  /// Get the full API base URL
  String get apiBaseUrl {
    const apiBaseUrlOverride = String.fromEnvironment('API_BASE_URL');
    // A supplied API_BASE_URL is the complete API root (for example,
    // http://192.168.1.10:3000). Local Nest routes are served from that root.
    return apiBaseUrlOverride.isNotEmpty
        ? apiBaseUrlOverride
        : '$baseUrl/api';
  }

  /// Load configuration from JSON file
  static Future<FlavorConfig> loadFromJson(Flavor flavor) async {
    try {
      String configFile;
      switch (flavor) {
        case Flavor.development:
          configFile = 'assets/config/dev_config.json';
          break;
        case Flavor.staging:
          configFile = 'assets/config/staging_config.json';
          break;
        case Flavor.production:
          configFile = 'assets/config/prod_config.json';
          break;
      }

      Log.d('Loading flavor configuration from: $configFile');

      final jsonString = await rootBundle.loadString(configFile);
      final json = jsonDecode(jsonString) as Map<String, dynamic>;

      Log.d('Loaded configuration: $json');

      return FlavorConfig(
        flavor: flavor,
        appName: json['appName'] as String,
        appId: json['appId'] as String,
        baseUrl: json['baseUrl'] as String,
        timeout: Duration(seconds: json['timeoutSeconds'] as int),
        enableLogging: json['enableLogging'] as bool,
        appIcon: json['appIcon'] as String,
        appVersion: json['appVersion'] as String,
        buildNumber: json['buildNumber'] as String,
      );
    } catch (e) {
      Log.e('Failed to load flavor configuration for $flavor: $e');
      // Fallback to default configuration
      return _getDefaultConfig(flavor);
    }
  }

  /// Get default configuration (fallback)
  static FlavorConfig _getDefaultConfig(Flavor flavor) {
    switch (flavor) {
      case Flavor.development:
        return const FlavorConfig(
          flavor: Flavor.development,
          appName: 'Gedu Dev',
          appId: 'com.gedu.app.dev',
          baseUrl: 'https://demo.lazeout.com',
          timeout: Duration(seconds: 30),
          enableLogging: true,
          appIcon: '@mipmap/ic_launcher_dev',
          appVersion: '1.0.0',
          buildNumber: '1',
        );
      case Flavor.staging:
        return const FlavorConfig(
          flavor: Flavor.staging,
          appName: 'Gedu Staging',
          appId: 'com.gedu.app.staging',
          baseUrl: 'https://staging.lazeout.com',
          timeout: Duration(seconds: 30),
          enableLogging: true,
          appIcon: '@mipmap/ic_launcher_staging',
          appVersion: '1.0.0',
          buildNumber: '1',
        );
      case Flavor.production:
        return const FlavorConfig(
          flavor: Flavor.production,
          appName: 'Gedu',
          appId: 'com.gedu.app',
          baseUrl: 'https://api.lazeout.com',
          timeout: Duration(seconds: 30),
          enableLogging: false,
          appIcon: '@mipmap/ic_launcher',
          appVersion: '1.0.0',
          buildNumber: '1',
        );
    }
  }

  /// Get current flavor from environment
  static Flavor getCurrentFlavor() {
    const flavor = String.fromEnvironment(
      'FLAVOR',
      defaultValue: 'development',
    );
    switch (flavor.toLowerCase()) {
      case 'staging':
        return Flavor.staging;
      case 'production':
        return Flavor.production;
      case 'development':
      default:
        return Flavor.development;
    }
  }

  /// Get current configuration (async)
  static Future<FlavorConfig> get current async {
    final flavor = getCurrentFlavor();
    return await loadFromJson(flavor);
  }

  /// Get current configuration (sync - uses default if not loaded)
  static FlavorConfig get currentSync {
    final flavor = getCurrentFlavor();
    return _getDefaultConfig(flavor);
  }

  @override
  String toString() {
    return 'FlavorConfig(flavor: $flavor, appName: $appName, baseUrl: $baseUrl)';
  }
}
