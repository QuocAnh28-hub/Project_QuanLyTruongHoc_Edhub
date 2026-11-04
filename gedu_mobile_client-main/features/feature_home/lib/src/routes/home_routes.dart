import 'package:lib_base/lib_base.dart';

/// Home feature routes
class HomeRoutes {
  const HomeRoutes();

  /// Dashboard route (main tab bar)
  static final AppRoute dashboard = AppRoute(
    path: '/dashboard',
    name: 'dashboard',
  );

  /// Home route
  static final AppRoute home = AppRoute(path: '/home', name: 'home');

  /// Student review route
  static final AppRoute studentReview = AppRoute(
    path: '/student-review',
    name: 'student-review',
  );

  /// Profile route
  static final AppRoute profile = AppRoute(path: '/profile', name: 'profile');

  /// Settings route
  static final AppRoute settings = AppRoute(
    path: '/settings',
    name: 'settings',
  );

  /// Courses route
  static final AppRoute courses = AppRoute(path: '/courses', name: 'courses');

  /// Notifications route
  static final AppRoute notifications = AppRoute(
    path: '/notifications',
    name: 'notifications',
  );

  /// Student profile route
  static final AppRoute studentProfile = AppRoute(
    path: '/student-profile',
    name: 'student-profile',
  );

  /// Academic & Policy route
  static final AppRoute academicPolicy = AppRoute(
    path: '/academic-policy',
    name: 'academic-policy',
  );

  /// Health Information route
  static final AppRoute healthInformation = AppRoute(
    path: '/health-information',
    name: 'health-information',
  );

  /// Student Information route
  static final AppRoute studentInformation = AppRoute(
    path: '/student-information',
    name: 'student-information',
  );

  List<AppRoute> get all => [
    home,
    studentReview,
    profile,
    settings,
    courses,
    notifications,
    studentProfile,
    academicPolicy,
    healthInformation,
    studentInformation,
  ];
}

/// Route configuration class for home feature
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
