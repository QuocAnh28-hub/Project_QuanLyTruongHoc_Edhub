import 'dart:convert';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'storage_keys.dart';

/// App preferences manager for storing and retrieving app data
@singleton
class AppPreferences {
  static const String _tag = 'AppPreferences';
  SharedPreferences? _prefs;

  /// Initialize the preferences
  Future<void> init() async {
    try {
      _prefs = await SharedPreferences.getInstance();
      Log.d('$_tag: Preferences initialized successfully');
    } catch (e) {
      Log.e('$_tag: Failed to initialize preferences: $e');
      rethrow;
    }
  }

  /// Check if preferences are initialized
  bool get isInitialized => _prefs != null;

  /// Get SharedPreferences instance
  SharedPreferences? get prefs => _prefs;

  // ==================== AUTHENTICATION ====================

  /// Save authentication token
  Future<bool> saveAuthToken(String token) async {
    try {
      final result =
          await _prefs?.setString(StorageKeys.authToken, token) ?? false;
      Log.d('$_tag: Auth token saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save auth token: $e');
      return false;
    }
  }

  /// Get authentication token
  String? getAuthToken() {
    try {
      final token = _prefs?.getString(StorageKeys.authToken);
      Log.d(
        '$_tag: Auth token retrieved: ${token != null ? 'found' : 'not found'}',
      );
      return token;
    } catch (e) {
      Log.e('$_tag: Failed to get auth token: $e');
      return null;
    }
  }

  /// Check if user is authenticated
  bool get isAuthenticated {
    final token = getAuthToken();
    return token != null && token.isNotEmpty;
  }

  /// Clear authentication token
  Future<bool> clearAuthToken() async {
    try {
      final result = await _prefs?.remove(StorageKeys.authToken) ?? false;
      Log.d('$_tag: Auth token cleared: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear auth token: $e');
      return false;
    }
  }

  // ==================== USER DATA ====================

  /// Save user data as JSON
  Future<bool> saveUserData(Map<String, dynamic> userData) async {
    try {
      Log.d('$_tag: 🔍 Saving user data:');
      Log.d('$_tag:   - Raw userData: $userData');
      Log.d('$_tag:   - ID: ${userData['id']}');
      Log.d('$_tag:   - RefId: ${userData['refId']}');
      Log.d('$_tag:   - OrgId: ${userData['orgId']}');

      final jsonString = jsonEncode(userData);
      Log.d('$_tag:   - JSON string: $jsonString');

      final result = await _prefs?.setString('userData', jsonString) ?? false;
      Log.d('$_tag: User data saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save user data: $e');
      return false;
    }
  }

  /// Get user data as Map
  Map<String, dynamic>? getUserData() {
    try {
      final jsonString = _prefs?.getString('userData');
      Log.d('$_tag: 🔍 Retrieving user data:');
      Log.d('$_tag:   - Raw JSON string: $jsonString');

      if (jsonString != null) {
        final userData = jsonDecode(jsonString) as Map<String, dynamic>;
        Log.d('$_tag:   - Decoded userData: $userData');
        Log.d('$_tag:   - ID: ${userData['id']}');
        Log.d('$_tag:   - RefId: ${userData['refId']}');
        Log.d('$_tag:   - OrgId: ${userData['orgId']}');
        Log.d('$_tag: User data retrieved: found');
        return userData;
      }
      Log.d('$_tag: User data retrieved: not found');
      return null;
    } catch (e) {
      Log.e('$_tag: Failed to get user data: $e');
      return null;
    }
  }

  /// Clear user data
  Future<bool> clearUserData() async {
    try {
      final result = await _prefs?.remove('userData') ?? false;
      Log.d('$_tag: User data cleared: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear user data: $e');
      return false;
    }
  }

  // ==================== LOGIN CREDENTIALS ====================

  /// Save user phone number
  Future<bool> saveUserPhoneNumber(String phoneNumber) async {
    try {
      final result =
          await _prefs?.setString(StorageKeys.userMobileNumber, phoneNumber) ??
          false;
      Log.d('$_tag: User phone number saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save user phone number: $e');
      return false;
    }
  }

  /// Get user phone number
  String? getUserPhoneNumber() {
    try {
      final phoneNumber = _prefs?.getString(StorageKeys.userMobileNumber);
      Log.d(
        '$_tag: User phone number retrieved: ${phoneNumber != null ? 'found' : 'not found'}',
      );
      return phoneNumber;
    } catch (e) {
      Log.e('$_tag: Failed to get user phone number: $e');
      return null;
    }
  }

