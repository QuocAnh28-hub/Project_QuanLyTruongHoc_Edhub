import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:provider/provider.dart';
import 'package:lib_base/lib_base.dart' show getIt;
import 'package:feature_auth/feature_auth.dart' as feature_auth;
import 'package:feature_home/feature_home.dart' as feature_home;

import '../config/flavor_config.dart';
import 'routes/app_routes.dart';

/// Main application coordinator that manages navigation and feature coordination
@singleton
class AppCoordinator extends FeatureModuleCoordinator {
  static const String _tag = 'AppCoordinator';

  late final GoRouter _router;
  late final GlobalKey<NavigatorState> _navigatorKey;

  // Feature coordinators
  final feature_auth.AuthFeatureCoordinator _authFeatureCoordinator;
  final feature_home.HomeFeatureCoordinator _homeFeatureCoordinator;
  final feature_home.ProfileFeatureCoordinator _profileFeatureCoordinator;

  // Language management
  final ValueNotifier<Locale> _currentLocale = ValueNotifier<Locale>(
    Locale(AuthStorage.getSelectedLanguage(), ''),
  );

  AppCoordinator(
    this._authFeatureCoordinator,
    this._homeFeatureCoordinator,
    this._profileFeatureCoordinator,
  );

  /// Initialize the app coordinator
  void initialize() {
    Log.d('$_tag: Initializing app coordinator...');

    _navigatorKey = GlobalVariable.navState;
    _router = _createRouter();

    // Check if app was killed during onboarding and clear data if needed
    _checkAndClearOnboardingData();

    // Set up language change callback for auth coordinator
    _setupAuthCoordinatorCallbacks();

    Log.d('$_tag: App coordinator initialized successfully');
  }

  /// Set up callbacks for auth coordinator
  void _setupAuthCoordinatorCallbacks() {
    // Set the language change callback in auth coordinator
    _authFeatureCoordinator.setLanguageChangeCallback(changeLanguage);
  }

  /// Check if app was killed during onboarding and clear data if needed
  void _checkAndClearOnboardingData() {
    try {
      final isInOnboarding = AuthStorage.getOnboardingState();
      if (isInOnboarding) {
        Log.d('$_tag: App was killed during onboarding - clearing all data');
        AuthStorage.logout();
        AuthStorage.clearOnboardingState();
        Log.d('$_tag: All data cleared due to app kill during onboarding');
      }
    } catch (e) {
      Log.e('$_tag: Error checking onboarding state: $e');
    }
  }

  /// Get the navigator key
  GlobalKey<NavigatorState> get navigatorKey => _navigatorKey;

  /// Get the router instance
  GoRouter get router => _router;

  /// Create the main router configuration
  GoRouter _createRouter() {
    return GoRouter(
      navigatorKey: _navigatorKey,
      initialLocation: AppRoutes.initial.path,
      debugLogDiagnostics: FlavorConfig.currentSync.enableLogging,
      redirect: _handleRedirect,
      routes: _buildRoutes(),
      errorBuilder: (context, state) => _buildErrorPage(context, state),
    );
  }

  /// Handle route redirection based on authentication status and password change
  String? _handleRedirect(BuildContext context, GoRouterState state) {
    final isAuthenticated = AuthStorage.isAuthenticated;
    final passwordChanged = AuthStorage.getPasswordChanged();
    final rememberMeEnabled = AuthStorage.getRememberMeStatus();
    final studentReviewConfirmed = AuthStorage.getStudentReviewConfirmed();
    final isLoginRoute = state.matchedLocation == AppRoutes.login.path;
    final isOnboardingRoute =
        state.matchedLocation == feature_auth.AuthRoutes.onboarding.path;
    final isInitialRoute = state.matchedLocation == AppRoutes.initial.path;
    final isHomeRoute = state.matchedLocation == AppRoutes.home.path;
    final isDashboardRoute =
        state.matchedLocation == feature_home.HomeRoutes.dashboard.path;
    final isStudentReviewRoute =
        state.matchedLocation == feature_home.HomeRoutes.studentReview.path;
    final isChangePasswordRoute =
        state.matchedLocation == feature_auth.AuthRoutes.changePassword.path;
    final isChangePasswordSuccessRoute =
        state.matchedLocation ==
        feature_auth.AuthRoutes.changePasswordSuccess.path;

    Log.d(
      '$_tag: Redirect check - Authenticated: $isAuthenticated, PasswordChanged: $passwordChanged, RememberMe: $rememberMeEnabled, StudentReviewConfirmed: $studentReviewConfirmed, Route: ${state.matchedLocation}',
    );

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated &&
        !isLoginRoute &&
        !isOnboardingRoute &&
        !isInitialRoute &&
        !isChangePasswordRoute &&
        !isChangePasswordSuccessRoute) {
      // If remember me is enabled, go to login instead of onboarding
      if (rememberMeEnabled) {
        Log.d(
          '$_tag: Redirecting to login - user not authenticated but remember me enabled',
        );
        return AppRoutes.login.path;
      } else {
        Log.d('$_tag: Redirecting to onboarding - user not authenticated');
        return feature_auth.AuthRoutes.onboarding.path;
      }
    }

