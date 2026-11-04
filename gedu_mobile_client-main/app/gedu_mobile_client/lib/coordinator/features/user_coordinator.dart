import 'package:core_storage/core_storage.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../app_coordinator.dart';
import '../routes/app_routes.dart';

/// Feature coordinator for user module
@injectable
class UserCoordinator extends FeatureModuleCoordinator {
  static const String _tag = 'UserCoordinator';

  final AppCoordinator _appCoordinator;

  UserCoordinator(this._appCoordinator);

  // ==================== NAVIGATION METHODS ====================

  /// Navigate to profile page
  void goToProfile() {
    Log.d('$_tag: Navigating to profile');
    _appCoordinator.goToProfile();
  }

  /// Navigate to edit profile page
  void goToEditProfile() {
    Log.d('$_tag: Navigating to edit profile');
    _appCoordinator.push(UserRoutes.editProfile.path);
  }

  /// Navigate to change password page
  void goToChangePassword() {
    Log.d('$_tag: Navigating to change password');
    _appCoordinator.push('/auth/change-password');
  }

  /// Navigate to user settings page
  void goToUserSettings() {
    Log.d('$_tag: Navigating to user settings');
    _appCoordinator.push(UserRoutes.userSettings.path);
  }

  /// Navigate to user preferences page
  void goToUserPreferences() {
    Log.d('$_tag: Navigating to user preferences');
    _appCoordinator.push(UserRoutes.userPreferences.path);
  }

  // ==================== USER DATA METHODS ====================

  /// Get current user data
  Map<String, dynamic>? getCurrentUserData() {
    return AuthStorage.getUserData();
  }

  /// Get current user email
  String? getCurrentUserEmail() {
    return AuthStorage.getUserEmail();
  }

  /// Get current user full name
  String? getCurrentUserFullName() {
    return AuthStorage.getUserFullName();
  }

  /// Get current user ID
  int? getCurrentUserId() {
    return AuthStorage.getUserId();
  }

  /// Get current organization ID
  int? getCurrentOrgId() {
    return AuthStorage.getOrgId();
  }

  /// Check if user is authenticated
  bool get isAuthenticated => AuthStorage.isAuthenticated;

  // ==================== UTILITY METHODS ====================

  /// Show user-related error
  void showUserError(String message) {
    Log.d('$_tag: Showing user error: $message');
    _appCoordinator.showSnackBar(message, isError: true);
  }

  /// Show user-related success
  void showUserSuccess(String message) {
    Log.d('$_tag: Showing user success: $message');
    _appCoordinator.showSnackBar(message, isError: false);
  }

  /// Show confirmation dialog for profile update
  Future<bool?> showProfileUpdateConfirmation() async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Update Profile',
      content: 'Are you sure you want to update your profile?',
      confirmText: 'Update',
      cancelText: 'Cancel',
    );
  }

  /// Show confirmation dialog for password change
  Future<bool?> showPasswordChangeConfirmation() async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Change Password',
      content: 'Are you sure you want to change your password?',
      confirmText: 'Change',
      cancelText: 'Cancel',
    );
  }

  /// Show confirmation dialog for account deletion
  Future<bool?> showAccountDeletionConfirmation() async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Delete Account',
      content:
          'Are you sure you want to delete your account? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    );
  }

  /// Navigate back to previous screen
  void goBack() {
    Log.d('$_tag: Going back');
    if (_appCoordinator.canPop()) {
      _appCoordinator.pop();
    } else {
      _appCoordinator.goToHome();
    }
  }

  /// Navigate to home
  void goToHome() {
    Log.d('$_tag: Navigating to home');
    _appCoordinator.goToHome();
  }

  /// Navigate to settings
  void goToSettings() {
    Log.d('$_tag: Navigating to settings');
    _appCoordinator.goToSettings();
  }
}