  /// Save user email
  Future<bool> saveUserEmail(String email) async {
    try {
      final result =
          await _prefs?.setString(StorageKeys.userEmail, email) ?? false;
      Log.d('$_tag: User email saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save user email: $e');
      return false;
    }
  }

  /// Get user email
  String? getUserEmail() {
    try {
      final email = _prefs?.getString(StorageKeys.userEmail);
      Log.d(
        '$_tag: User email retrieved: ${email != null ? 'found' : 'not found'}',
      );
      return email;
    } catch (e) {
      Log.e('$_tag: Failed to get user email: $e');
      return null;
    }
  }

  /// Save user province
  Future<bool> saveUserProvince(String province) async {
    try {
      final result =
          await _prefs?.setString(StorageKeys.userProvince, province) ?? false;
      Log.d('$_tag: User province saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save user province: $e');
      return false;
    }
  }

  /// Get user province
  String? getUserProvince() {
    try {
      final province = _prefs?.getString(StorageKeys.userProvince);
      Log.d(
        '$_tag: User province retrieved: ${province != null ? 'found' : 'not found'}',
      );
      return province;
    } catch (e) {
      Log.e('$_tag: Failed to get user province: $e');
      return null;
    }
  }

  /// Save user password (encrypted)
  Future<bool> saveUserPassword(String password) async {
    try {
      // TODO: Consider encrypting the password before storing
      final result =
          await _prefs?.setString(StorageKeys.userPassword, password) ?? false;
      Log.d('$_tag: User password saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save user password: $e');
      return false;
    }
  }

  /// Get user password
  String? getUserPassword() {
    try {
      final password = _prefs?.getString(StorageKeys.userPassword);
      Log.d(
        '$_tag: User password retrieved: ${password != null ? 'found' : 'not found'}',
      );
      return password;
    } catch (e) {
      Log.e('$_tag: Failed to get user password: $e');
      return null;
    }
  }

  /// Save all login credentials
  Future<bool> saveLoginCredentials({
    required String email,
    required String password,
    String? province,
  }) async {
    try {
      Log.d('$_tag: Saving login credentials...');

      final emailResult = await saveUserEmail(email);
      final passwordResult = await saveUserPassword(password);
      final provinceResult = province != null
          ? await saveUserProvince(province)
          : true;

      final success = emailResult && passwordResult && provinceResult;
      Log.d(
        '$_tag: Login credentials saved: ${success ? 'success' : 'failed'}',
      );
      return success;
    } catch (e) {
      Log.e('$_tag: Failed to save login credentials: $e');
      return false;
    }
  }

  /// Clear login credentials
  Future<bool> clearLoginCredentials() async {
    try {
      Log.d('$_tag: Clearing login credentials...');

      final phoneResult =
          await _prefs?.remove(StorageKeys.userMobileNumber) ?? false;
      final passwordResult =
          await _prefs?.remove(StorageKeys.userPassword) ?? false;
      final provinceResult =
          await _prefs?.remove(StorageKeys.userProvince) ?? false;

      final success = phoneResult && passwordResult && provinceResult;
      Log.d(
        '$_tag: Login credentials cleared: ${success ? 'success' : 'failed'}',
      );
      return success;
    } catch (e) {
      Log.e('$_tag: Failed to clear login credentials: $e');
      return false;
    }
  }