    // If user is authenticated but password not changed, sign them out and redirect to onboarding
    if (isAuthenticated &&
        !passwordChanged &&
        !isChangePasswordRoute &&
        !isChangePasswordSuccessRoute &&
        !isOnboardingRoute &&
        !isLoginRoute) {
      Log.d(
        '$_tag: User authenticated but password not changed - signing out and redirecting to onboarding',
      );
      // Sign out the user
      AuthStorage.logout();
      return feature_auth.AuthRoutes.onboarding.path;
    }

    // If user is authenticated, password changed, but student review not confirmed, redirect to student review
    if (isAuthenticated &&
        passwordChanged &&
        !studentReviewConfirmed &&
        !isStudentReviewRoute &&
        !isChangePasswordRoute &&
        !isChangePasswordSuccessRoute &&
        !isOnboardingRoute &&
        !isLoginRoute) {
      Log.d(
        '$_tag: User authenticated and password changed but student review not confirmed - redirecting to student review',
      );
      return feature_home.HomeRoutes.studentReview.path;
    }

    // If user is authenticated, password changed, student review confirmed, and on login/onboarding/change password/student review pages, redirect to dashboard
    // Note: We exclude changePasswordSuccessRoute to allow the 5-second countdown to complete
    if (isAuthenticated &&
        passwordChanged &&
        studentReviewConfirmed &&
        (isLoginRoute || isOnboardingRoute || isStudentReviewRoute)) {
      Log.d(
        '$_tag: Redirecting to dashboard - user authenticated, password changed, and student review confirmed',
      );
      return feature_home.HomeRoutes.dashboard.path;
    }

    // If user is on dashboard route and properly authenticated, allow them to stay
    if (isDashboardRoute &&
        isAuthenticated &&
        passwordChanged &&
        studentReviewConfirmed) {
      Log.d(
        '$_tag: User on dashboard route and properly authenticated - allowing access',
      );
      // Clear onboarding state since user has successfully completed onboarding
      AuthStorage.clearOnboardingState();
      return null; // No redirect needed
    }

    // If user is on home route and properly authenticated, redirect to dashboard
    if (isHomeRoute &&
        isAuthenticated &&
        passwordChanged &&
        studentReviewConfirmed) {
      Log.d(
        '$_tag: User on home route and properly authenticated - redirecting to dashboard',
      );
      return feature_home.HomeRoutes.dashboard.path;
    }

    // If on initial route and authenticated with password changed and student review confirmed, redirect to dashboard
    if (isInitialRoute &&
        isAuthenticated &&
        passwordChanged &&
        studentReviewConfirmed) {
      Log.d('$_tag: Redirecting to dashboard from initial route');
      return feature_home.HomeRoutes.dashboard.path;
    }

    // If on initial route and authenticated with password changed but student review not confirmed, redirect to student review
    if (isInitialRoute &&
        isAuthenticated &&
        passwordChanged &&
        !studentReviewConfirmed) {
      Log.d('$_tag: Redirecting to student review from initial route');
      return feature_home.HomeRoutes.studentReview.path;
    }

    // If on initial route and authenticated but password not changed, sign out and redirect to onboarding
    if (isInitialRoute && isAuthenticated && !passwordChanged) {
      Log.d(
        '$_tag: User authenticated but password not changed on initial route - signing out and redirecting to onboarding',
      );
      // Sign out the user
      AuthStorage.logout();
      return feature_auth.AuthRoutes.onboarding.path;
    }

    // If on initial route and not authenticated, check remember me status
    if (isInitialRoute && !isAuthenticated) {
      if (rememberMeEnabled) {
        Log.d(
          '$_tag: Redirecting to login from initial route - remember me enabled',
        );
        return AppRoutes.login.path;
      } else {
        Log.d('$_tag: Redirecting to onboarding from initial route');
        return feature_auth.AuthRoutes.onboarding.path;
      }
    }

