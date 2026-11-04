import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../app_coordinator.dart';
import '../routes/app_routes.dart';

/// Feature coordinator for course module
@injectable
class CourseCoordinator extends FeatureModuleCoordinator {
  static const String _tag = 'CourseCoordinator';

  final AppCoordinator _appCoordinator;

  CourseCoordinator(this._appCoordinator);

  // ==================== NAVIGATION METHODS ====================

  /// Navigate to course list page
  void goToCourseList() {
    Log.d('$_tag: Navigating to course list');
    _appCoordinator.push(CourseRoutes.courseList.path);
  }

  /// Navigate to course detail page
  void goToCourseDetail(String courseId) {
    Log.d('$_tag: Navigating to course detail: $courseId');
    final route = CourseRoutes.courseDetail.withParameters({'id': courseId});
    _appCoordinator.push(route.path);
  }

  /// Navigate to course enrollment page
  void goToCourseEnrollment(String courseId) {
    Log.d('$_tag: Navigating to course enrollment: $courseId');
    final route = CourseRoutes.courseEnrollment.withParameters({
      'id': courseId,
    });
    _appCoordinator.push(route.path);
  }

  /// Navigate to course progress page
  void goToCourseProgress(String courseId) {
    Log.d('$_tag: Navigating to course progress: $courseId');
    final route = CourseRoutes.courseProgress.withParameters({'id': courseId});
    _appCoordinator.push(route.path);
  }

  /// Navigate to course content page
  void goToCourseContent(String courseId) {
    Log.d('$_tag: Navigating to course content: $courseId');
    final route = CourseRoutes.courseContent.withParameters({'id': courseId});
    _appCoordinator.push(route.path);
  }

  /// Navigate to course quiz page
  void goToCourseQuiz(String courseId) {
    Log.d('$_tag: Navigating to course quiz: $courseId');
    final route = CourseRoutes.courseQuiz.withParameters({'id': courseId});
    _appCoordinator.push(route.path);
  }

  /// Navigate to course certificate page
  void goToCourseCertificate(String courseId) {
    Log.d('$_tag: Navigating to course certificate: $courseId');
    final route = CourseRoutes.courseCertificate.withParameters({
      'id': courseId,
    });
    _appCoordinator.push(route.path);
  }

  // ==================== COURSE DATA METHODS ====================

  /// Get course route with parameters
  AppRoute getCourseRoute(String courseId, String routeType) {
    switch (routeType) {
      case 'detail':
        return CourseRoutes.courseDetail.withParameters({'id': courseId});
      case 'enrollment':
        return CourseRoutes.courseEnrollment.withParameters({'id': courseId});
      case 'progress':
        return CourseRoutes.courseProgress.withParameters({'id': courseId});
      case 'content':
        return CourseRoutes.courseContent.withParameters({'id': courseId});
      case 'quiz':
        return CourseRoutes.courseQuiz.withParameters({'id': courseId});
      case 'certificate':
        return CourseRoutes.courseCertificate.withParameters({'id': courseId});
      default:
        return CourseRoutes.courseDetail.withParameters({'id': courseId});
    }
  }

  /// Navigate to course route with parameters
  void goToCourseRoute(String courseId, String routeType) {
    final route = getCourseRoute(courseId, routeType);
    Log.d('$_tag: Navigating to course route: ${route.path}');
    _appCoordinator.push(route.path);
  }

  // ==================== UTILITY METHODS ====================

  /// Show course-related error
  void showCourseError(String message) {
    Log.d('$_tag: Showing course error: $message');
    _appCoordinator.showSnackBar(message, isError: true);
  }

  /// Show course-related success
  void showCourseSuccess(String message) {
    Log.d('$_tag: Showing course success: $message');
    _appCoordinator.showSnackBar(message, isError: false);
  }

  /// Show confirmation dialog for course enrollment
  Future<bool?> showCourseEnrollmentConfirmation(String courseName) async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Enroll in Course',
      content: 'Are you sure you want to enroll in "$courseName"?',
      confirmText: 'Enroll',
      cancelText: 'Cancel',
    );
  }

  /// Show confirmation dialog for course unenrollment
  Future<bool?> showCourseUnenrollmentConfirmation(String courseName) async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Unenroll from Course',
      content: 'Are you sure you want to unenroll from "$courseName"?',
      confirmText: 'Unenroll',
      cancelText: 'Cancel',
    );
  }

  /// Show confirmation dialog for quiz submission
  Future<bool?> showQuizSubmissionConfirmation() async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Submit Quiz',
      content:
          'Are you sure you want to submit your quiz? You cannot change your answers after submission.',
      confirmText: 'Submit',
      cancelText: 'Review',
    );
  }

  /// Show confirmation dialog for course completion
  Future<bool?> showCourseCompletionConfirmation(String courseName) async {
    return await _appCoordinator.showAppDialog<bool>(
      title: 'Complete Course',
      content:
          'Congratulations! You have completed "$courseName". Would you like to view your certificate?',
      confirmText: 'View Certificate',
      cancelText: 'Later',
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

  /// Navigate to profile
  void goToProfile() {
    Log.d('$_tag: Navigating to profile');
    _appCoordinator.goToProfile();
  }

  /// Navigate to settings
  void goToSettings() {
    Log.d('$_tag: Navigating to settings');
    _appCoordinator.goToSettings();
  }

  // ==================== COURSE STATE METHODS ====================

  /// Check if user is enrolled in course
  bool isEnrolledInCourse(String courseId) {
    // TODO: Implement enrollment check logic
    Log.d('$_tag: Checking enrollment for course: $courseId');
    return false;
  }

  /// Check if course is completed
  bool isCourseCompleted(String courseId) {
    // TODO: Implement completion check logic
    Log.d('$_tag: Checking completion for course: $courseId');
    return false;
  }

  /// Check if quiz is available
  bool isQuizAvailable(String courseId) {
    // TODO: Implement quiz availability check logic
    Log.d('$_tag: Checking quiz availability for course: $courseId');
    return false;
  }

  /// Check if certificate is available
  bool isCertificateAvailable(String courseId) {
    // TODO: Implement certificate availability check logic
    Log.d('$_tag: Checking certificate availability for course: $courseId');
    return false;
  }
}
