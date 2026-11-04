import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_base/src/navigator/base_navigator.dart';

/// Feature coordinator for profile module
@injectable
class ProfileFeatureCoordinator extends FeatureModuleCoordinator
    implements BaseCoordinatorNavigator {
  static const String _tag = 'ProfileFeatureCoordinator';

  @override
  List<RouteBase> get routes => [];

  // ==================== PROFILE NAVIGATION METHODS ====================

  /// Navigate to change password from profile
  void navigateToChangePassword(BuildContext context) {
    Log.d('$_tag: Navigating to change password from profile');
    // Delegate to auth coordinator through the unified interface
    // For now, use direct navigation until we set up proper delegation
    context.go('/auth/change-password', extra: {'isFirstTimeLogin': false});
  }

  /// Navigate to student profile
  void navigateToStudentProfile(BuildContext context) {
    Log.d('$_tag: Navigating to student profile');
    // TODO: Implement when student profile route is available
    Log.d('$_tag: Student profile navigation not yet implemented');
  }

  /// Navigate to notification settings
  void navigateToNotificationSettings(BuildContext context) {
    Log.d('$_tag: Navigating to notification settings');
    // TODO: Implement when notification settings route is available
    Log.d('$_tag: Notification settings navigation not yet implemented');
  }

  /// Navigate to user guide
  void navigateToUserGuide(BuildContext context) {
    Log.d('$_tag: Navigating to user guide');
    // TODO: Implement when user guide route is available
    Log.d('$_tag: User guide navigation not yet implemented');
  }

  /// Navigate to video guide
  void navigateToVideoGuide(BuildContext context) {
    Log.d('$_tag: Navigating to video guide');
    // TODO: Implement when video guide route is available
    Log.d('$_tag: Video guide navigation not yet implemented');
  }

  /// Navigate to FAQ
  void navigateToFAQ(BuildContext context) {
    Log.d('$_tag: Navigating to FAQ');
    // TODO: Implement when FAQ route is available
    Log.d('$_tag: FAQ navigation not yet implemented');
  }

  /// Navigate back to profile (or appropriate route)
  void navigateBack(BuildContext context) {
    Log.d('$_tag: Navigating back to profile');
    // Navigate back to the profile tab
    context.go('/dashboard'); // Profile is part of the dashboard tab structure
  }
}
