import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_base/lib_base.dart';

/// Router for handling navigation in the home feature
class HomeRouter {
  static const String _tag = 'HomeRouter';

  /// Navigate to dashboard screen
  static void navigateToDashboard(BuildContext context) {
    Log.d('$_tag: Navigating to dashboard screen');
    context.go('/dashboard');
  }

  /// Navigate to student review screen
  static void navigateToStudentReview(BuildContext context) {
    Log.d('$_tag: Navigating to student review screen');
    context.go('/student-review');
  }

  /// Navigate to profile screen
  static void navigateToProfile(BuildContext context) {
    Log.d('$_tag: Navigating to profile screen');
    context.go('/profile');
  }

  /// Navigate to settings screen
  static void navigateToSettings(BuildContext context) {
    Log.d('$_tag: Navigating to settings screen');
    context.go('/settings');
  }

  /// Navigate to courses screen
  static void navigateToCourses(BuildContext context) {
    Log.d('$_tag: Navigating to courses screen');
    context.go('/courses');
  }

  /// Navigate to notifications screen
  static void navigateToNotifications(BuildContext context) {
    Log.d('$_tag: Navigating to notifications screen');
    context.go('/notifications');
  }

  /// Navigate back to previous screen
  static void goBack(BuildContext context) {
    Log.d('$_tag: Going back to previous screen');
    context.pop();
  }

  /// Navigate to home screen (legacy - redirects to dashboard)
  static void navigateToHome(BuildContext context) {
    Log.d('$_tag: Navigating to home screen (redirecting to dashboard)');
    context.go('/dashboard');
  }
}
