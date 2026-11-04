import 'package:flutter/material.dart';

class ScreenUtils {
  static double? _screenWidth;
  static double? _screenHeight;
  static const _figmaScreenHeight = 812;
  static const _figmaScreenWidth = 375;

  static double screenWidth({required BuildContext context}) {
    return (_screenWidth ??= MediaQuery.of(context).size.width);
  }

  static double screenHeight({required BuildContext context}) {
    return (_screenHeight ??= MediaQuery.of(context).size.height);
  }

  static double adaptedY(
      {required BuildContext context, required double figmaY}) {
    return screenHeight(context: context) * figmaY / _figmaScreenHeight;
  }

  static double adaptedX(
      {required BuildContext context, required double figmaX}) {
    return screenWidth(context: context) * figmaX / _figmaScreenWidth;
  }

  static bool get isTablet {
    final firstView = WidgetsBinding.instance.platformDispatcher.views.first;
    final logicalShortestSide =
        firstView.physicalSize.shortestSide / firstView.devicePixelRatio;
    return logicalShortestSide > 600;
  }
}