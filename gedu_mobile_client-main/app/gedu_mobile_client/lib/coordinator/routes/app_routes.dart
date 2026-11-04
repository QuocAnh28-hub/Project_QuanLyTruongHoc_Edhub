import 'package:lib_base/lib_base.dart';

/// Application routes configuration
class AppRoutes {
  static const String _tag = 'AppRoutes';

  // ==================== ROUTE PATHS ====================

  /// Initial route (splash/loading)
  static final AppRoute initial = AppRoute(path: '/', name: 'initial');

  /// Login route
  static final AppRoute login = AppRoute(path: '/login', name: 'login');

  /// Home route
  static final AppRoute home = AppRoute(path: '/home', name: 'home');

  /// Profile route
  static final AppRoute profile = AppRoute(path: '/profile', name: 'profile');

  /// Settings route
  static final AppRoute settings = AppRoute(
    path: '/settings',
    name: 'settings',
  );

  /// Error route
  static final AppRoute error = AppRoute(path: '/error', name: 'error');

  // ==================== FEATURE ROUTES ====================

  /// Auth feature routes
  static const AuthRoutes auth = AuthRoutes();

  /// User feature routes
  static const UserRoutes user = UserRoutes();

  /// Course feature routes
  static const CourseRoutes course = CourseRoutes();

  // ==================== UTILITY METHODS ====================

  /// Get all routes
  static List<AppRoute> get all => [
    initial,
    login,
    home,
    profile,
    settings,
    error,
    ...auth.all,
    ...user.all,
    ...course.all,
  ];

  /// Find route by path
  static AppRoute? findByPath(String path) {
    try {
      return all.firstWhere((route) => route.path == path);
    } catch (e) {
      Log.d('$_tag: Route not found for path: $path');
      return null;
    }
  }

  /// Find route by name
  static AppRoute? findByName(String name) {
    try {
      return all.firstWhere((route) => route.name == name);
    } catch (e) {
      Log.d('$_tag: Route not found for name: $name');
      return null;
    }
  }

  /// Check if path is valid
  static bool isValidPath(String path) {
    return findByPath(path) != null;
  }

  /// Check if name is valid
  static bool isValidName(String name) {
    return findByName(name) != null;
  }
}

/// Route configuration class
class AppRoute extends FeatureModulePath {
  final String path;
  final String name;
  final Map<String, String>? parameters;
  final Object? extra;

  AppRoute({
    required this.path,
    required this.name,
    this.parameters,
    this.extra,
  });

  @override
  String get fullPath => path;

  /// Get route with parameters
  AppRoute withParameters(Map<String, String> parameters) {
    return AppRoute(
      path: path,
      name: name,
      parameters: parameters,
      extra: extra,
    );
  }

  /// Get route with extra data
  AppRoute withExtra(Object extra) {
    return AppRoute(
      path: path,
      name: name,
      parameters: parameters,
      extra: extra,
    );
  }

  @override
  String toString() {
    return 'AppRoute(path: $path, name: $name)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AppRoute && other.path == path && other.name == name;
  }

  @override
  int get hashCode => path.hashCode ^ name.hashCode;
}

/// Auth feature routes
class AuthRoutes {
  const AuthRoutes();

  /// Login route
  AppRoute get login => AppRoutes.login;

  /// Logout route
  static final AppRoute logout = AppRoute(
    path: '/auth/logout',
    name: 'auth_logout',
  );

  /// Register route
  static final AppRoute register = AppRoute(
    path: '/auth/register',
    name: 'auth_register',
  );

  /// Forgot password route
  static final AppRoute forgotPassword = AppRoute(
    path: '/auth/forgot-password',
    name: 'auth_forgot_password',
  );

  /// Reset password route
  static final AppRoute resetPassword = AppRoute(
    path: '/auth/reset-password',
    name: 'auth_reset_password',
  );

  /// Verify email route
  static final AppRoute verifyEmail = AppRoute(
    path: '/auth/verify-email',
    name: 'auth_verify_email',
  );

  List<AppRoute> get all => [
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
  ];
}

/// User feature routes
class UserRoutes {
  const UserRoutes();

  /// Profile route
  AppRoute get profile => AppRoutes.profile;

  /// Edit profile route
  static final AppRoute editProfile = AppRoute(
    path: '/user/edit-profile',
    name: 'user_edit_profile',
  );

  // Change password route is handled by feature_auth module
  // static final AppRoute changePassword = AppRoute(
  //   path: '/user/change-password',
  //   name: 'user_change_password',
  // );

  /// User settings route
  static final AppRoute userSettings = AppRoute(
    path: '/user/settings',
    name: 'user_settings',
  );

  /// User preferences route
  static final AppRoute userPreferences = AppRoute(
    path: '/user/preferences',
    name: 'user_preferences',
  );

  List<AppRoute> get all => [
    profile,
    editProfile,
    userSettings,
    userPreferences,
  ];
}

/// Course feature routes
class CourseRoutes {
  const CourseRoutes();

  /// Course list route
  static final AppRoute courseList = AppRoute(
    path: '/courses',
    name: 'course_list',
  );

  /// Course detail route
  static final AppRoute courseDetail = AppRoute(
    path: '/courses/:id',
    name: 'course_detail',
  );

  /// Course enrollment route
  static final AppRoute courseEnrollment = AppRoute(
    path: '/courses/:id/enroll',
    name: 'course_enrollment',
  );

  /// Course progress route
  static final AppRoute courseProgress = AppRoute(
    path: '/courses/:id/progress',
    name: 'course_progress',
  );

  /// Course content route
  static final AppRoute courseContent = AppRoute(
    path: '/courses/:id/content',
    name: 'course_content',
  );

  /// Course quiz route
  static final AppRoute courseQuiz = AppRoute(
    path: '/courses/:id/quiz',
    name: 'course_quiz',
  );

  /// Course certificate route
  static final AppRoute courseCertificate = AppRoute(
    path: '/courses/:id/certificate',
    name: 'course_certificate',
  );

  List<AppRoute> get all => [
    courseList,
    courseDetail,
    courseEnrollment,
    courseProgress,
    courseContent,
    courseQuiz,
    courseCertificate,
  ];

  /// Get course detail route with ID
  AppRoute getCourseDetail(String courseId) {
    return courseDetail.withParameters({'id': courseId});
  }

  /// Get course enrollment route with ID
  AppRoute getCourseEnrollment(String courseId) {
    return courseEnrollment.withParameters({'id': courseId});
  }

  /// Get course progress route with ID
  AppRoute getCourseProgress(String courseId) {
    return courseProgress.withParameters({'id': courseId});
  }

  /// Get course content route with ID
  AppRoute getCourseContent(String courseId) {
    return courseContent.withParameters({'id': courseId});
  }

  /// Get course quiz route with ID
  AppRoute getCourseQuiz(String courseId) {
    return courseQuiz.withParameters({'id': courseId});
  }

  /// Get course certificate route with ID
  AppRoute getCourseCertificate(String courseId) {
    return courseCertificate.withParameters({'id': courseId});
  }
}
