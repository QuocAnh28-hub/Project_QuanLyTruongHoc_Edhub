import 'package:flutter/material.dart';

class ScrollUtils {
  static void scrollToWidget(BuildContext? context) {
    if (context == null) {
      return;
    }
    Scrollable.ensureVisible(
      context,
      alignment: 1.0,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeInOut,
    );
  }
}
