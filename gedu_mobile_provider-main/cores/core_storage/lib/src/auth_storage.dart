import 'package:get_it/get_it.dart';
import 'package:lib_base/lib_base.dart';

import 'app_preferences.dart';

/// Helper class to access authentication data from anywhere in the app
class AuthStorage {
  static const String _tag = 'AuthStorage';

  /// Get the current authentication token
  static String? getAuthToken() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getAuthToken();
    } catch (e) {
      Log.e('$_tag: Failed to get auth token: $e');
      return null;
    }
  }

  /// Check if user is currently authenticated
  static bool get isAuthenticated {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.isAuthenticated;
    } catch (e) {
      Log.e('$_tag: Failed to check authentication status: $e');
      return false;
    }
  }

  /// Get current user data
  static Map<String, dynamic>? getUserData() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getUserData();
    } catch (e) {
      Log.e('$_tag: Failed to get user data: $e');
      return null;
    }
  }

  /// Get user email
  static String? getUserEmail() {
    try {
      final userData = getUserData();
      return userData?['email'] as String?;
    } catch (e) {
      Log.e('$_tag: Failed to get user email: $e');
      return null;
    }
  }

  /// Get user full name
  static String? getUserFullName() {
    try {
      final userData = getUserData();
      final firstName = userData?['firstName'] as String?;
      final lastName = userData?['lastName'] as String?;

      if (firstName != null && lastName != null) {
        return '$firstName $lastName';
      } else if (firstName != null) {
        return firstName;
      } else if (lastName != null) {
        return lastName;
      }
      return null;
    } catch (e) {
      Log.e('$_tag: Failed to get user full name: $e');
      return null;
    }
  }

  /// Get user phone number
  static String? getUserPhoneNumber() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getUserPhoneNumber();
    } catch (e) {
      Log.e('$_tag: Failed to get user phone number: $e');
      return null;
    }
  }

  /// Get selected student data
  static Map<String, dynamic>? getSelectedStudent() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getSelectedStudent();
    } catch (e) {
      Log.e('$_tag: Failed to get selected student: $e');
      return null;
    }
  }

  /// Get user ID
  static int? getUserId() {
    try {
      final userData = getUserData();
      return userData?['id'] as int?;
    } catch (e) {
      Log.e('$_tag: Failed to get user ID: $e');
      return null;
    }
  }

  /// Get organization ID
  static int? getOrgId() {
    try {
      final userData = getUserData();
      return userData?['orgId'] as int?;
    } catch (e) {
      Log.e('$_tag: Failed to get org ID: $e');
      return null;
    }
  }

  /// Get reference ID
  static int? getRefId() {
    try {
      final userData = getUserData();
      Log.d('$_tag: 🔍 Getting refId from userData: $userData');

      final rawRefId = userData?['refId'];
      Log.d(
        '$_tag: 🔍 Raw refId value: $rawRefId (type: ${rawRefId.runtimeType})',
      );

      int? refId;
      if (rawRefId is int) {
        refId = rawRefId;
      } else if (rawRefId is String) {
        refId = int.tryParse(rawRefId);
        Log.d('$_tag: 🔍 Converted string refId to int: $refId');
      } else if (rawRefId is double) {
        refId = rawRefId.toInt();
        Log.d('$_tag: 🔍 Converted double refId to int: $refId');
      }

      Log.d('$_tag: 🔍 Final refId: $refId');
      return refId;
    } catch (e) {
      Log.e('$_tag: Failed to get ref ID: $e');
      return null;
    }
  }

  /// Clear all authentication data
  static Future<bool> logout() async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.logout();
    } catch (e) {
      Log.e('$_tag: Failed to logout: $e');
      return false;
    }
  }

  /// Save authentication token
  static Future<bool> saveAuthToken(String token) async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.saveAuthToken(token);
    } catch (e) {
      Log.e('$_tag: Failed to save auth token: $e');
      return false;
    }
  }

  /// Clear authentication token
  static Future<bool> clearAuthToken() async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.clearAuthToken();
    } catch (e) {
      Log.e('$_tag: Failed to clear auth token: $e');
      return false;
    }
  }

  /// Save user data
  static Future<bool> saveUserData(Map<String, dynamic> userData) async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.saveUserData(userData);
    } catch (e) {
      Log.e('$_tag: Failed to save user data: $e');
      return false;
    }
  }

  /// Save onboarding state
  static Future<bool> saveOnboardingState(bool isInOnboarding) async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.saveOnboardingState(isInOnboarding);
    } catch (e) {
      Log.e('$_tag: Failed to save onboarding state: $e');
      return false;
    }
  }

  /// Get onboarding state
  static bool getOnboardingState() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getOnboardingState();
    } catch (e) {
      Log.e('$_tag: Failed to get onboarding state: $e');
      return false;
    }
  }

  /// Clear onboarding state
  static Future<bool> clearOnboardingState() async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.clearOnboardingState();
    } catch (e) {
      Log.e('$_tag: Failed to clear onboarding state: $e');
      return false;
    }
  }

  /// Save onboarding completion state
  static Future<bool> saveOnboardingCompleted(bool completed) async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.saveOnboardingCompleted(completed);
    } catch (e) {
      Log.e('$_tag: Failed to save onboarding completion state: $e');
      return false;
    }
  }

  /// Get onboarding completion state
  static bool getOnboardingCompleted() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getOnboardingCompleted();
    } catch (e) {
      Log.e('$_tag: Failed to get onboarding completion state: $e');
      return false;
    }
  }

  /// Save selected language
  static Future<bool> saveSelectedLanguage(String languageCode) async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.saveSelectedLanguage(languageCode);
    } catch (e) {
      Log.e('$_tag: Failed to save selected language: $e');
      return false;
    }
  }

  /// Get selected language
  static String getSelectedLanguage() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getSelectedLanguage();
    } catch (e) {
      Log.e('$_tag: Failed to get selected language: $e');
      return 'vi'; // Default to Vietnamese
    }
  }

  /// Get remember me status
  static bool getRememberMeStatus() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getRememberMeStatus();
    } catch (e) {
      Log.e('$_tag: Failed to get remember me status: $e');
      return false;
    }
  }

  /// Get student review confirmation status
  static bool getStudentReviewConfirmed() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getStudentReviewConfirmed();
    } catch (e) {
      Log.e('$_tag: Failed to get student review confirmed: $e');
      return false;
    }
  }

  /// Save first login completion status
  static Future<bool> saveFirstLoginCompleted(bool completed) async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.saveFirstLoginCompleted(completed);
    } catch (e) {
      Log.e('$_tag: Failed to save first login completed: $e');
      return false;
    }
  }

  /// Get first login completion status
  static bool getFirstLoginCompleted() {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return appPreferences.getFirstLoginCompleted();
    } catch (e) {
      Log.e('$_tag: Failed to get first login completed: $e');
      return false;
    }
  }

  /// Clear first login completion status
  static Future<bool> clearFirstLoginCompleted() async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.clearFirstLoginCompleted();
    } catch (e) {
      Log.e('$_tag: Failed to clear first login completed: $e');
      return false;
    }
  }

  /// Clear selected language
  static Future<bool> clearSelectedLanguage() async {
    try {
      final appPreferences = GetIt.instance.get<AppPreferences>();
      return await appPreferences.clearSelectedLanguage();
    } catch (e) {
      Log.e('$_tag: Failed to clear selected language: $e');
      return false;
    }
  }

  /// Setup demo authentication (for demo purposes only)
  static Future<bool> setupDemoAuthentication() async {
    try {
      Log.d('$_tag: Setting up demo authentication');

      // Save demo auth token
      const demoToken = 'demo_token_12345';
      final tokenSaved = await saveAuthToken(demoToken);

      // Save demo user data
      final demoUserData = {
        'id': 1,
        'email': 'demo@gedu.com',
        'firstName': 'Demo',
        'lastName': 'User',
        'orgId': 1,
      };
      final userDataSaved = await saveUserData(demoUserData);

      if (tokenSaved && userDataSaved) {
        Log.d('$_tag: Demo authentication setup successful');
        return true;
      } else {
        Log.e('$_tag: Failed to setup demo authentication');
        return false;
      }
    } catch (e) {
      Log.e('$_tag: Error setting up demo authentication: $e');
      return false;
    }
  }
}