  /// Save remember me status
  Future<bool> saveRememberMeStatus(bool enabled) async {
    try {
      final result =
          await _prefs?.setBool(StorageKeys.rememberMeEnabled, enabled) ??
          false;
      Log.d(
        '$_tag: Remember me status saved: ${result ? 'success' : 'failed'} (enabled: $enabled)',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save remember me status: $e');
      return false;
    }
  }

  /// Get remember me status
  bool getRememberMeStatus() {
    try {
      final status = _prefs?.getBool(StorageKeys.rememberMeEnabled) ?? false;
      Log.d(
        '$_tag: Remember me status retrieved: ${status ? 'enabled' : 'disabled'}',
      );
      return status;
    } catch (e) {
      Log.e('$_tag: Failed to get remember me status: $e');
      return false;
    }
  }

  /// Clear remember me status
  Future<bool> clearRememberMeStatus() async {
    try {
      final result =
          await _prefs?.remove(StorageKeys.rememberMeEnabled) ?? false;
      Log.d(
        '$_tag: Remember me status cleared: ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear remember me status: $e');
      return false;
    }
  }

  /// Save selected language
  Future<bool> saveSelectedLanguage(String languageCode) async {
    try {
      Log.d('$_tag: Saving selected language: $languageCode');
      final result =
          await _prefs?.setString(StorageKeys.selectedLanguage, languageCode) ??
          false;
      Log.d('$_tag: Language saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save language: $e');
      return false;
    }
  }

  /// Get selected language
  String getSelectedLanguage() {
    try {
      final language = _prefs?.getString(StorageKeys.selectedLanguage) ?? 'vi';
      Log.d('$_tag: Retrieved selected language: $language');
      return language;
    } catch (e) {
      Log.e('$_tag: Failed to get selected language: $e');
      return 'vi'; // Default to Vietnamese
    }
  }

  /// Clear selected language
  Future<bool> clearSelectedLanguage() async {
    try {
      Log.d('$_tag: Clearing selected language...');
      final result =
          await _prefs?.remove(StorageKeys.selectedLanguage) ?? false;
      Log.d('$_tag: Language cleared: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear selected language: $e');
      return false;
    }
  }

  /// Clear only auth data (token and password) while preserving province and phone number
  Future<bool> clearAuthDataOnly() async {
    try {
      Log.d(
        '$_tag: Clearing auth data only (preserving province and phone)...',
      );

      final tokenResult = await clearAuthToken();
      final passwordResult =
          await _prefs?.remove(StorageKeys.userPassword) ?? false;

      final success = tokenResult && passwordResult;
      Log.d('$_tag: Auth data cleared: ${success ? 'success' : 'failed'}');
      Log.d('$_tag: Province and phone number preserved for convenience');
      return success;
    } catch (e) {
      Log.e('$_tag: Failed to clear auth data: $e');
      return false;
    }
  }

  // ==================== GENERAL PREFERENCES ====================

  /// Save string value
  Future<bool> saveString(String key, String value) async {
    try {
      final result = await _prefs?.setString(key, value) ?? false;
      Log.d(
        '$_tag: String saved for key "$key": ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save string for key "$key": $e');
      return false;
    }
  }

  /// Get string value
  String? getString(String key) {
    try {
      final value = _prefs?.getString(key);
      Log.d(
        '$_tag: String retrieved for key "$key": ${value != null ? 'found' : 'not found'}',
      );
      return value;
    } catch (e) {
      Log.e('$_tag: Failed to get string for key "$key": $e');
      return null;
    }
  }

  /// Save boolean value
  Future<bool> saveBool(String key, bool value) async {
    try {
      final result = await _prefs?.setBool(key, value) ?? false;
      Log.d(
        '$_tag: Boolean saved for key "$key": ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save boolean for key "$key": $e');
      return false;
    }
  }

  /// Get boolean value
  bool? getBool(String key) {
    try {
      final value = _prefs?.getBool(key);
      Log.d(
        '$_tag: Boolean retrieved for key "$key": ${value != null ? 'found' : 'not found'}',
      );
      return value;
    } catch (e) {
      Log.e('$_tag: Failed to get boolean for key "$key": $e');
      return null;
    }
  }

  /// Save integer value
  Future<bool> saveInt(String key, int value) async {
    try {
      final result = await _prefs?.setInt(key, value) ?? false;
      Log.d(
        '$_tag: Integer saved for key "$key": ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save integer for key "$key": $e');
      return false;
    }
  }

  /// Get integer value
  int? getInt(String key) {
    try {
      final value = _prefs?.getInt(key);
      Log.d(
        '$_tag: Integer retrieved for key "$key": ${value != null ? 'found' : 'not found'}',
      );
      return value;
    } catch (e) {
      Log.e('$_tag: Failed to get integer for key "$key": $e');
      return null;
    }
  }

  /// Save double value
  Future<bool> saveDouble(String key, double value) async {
    try {
      final result = await _prefs?.setDouble(key, value) ?? false;
      Log.d(
        '$_tag: Double saved for key "$key": ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save double for key "$key": $e');
      return false;
    }
  }

  /// Get double value
  double? getDouble(String key) {
    try {
      final value = _prefs?.getDouble(key);
      Log.d(
        '$_tag: Double retrieved for key "$key": ${value != null ? 'found' : 'not found'}',
      );
      return value;
    } catch (e) {
      Log.e('$_tag: Failed to get double for key "$key": $e');
      return null;
    }
  }

  /// Save string list
  Future<bool> saveStringList(String key, List<String> value) async {
    try {
      final result = await _prefs?.setStringList(key, value) ?? false;
      Log.d(
        '$_tag: String list saved for key "$key": ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save string list for key "$key": $e');
      return false;
    }
  }

  /// Get string list
  List<String>? getStringList(String key) {
    try {
      final value = _prefs?.getStringList(key);
      Log.d(
        '$_tag: String list retrieved for key "$key": ${value != null ? 'found' : 'not found'}',
      );
      return value;
    } catch (e) {
      Log.e('$_tag: Failed to get string list for key "$key": $e');
      return null;
    }
  }

  // ==================== UTILITY METHODS ====================

  /// Check if key exists
  bool containsKey(String key) {
    try {
      final exists = _prefs?.containsKey(key) ?? false;
      Log.d('$_tag: Key "$key" exists: $exists');
      return exists;
    } catch (e) {
      Log.e('$_tag: Failed to check if key "$key" exists: $e');
      return false;
    }
  }

  /// Remove specific key
  Future<bool> remove(String key) async {
    try {
      final result = await _prefs?.remove(key) ?? false;
      Log.d('$_tag: Key "$key" removed: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to remove key "$key": $e');
      return false;
    }
  }

  /// Clear all preferences
  Future<bool> clear() async {
    try {
      final result = await _prefs?.clear() ?? false;
      Log.d('$_tag: All preferences cleared: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear all preferences: $e');
      return false;
    }
  }

  /// Get all keys
  Set<String> getKeys() {
    try {
      final keys = _prefs?.getKeys() ?? <String>{};
      Log.d('$_tag: Retrieved ${keys.length} keys');
      return keys;
    } catch (e) {
      Log.e('$_tag: Failed to get keys: $e');
      return <String>{};
    }
  }

  /// Save onboarding state
  Future<bool> saveOnboardingState(bool isInOnboarding) async {
    try {
      final result =
          await _prefs?.setBool(StorageKeys.isInOnboarding, isInOnboarding) ??
          false;
      Log.d(
        '$_tag: Onboarding state saved: $isInOnboarding (${result ? 'success' : 'failed'})',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save onboarding state: $e');
      return false;
    }
  }

  /// Get onboarding state
  bool getOnboardingState() {
    try {
      final state = _prefs?.getBool(StorageKeys.isInOnboarding) ?? false;
      Log.d('$_tag: Onboarding state retrieved: $state');
      return state;
    } catch (e) {
      Log.e('$_tag: Failed to get onboarding state: $e');
      return false;
    }
  }

  /// Clear onboarding state
  Future<bool> clearOnboardingState() async {
    try {
      final result = await _prefs?.remove(StorageKeys.isInOnboarding) ?? false;
      Log.d(
        '$_tag: Onboarding state cleared: ${result ? 'success' : 'failed'})',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear onboarding state: $e');
      return false;
    }
  }

  /// Save onboarding completion state
  Future<bool> saveOnboardingCompleted(bool completed) async {
    try {
      final result =
          await _prefs?.setBool(StorageKeys.onboardingCompleted, completed) ??
          false;
      Log.d(
        '$_tag: Onboarding completion state saved: $completed (${result ? 'success' : 'failed'})',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save onboarding completion state: $e');
      return false;
    }
  }

  /// Get onboarding completion state
  bool getOnboardingCompleted() {
    try {
      final completed =
          _prefs?.getBool(StorageKeys.onboardingCompleted) ?? false;
      Log.d('$_tag: Onboarding completion state: $completed');
      return completed;
    } catch (e) {
      Log.e('$_tag: Failed to get onboarding completion state: $e');
      return false;
    }
  }

  // ==================== STUDENT REVIEW ====================

  /// Save student review confirmation status
  Future<bool> saveStudentReviewConfirmed(bool confirmed) async {
    try {
      final result =
          await _prefs?.setBool(
            StorageKeys.studentReviewConfirmed,
            confirmed,
          ) ??
          false;
      Log.d(
        '$_tag: Student review confirmed saved: $confirmed (${result ? 'success' : 'failed'})',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save student review confirmed: $e');
      return false;
    }
  }

  /// Get student review confirmation status
  bool getStudentReviewConfirmed() {
    try {
      final confirmed =
          _prefs?.getBool(StorageKeys.studentReviewConfirmed) ?? false;
      Log.d('$_tag: Student review confirmed retrieved: $confirmed');
      return confirmed;
    } catch (e) {
      Log.e('$_tag: Failed to get student review confirmed: $e');
      return false;
    }
  }

  /// Clear student review confirmation status
  Future<bool> clearStudentReviewConfirmed() async {
    try {
      final result =
          await _prefs?.remove(StorageKeys.studentReviewConfirmed) ?? false;
      Log.d(
        '$_tag: Student review confirmed cleared: ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear student review confirmed: $e');
      return false;
    }
  }

  /// Save selected student data
  Future<bool> saveSelectedStudent(Map<String, dynamic> studentData) async {
    try {
      final jsonString = jsonEncode(studentData);
      final result =
          await _prefs?.setString(StorageKeys.selectedStudent, jsonString) ??
          false;
      Log.d('$_tag: Selected student saved: ${result ? 'success' : 'failed'}');
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save selected student: $e');
      return false;
    }
  }

  /// Get selected student data
  Map<String, dynamic>? getSelectedStudent() {
    try {
      final jsonString = _prefs?.getString(StorageKeys.selectedStudent);
      if (jsonString != null) {
        final studentData = jsonDecode(jsonString) as Map<String, dynamic>;
        Log.d('$_tag: Selected student retrieved: $studentData');
        return studentData;
      }
      return null;
    } catch (e) {
      Log.e('$_tag: Failed to get selected student: $e');
      return null;
    }
  }

  /// Clear selected student data
  Future<bool> clearSelectedStudent() async {
    try {
      final result = await _prefs?.remove(StorageKeys.selectedStudent) ?? false;
      Log.d(
        '$_tag: Selected student cleared: ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear selected student: $e');
      return false;
    }
  }

  // ==================== FIRST LOGIN TRACKING ====================

  /// Save first login completion status
  Future<bool> saveFirstLoginCompleted(bool completed) async {
    try {
      final result =
          await _prefs?.setBool(StorageKeys.firstLoginCompleted, completed) ??
          false;
      Log.d(
        '$_tag: First login completed saved: $completed (${result ? 'success' : 'failed'})',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to save first login completed: $e');
      return false;
    }
  }

  /// Get first login completion status
  bool getFirstLoginCompleted() {
    try {
      final completed =
          _prefs?.getBool(StorageKeys.firstLoginCompleted) ?? false;
      Log.d('$_tag: First login completed retrieved: $completed');
      return completed;
    } catch (e) {
      Log.e('$_tag: Failed to get first login completed: $e');
      return false;
    }
  }

  /// Clear first login completion status
  Future<bool> clearFirstLoginCompleted() async {
    try {
      final result =
          await _prefs?.remove(StorageKeys.firstLoginCompleted) ?? false;
      Log.d(
        '$_tag: First login completed cleared: ${result ? 'success' : 'failed'}',
      );
      return result;
    } catch (e) {
      Log.e('$_tag: Failed to clear first login completed: $e');
      return false;
    }
  }

  // ==================== LOGOUT ====================

  /// Clear all authentication and user data
  Future<bool> logout() async {
    try {
      Log.d('$_tag: Starting logout process...');

      // Check if remember me was enabled
      final rememberMeEnabled = getRememberMeStatus();
      Log.d(
        '$_tag: Remember me status: ${rememberMeEnabled ? 'enabled' : 'disabled'}',
      );

      // Clear auth token
      await clearAuthToken();

      // Clear user data
      await clearUserData();

      // Clear onboarding state
      await clearOnboardingState();

      // Clear student review confirmation status
      await clearStudentReviewConfirmed();

      if (rememberMeEnabled) {
        // If remember me was enabled, only clear auth data (token and password)
        // Keep province and phone number for convenience
        Log.d(
          '$_tag: Remember me enabled - preserving province and phone number',
        );
        await clearAuthDataOnly();
      } else {
        // If remember me was not enabled, clear all credentials
        Log.d('$_tag: Remember me disabled - clearing all credentials');
        await clearLoginCredentials();
      }

      Log.d('$_tag: Logout completed successfully');
      return true;
    } catch (e) {
      Log.e('$_tag: Failed to logout: $e');
      return false;
    }
  }
}
