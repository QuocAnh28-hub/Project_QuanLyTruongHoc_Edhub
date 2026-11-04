import 'package:flutter/material.dart';

void popAll(BuildContext context) {
  Navigator.popUntil(context, (route) => route.isFirst);
}
