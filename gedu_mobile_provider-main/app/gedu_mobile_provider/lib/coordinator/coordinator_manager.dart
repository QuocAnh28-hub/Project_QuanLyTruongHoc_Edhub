import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:feature_auth/feature_auth.dart' as feature_auth;
import 'package:feature_home/feature_home.dart' as feature_home;

import 'app_coordinator.dart';
import 'features/course_coordinator.dart';
import 'features/user_coordinator.dart';

/// Manager for all coordinators in the application
@singleton
class CoordinatorManager {
  static const String _tag = 'CoordinatorManager';

  final AppCoordinator _appCoordinator;
  final feature_auth.AuthFeatureCoordinator _authFeatureCoordinator;
  final feature_home.HomeFeatureCoordinator _homeFeatureCoordinator;
  final feature_home.ProfileFeatureCoordinator _profileFeatureCoordinator;
  final UserCoordinator _userCoordinator;
  final CourseCoordinator _courseCoordinator;

  CoordinatorManager({
    required AppCoordinator appCoordinator,
    required feature_auth.AuthFeatureCoordinator authFeatureCoordinator,
    required feature_home.HomeFeatureCoordinator homeFeatureCoordinator,
    required feature_home.ProfileFeatureCoordinator profileFeatureCoordinator,
    required UserCoordinator userCoordinator,
    required CourseCoordinator courseCoordinator,
  }) : _appCoordinator = appCoordinator,
       _authFeatureCoordinator = authFeatureCoordinator,
       _homeFeatureCoordinator = homeFeatureCoordinator,
       _profileFeatureCoordinator = profileFeatureCoordinator,
       _userCoordinator = userCoordinator,
       _courseCoordinator = courseCoordinator {
    Log.d('$_tag: CoordinatorManager initialized');
  }

  // ==================== COORDINATOR ACCESS ====================

  /// Get the main app coordinator
  AppCoordinator get app => _appCoordinator;

  /// Get the auth feature coordinator
  feature_auth.AuthFeatureCoordinator get auth => _authFeatureCoordinator;

  /// Get the home feature coordinator
  feature_home.HomeFeatureCoordinator get home => _homeFeatureCoordinator;

  /// Get the profile feature coordinator
  feature_home.ProfileFeatureCoordinator get profile => _profileFeatureCoordinator;

  /// Get the user coordinator
  UserCoordinator get user => _userCoordinator;

  /// Get the course coordinator
  CourseCoordinator get course => _courseCoordinator;

  // ==================== INITIALIZATION ====================

  /// Initialize all coordinators
  void initialize() {
    Log.d('$_tag: Initializing all coordinators...');

    try {
      _appCoordinator.initialize();
      Log.d('$_tag: App coordinator initialized successfully');
    } catch (e) {
      Log.e('$_tag: Failed to initialize app coordinator: $e');
      rethrow;
    }
  }

  // ==================== GLOBAL NAVIGATION ====================

  /// Navigate to home page
  void goToHome() {
    Log.d('$_tag: Navigating to home');
    _appCoordinator.goToHome();
  }

  /// Navigate to login page
  void goToLogin() {
    Log.d('$_tag: Navigating to login');
    _appCoordinator.goToLogin();
  }

  /// Navigate to profile page
  void goToProfile() {
    Log.d('$_tag: Navigating to profile');
    _appCoordinator.goToProfile();
  }

  /// Navigate to settings page
  void goToSettings() {
    Log.d('$_tag: Navigating to settings');
    _appCoordinator.goToSettings();
  }

  /// Navigate to error page
  void goToError() {
    Log.d('$_tag: Navigating to error page');
    _appCoordinator.goToError();
  }

  // ==================== AUTHENTICATION STATE ====================

  /// Check if user is authenticated
  bool get isAuthenticated => _authFeatureCoordinator.isAuthenticated;

  /// Get current user email
  String? get currentUserEmail => _authFeatureCoordinator.currentUserEmail;

  /// Get current user full name
  String? get currentUserFullName =>
      _authFeatureCoordinator.currentUserFullName;

  /// Get current user ID
  int? get currentUserId => _authFeatureCoordinator.currentUserId;

  /// Get current organization ID
  int? get currentOrgId => _authFeatureCoordinator.currentOrgId;

  // ==================== UTILITY METHODS ====================

  /// Show a snackbar message
  void showSnackBar(String message, {bool isError = false}) {
    _appCoordinator.showSnackBar(message, isError: isError);
  }

  /// Show a dialog
  Future<T?> showDialog<T extends Object?>({
    required String title,
    required String content,
    String? confirmText,
    String? cancelText,
    bool barrierDismissible = true,
  }) async {
    return await _appCoordinator.showAppDialog<T>(
      title: title,
      content: content,
      confirmText: confirmText,
      cancelText: cancelText,
      barrierDismissible: barrierDismissible,
    );
  }

  /// Get current location
  String get currentLocation => _appCoordinator.currentLocation;

  /// Get current route name
  String? get currentRouteName => _appCoordinator.currentRouteName;

  /// Check if can pop
  bool get canPop => _appCoordinator.canPop();

  /// Pop the current route
  void pop<T extends Object?>([T? result]) {
    _appCoordinator.pop(result);
  }

  /// Push a new route
  Future<T?> push<T extends Object?>(String path, {Object? extra}) {
    return _appCoordinator.push<T>(path, extra: extra);
  }

  /// Replace current route
  void replace(String path, {Object? extra}) {
    _appCoordinator.replace(path, extra: extra);
  }

  // ==================== FEATURE-SPECIFIC METHODS ====================

  /// Handle successful login
  void onLoginSuccess() {
    Log.d('$_tag: Handling login success');
    _authFeatureCoordinator.onLoginSuccess();
    _appCoordinator.onLoginSuccess();
  }

  /// Handle login failure
  void onLoginFailure(String message) {
    Log.d('$_tag: Handling login failure: $message');
    _authFeatureCoordinator.onLoginFailure(message);
  }

  /// Handle logout
  void onLogout() {
    Log.d('$_tag: Handling logout');
    _authFeatureCoordinator.onLogout();
  }

  /// Handle logout failure
  void onLogoutFailure(String message) {
    Log.d('$_tag: Handling logout failure: $message');
    _authFeatureCoordinator.onLogoutFailure(message);
  }

  /// Get current user data
  Map<String, dynamic>? getCurrentUserData() {
    return _userCoordinator.getCurrentUserData();
  }

  /// Navigate to course list
  void goToCourseList() {
    Log.d('$_tag: Navigating to course list');
    _courseCoordinator.goToCourseList();
  }

  /// Navigate to course detail
  void goToCourseDetail(String courseId) {
    Log.d('$_tag: Navigating to course detail: $courseId');
    _courseCoordinator.goToCourseDetail(courseId);
  }

  // ==================== STATE MANAGEMENT ====================

  /// Check if user is enrolled in course
  bool isEnrolledInCourse(String courseId) {
    return _courseCoordinator.isEnrolledInCourse(courseId);
  }

  /// Check if course is completed
  bool isCourseCompleted(String courseId) {
    return _courseCoordinator.isCourseCompleted(courseId);
  }

  /// Check if quiz is available
  bool isQuizAvailable(String courseId) {
    return _courseCoordinator.isQuizAvailable(courseId);
  }

  /// Check if certificate is available
  bool isCertificateAvailable(String courseId) {
    return _courseCoordinator.isCertificateAvailable(courseId);
  }

  // ==================== DISPOSAL ====================

  /// Dispose all coordinators
  void dispose() {
    Log.d('$_tag: Disposing all coordinators...');
    // Add any cleanup logic here if needed
  }
}