    return null; // No redirect needed
  }

  /// Build the route configuration by aggregating routes from feature coordinators
  List<RouteBase> _buildRoutes() {
    return [
      // Initial route (splash/loading) - app-level route
      GoRoute(
        path: AppRoutes.initial.path,
        name: AppRoutes.initial.name,
        builder: (context, state) => _buildInitialPage(),
      ),

      // Login route - app-level route
      GoRoute(
        path: AppRoutes.login.path,
        name: AppRoutes.login.name,
        builder: (context, state) => MultiProvider(
          providers: [
            BlocProvider<feature_auth.AuthBloc>(
              create: (context) => getIt.get<feature_auth.AuthBloc>(),
            ),
            Provider<feature_auth.AuthFeatureCoordinator>(
              create: (context) =>
                  getIt.get<feature_auth.AuthFeatureCoordinator>(),
            ),
          ],
          child: const feature_auth.LoginPage(),
        ),
      ),

      // Profile route - app-level route
      GoRoute(
        path: AppRoutes.profile.path,
        name: AppRoutes.profile.name,
        builder: (context, state) => _buildProfilePage(context, state),
      ),

      // Settings route - app-level route
      GoRoute(
        path: AppRoutes.settings.path,
        name: AppRoutes.settings.name,
        builder: (context, state) => _buildSettingsPage(context, state),
      ),

      // Error route
      GoRoute(
        path: AppRoutes.error.path,
        name: AppRoutes.error.name,
        builder: (context, state) => _buildErrorPage(context, state),
      ),

      // Aggregate routes from feature coordinators
      ..._authFeatureCoordinator.routes,
      ..._homeFeatureCoordinator.routes,
      ..._profileFeatureCoordinator.routes,
    ];
  }

  /// Build the initial page (splash/loading)
  Widget _buildInitialPage() {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(
              color: _getFlavorColor(FlavorConfig.currentSync.flavor),
            ),
            const SizedBox(height: 16),
            Text(
              'Loading...',
              style: Theme.of(
                navigatorKey.currentContext!,
              ).textTheme.titleMedium,
            ),
          ],
        ),
      ),
    );
  }

  /// Build the profile page
  Widget _buildProfilePage(BuildContext context, GoRouterState state) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(child: Text('Profile Page - Coming Soon!')),
    );
  }

  /// Build the settings page
  Widget _buildSettingsPage(BuildContext context, GoRouterState state) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(child: Text('Settings Page - Coming Soon!')),
    );
  }

  /// Build the error page
  Widget _buildErrorPage(BuildContext context, GoRouterState state) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Error'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Theme.of(context).colorScheme.error,
            ),
            const SizedBox(height: 16),
            Text(
              'Page Not Found',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'The page you are looking for does not exist.',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => goToHome(),
              child: const Text('Go to Home'),
            ),
          ],
        ),
      ),
    );
  }

  /// Get flavor color
  Color _getFlavorColor(Flavor flavor) {
    switch (flavor) {
      case Flavor.development:
        return Colors.orange;
      case Flavor.staging:
        return Colors.blue;
      case Flavor.production:
        return Colors.green;
    }
  }

  // ==================== NAVIGATION METHODS ====================

  /// Navigate to home page
  void goToHome() {
    Log.d('$_tag: Navigating to home');
    _router.go(AppRoutes.home.path);
  }

  /// Navigate to login page
  void goToLogin() {
    Log.d('$_tag: Navigating to login');
    _router.go(AppRoutes.login.path);
  }

  /// Navigate to onboarding page
  void goToOnboarding() {
    Log.d('$_tag: Navigating to onboarding');
    _router.go(feature_auth.AuthRoutes.onboarding.path);
  }

  /// Navigate to profile page
  void goToProfile() {
    Log.d('$_tag: Navigating to profile');
    _homeFeatureCoordinator.goToProfile();
    _router.go(AppRoutes.profile.path);
  }

  /// Navigate to settings page
  void goToSettings() {
    Log.d('$_tag: Navigating to settings');
    _homeFeatureCoordinator.goToSettings();
    _router.go(AppRoutes.settings.path);
  }

  /// Navigate to courses page
  void goToCourses() {
    Log.d('$_tag: Navigating to courses');
    _homeFeatureCoordinator.goToCourses();
    // TODO: Add courses route when implemented
  }

  /// Navigate to notifications page
  void goToNotifications() {
    Log.d('$_tag: Navigating to notifications');
    _homeFeatureCoordinator.goToNotifications();
    // TODO: Add notifications route when implemented
  }

  /// Navigate to error page
  void goToError() {
    Log.d('$_tag: Navigating to error page');
    _router.go(AppRoutes.error.path);
  }

  /// Push a new route
  Future<T?> push<T extends Object?>(String path, {Object? extra}) {
    Log.d('$_tag: Pushing route: $path');
    return _router.push<T>(path, extra: extra);
  }

  /// Replace current route
  void replace(String path, {Object? extra}) {
    Log.d('$_tag: Replacing route: $path');
    _router.replace(path, extra: extra);
  }

  /// Pop the current route
  void pop<T extends Object?>([T? result]) {
    Log.d('$_tag: Popping route');
    _router.pop(result);
  }

  /// Check if can pop
  bool canPop() {
    return _router.canPop();
  }

  /// Get current location
  String get currentLocation =>
      _router.routerDelegate.currentConfiguration.last.matchedLocation;

  /// Get current route name
  String? get currentRouteName {
    final route = _router.routerDelegate.currentConfiguration.last;
    return route.route.name;
  }

  // ==================== AUTHENTICATION METHODS ====================

  /// Handle successful login
  void onLoginSuccess() {
    Log.d('$_tag: Login successful, navigating to home');
    _authFeatureCoordinator.onLoginSuccess();
  }

  /// Handle logout
  void onLogout() {
    Log.d('$_tag: Logout, navigating to login');
    goToLogin();
  }

  /// Check if user is authenticated
  bool get isAuthenticated => AuthStorage.isAuthenticated;

  // ==================== LANGUAGE MANAGEMENT ====================

  /// Get current locale notifier
  ValueNotifier<Locale> get currentLocale => _currentLocale;

  /// Change app language immediately
  Future<void> changeLanguage(String languageCode) async {
    try {
      Log.d('$_tag: Changing language to: $languageCode');

      // Save language to storage
      final saved = await AuthStorage.saveSelectedLanguage(languageCode);
      if (!saved) {
        Log.e('$_tag: Failed to save language to storage');
        return;
      }

      // Update current locale
      _currentLocale.value = Locale(languageCode, '');

      Log.d('$_tag: Language changed successfully to: $languageCode');

      // Show success message
      showSnackBar('Language changed successfully');
    } catch (e) {
      Log.e('$_tag: Error changing language: $e');
      showSnackBar('Failed to change language', isError: true);
    }
  }

  /// Get current language code
  String get currentLanguageCode => _currentLocale.value.languageCode;

  // ==================== UTILITY METHODS ====================

  /// Get current context
  BuildContext? get currentContext => _navigatorKey.currentContext;

  /// Show a snackbar
  void showSnackBar(String message, {bool isError = false}) {
    final context = currentContext;
    if (context != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: isError
              ? Theme.of(context).colorScheme.error
              : Theme.of(context).colorScheme.primary,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  /// Show a dialog
  Future<T?> showAppDialog<T extends Object?>({
    required String title,
    required String content,
    String? confirmText,
    String? cancelText,
    bool barrierDismissible = true,
  }) async {
    final context = currentContext;
    if (context == null) return null;

    return showDialog<T>(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(content),
          actions: [
            if (cancelText != null)
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text(cancelText),
              ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text(confirmText ?? 'OK'),
            ),
          ],
        );
      },
    );
  }

  // ==================== CROSS-FEATURE COORDINATION METHODS ====================

  /// Navigate to change password from profile (cross-feature coordination)
  void navigateToChangePasswordFromProfile(BuildContext context) {
    Log.d('$_tag: Coordinating change password navigation from profile');
    _authFeatureCoordinator.navigateToChangePassword(
      context,
      isFirstTimeLogin: false,
    );
  }

  /// Navigate to login (cross-feature coordination)
  void navigateToLogin(BuildContext context) {
    Log.d('$_tag: Coordinating login navigation');
    _authFeatureCoordinator.navigateToLogin(context);
  }

  /// Navigate to onboarding (cross-feature coordination)
  void navigateToOnboarding(BuildContext context) {
    Log.d('$_tag: Coordinating onboarding navigation');
    _authFeatureCoordinator.navigateToOnboarding(context);
  }

  /// Navigate to dashboard (cross-feature coordination)
  void navigateToDashboard(BuildContext context) {
    Log.d('$_tag: Coordinating dashboard navigation');
    _homeFeatureCoordinator.navigateToDashboard(context);
  }

  /// Navigate to student review (cross-feature coordination)
  void navigateToStudentReview(BuildContext context) {
    Log.d('$_tag: Coordinating student review navigation');
    _homeFeatureCoordinator.navigateToStudentReview(context);
  }

  // ==================== LEGACY METHODS (for backward compatibility) ====================

  @override
  List<RouteBase> get routes => [];
}
