import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:core_students/core_students.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_base/src/navigator/base_navigator.dart';

import '../../feature_home.dart';

/// Feature coordinator for home module
@injectable
class HomeFeatureCoordinator extends FeatureModuleCoordinator
    implements BaseCoordinatorNavigator {
  static const String _tag = 'HomeFeatureCoordinator';

  @override
  List<RouteBase> get routes => [
    // Dashboard route (main tab bar)
    GoRoute(
      path: HomeRoutes.dashboard.path,
      name: HomeRoutes.dashboard.name,
      builder: (context, state) => BlocProvider(
        create: (context) => getIt<HomeBloc>()..add(const LoadHomeDataEvent()),
        child: const DashboardPage(),
      ),
    ),

    // Student review route
    GoRoute(
      path: HomeRoutes.studentReview.path,
      name: HomeRoutes.studentReview.name,
      builder: (context, state) => BlocProvider(
        create: (context) => getIt<StudentReviewBloc>(),
        child: const StudentReviewPage(),
      ),
    ),

    // Student profile route
    GoRoute(
      path: HomeRoutes.studentProfile.path,
      name: HomeRoutes.studentProfile.name,
      builder: (context, state) => BlocProvider(
        create: (context) => getIt<StudentProfileBloc>(),
        child: const StudentProfilePage(),
      ),
    ),

    // Academic & Policy route
    GoRoute(
      path: HomeRoutes.academicPolicy.path,
      name: HomeRoutes.academicPolicy.name,
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        final refId = extra?['refId'] as String?;
        final studentId = extra?['studentId'] as int?;

        if (refId == null || studentId == null) {
          return const Scaffold(
            body: Center(child: Text('Invalid parameters')),
          );
        }

        return BlocProvider(
          create: (context) => getIt<AcademicPolicyBloc>(),
          child: AcademicPolicyPage(refId: refId, studentId: studentId),
        );
      },
    ),

    // Health Information route
    GoRoute(
      path: HomeRoutes.healthInformation.path,
      name: HomeRoutes.healthInformation.name,
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        final refId = extra?['refId'] as String?;
        final studentId = extra?['studentId'] as int?;

        if (refId == null || studentId == null) {
          return const Scaffold(
            body: Center(child: Text('Invalid parameters')),
          );
        }

        return BlocProvider(
          create: (context) => getIt<HealthInformationBloc>(),
          child: HealthInformationPage(refId: refId, studentId: studentId),
        );
      },
    ),

    // Student Information route
    GoRoute(
      path: HomeRoutes.studentInformation.path,
      name: HomeRoutes.studentInformation.name,
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        final refId = extra?['refId'] as String?;
        final studentId = extra?['studentId'] as int?;

        if (refId == null || studentId == null) {
          return const Scaffold(
            body: Center(child: Text('Invalid parameters')),
          );
        }

        return BlocProvider(
          create: (context) => getIt<StudentInformationBloc>(),
          child: StudentInformationPage(refId: refId, studentId: studentId),
        );
      },
    ),
  ];

  // ==================== HOME NAVIGATION METHODS ====================

  /// Navigate to home dashboard
  void navigateToDashboard(BuildContext context) {
    Log.d('$_tag: Navigating to home dashboard');
    context.go(HomeRoutes.dashboard.path);
  }

  /// Navigate to student review
  void navigateToStudentReview(BuildContext context) {
    Log.d('$_tag: Navigating to student review');
    context.go(HomeRoutes.studentReview.path);
  }

  /// Navigate to student profile
  void navigateToStudentProfile(BuildContext context) {
    Log.d('$_tag: Navigating to student profile');
    context.go(HomeRoutes.studentProfile.path);
  }

  /// Navigate to academic & policy
  void navigateToAcademicPolicy(
    BuildContext context,
    String refId,
    int studentId,
  ) {
    Log.d('$_tag: Navigating to academic & policy');
    context.push(
      HomeRoutes.academicPolicy.path,
      extra: {'refId': refId, 'studentId': studentId},
    );
  }

  /// Navigate to health information
  void navigateToHealthInformation(
    BuildContext context,
    String refId,
    int studentId,
  ) {
    Log.d('$_tag: Navigating to health information');
    context.push(
      HomeRoutes.healthInformation.path,
      extra: {'refId': refId, 'studentId': studentId},
    );
  }

  /// Navigate to student information
  void navigateToStudentInformation(
    BuildContext context,
    String refId,
    int studentId,
  ) {
    Log.d('$_tag: Navigating to student information');
    context.push(
      HomeRoutes.studentInformation.path,
      extra: {'refId': refId, 'studentId': studentId},
    );
  }

  // ==================== LEGACY NAVIGATION METHODS (for backward compatibility) ====================

  /// Navigate to profile page
  void goToProfile() {
    Log.d('$_tag: Navigating to profile');
    // This will be handled by the app coordinator
  }

  /// Navigate to settings page
  void goToSettings() {
    Log.d('$_tag: Navigating to settings');
    // This will be handled by the app coordinator
  }

  /// Navigate to courses page
  void goToCourses() {
    Log.d('$_tag: Navigating to courses');
    // This will be handled by the app coordinator
  }

  /// Navigate to notifications page
  void goToNotifications() {
    Log.d('$_tag: Navigating to notifications');
    // This will be handled by the app coordinator
  }

  // ==================== UTILITY METHODS ====================

  /// Get user data
  Map<String, dynamic>? getUserData() {
    return AuthStorage.getUserData();
  }

  /// Check if user is authenticated
  bool get isAuthenticated => AuthStorage.isAuthenticated;

  /// Get current user email
  String? get currentUserEmail => AuthStorage.getUserEmail();

  /// Get current user full name
  String? get currentUserFullName => AuthStorage.getUserFullName();

  /// Get current user ID
  int? get currentUserId => AuthStorage.getUserId();

  /// Get current organization ID
  int? get currentOrgId => AuthStorage.getOrgId();
}
