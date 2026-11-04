import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';

@LazySingleton()
class ExceptionRefreshTokenNotifier extends ChangeNotifier {
  void notifyChange() {
    notifyListeners();
  }
}