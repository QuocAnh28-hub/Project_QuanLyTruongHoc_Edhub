import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_storage/core_storage.dart' hide getIt;

/// Global interceptor to handle authentication errors (401) and other global errors
class GlobalErrorInterceptor extends Interceptor {
  static const String _tag = 'GlobalErrorInterceptor';

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    Log.d(
      '$_tag: Intercepting error: ${err.type} - ${err.response?.statusCode}',
    );

    // Handle 401 Unauthorized errors
    if (err.response?.statusCode == 401) {
      Log.d('$_tag: Detected 401 error - handling authentication failure');
      _handleAuthenticationFailure();
    }

    // Continue with the error handling
    handler.next(err);
  }

  /// Handle authentication failure by clearing auth data and navigating to login
  void _handleAuthenticationFailure() {
    try {
      // Clear authentication data
      _clearAuthData();

      // Navigate to login page directly
      _navigateToLogin();

      Log.d(
        '$_tag: Successfully handled 401 error - cleared auth data and navigated to login',
      );
    } catch (e) {
      Log.e('$_tag: Error handling 401 response: $e');
    }
  }

  /// Clear authentication data from storage
  void _clearAuthData() {
    try {
      // Get AppPreferences from DI and clear auth data
      final appPreferences = getIt<AppPreferences>();
      appPreferences.logout();
      Log.d('$_tag: Authentication data cleared from storage');
    } catch (e) {
      Log.e('$_tag: Failed to clear auth data: $e');
    }
  }

  /// Navigate to login page using GoRouter
  void _navigateToLogin() {
    try {
      final context = GlobalVariable.navState.currentContext;
      if (context != null) {
        Log.d('$_tag: Navigating to login page using GoRouter');
        // Use GoRouter to navigate to login and clear the stack
        GoRouter.of(context).go('/login');
      } else {
        Log.d('$_tag: No navigator context available for navigation');
      }
    } catch (e) {
      Log.e('$_tag: Failed to navigate to login: $e');
    }
  }
}
