import 'dart:async';

import 'package:flutter/foundation.dart';

class Throttler {
  final Duration duration;
  bool _isReady = true;

  Throttler({required this.duration});

  void run(VoidCallback action) {
    if (_isReady) {
      _isReady = false;
      action();
      Timer(duration, () {
        _isReady = true;
      });
    }
  }
}