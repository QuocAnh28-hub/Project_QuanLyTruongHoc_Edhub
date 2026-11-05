import 'dart:async';
import 'dart:convert';

import 'dart:developer' as dev;

import 'log_config.dart';

class Log {
  const Log._();

  static const _enableLog = LogConfig.enableGeneralLog;

  /// Debug log
  static void d(Object? message, {String? name, DateTime? time}) {
    _log('🛠️ $message', name: name ?? '', time: time);
  }

  /// Warning log
  static void w(Object? message, {String? name, DateTime? time}) {
    _log('⚠️ $message', name: name ?? '', time: time);
  }

  static void e(
    Object? errorMessage, {
    String? name,
    Object? errorObject,
    StackTrace? stackTrace,
    DateTime? time,
  }) {
    _log(
      '❌️ $errorMessage',
      name: name ?? '',
      time: time,
      error: errorObject,
      stackTrace: stackTrace,
    );
  }

  static String prettyJson(Map<String, dynamic> json) {
    if (!LogConfig.isPrettyJson) {
      return json.toString();
    }

    final indent = ' ' * 2;
    final encoder = JsonEncoder.withIndent(indent);

    return encoder.convert(json);
  }

  static void _log(
    String message, {
    int level = 0,
    String name = '',
    DateTime? time,
    int? sequenceNumber,
    Zone? zone,
    Object? error,
    StackTrace? stackTrace,
  }) {
    if (_enableLog) {
      dev.log(
        message,
        name: name,
        time: time,
        sequenceNumber: sequenceNumber,
        level: level,
        zone: zone,
        error: error,
        stackTrace: stackTrace,
      );
    }
  }
}
