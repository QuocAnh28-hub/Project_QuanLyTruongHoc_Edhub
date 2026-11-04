import 'package:core_network/core_network.dart' as core_network;
import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';

import '../dto/login_response_dto.dart';
import '../dto/change_password_response_dto.dart';
import '../dto/account_info_response_dto.dart';
import '../dto/user_dto.dart';
import '../dto/user_additional_dto.dart';
import '../endpoint/auth_endpoint.dart';
import '../mapper/user_mapper.dart';
import '../model/login_result.dart';

/// Repository interface for authentication operations
abstract class AuthRepository {
  Future<LoginResult> login(String email, String password);
  Future<void> logout();
  Future<LoginResult> refreshToken(String refreshToken);
  Future<LoginResult> getProfile();
  Future<bool> changePassword(String oldPassword, String newPassword);
  Future<LoginResult> getAccountInfo();
}

/// Implementation of AuthRepository
@Injectable(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  late final core_network.NonAuthenticatedApiClient _nonAuthenticatedClient;
  late final core_network.AuthenticatedApiClient _authenticatedClient;

  AuthRepositoryImpl() {
    // Get API clients from the existing core_network registrations
    _nonAuthenticatedClient = getIt
        .get<core_network.NonAuthenticatedApiClient>();
    _authenticatedClient = getIt.get<core_network.AuthenticatedApiClient>();
  }

  @override
  Future<LoginResult> login(String email, String password) async {
    final requestInfo = AuthEndpoint.login(email: email, password: password);

    final response = await _nonAuthenticatedClient.post<LoginResponseDto>(
      requestInfo.path,
      data: requestInfo.data,
      fromJson: (json) => _mapLoginResponse(json),
    );

    final loginResponseDto = _validateAndExtractResponse(response, 'login');

    // Add detailed logging to see what's coming from server
    Log.d('🔍 AuthRepository: Server response analysis:');
    Log.d('🔍 AuthRepository:   - Raw response: ${response.response}');
    Log.d('🔍 AuthRepository:   - User ID: ${loginResponseDto.user.id}');
    Log.d('🔍 AuthRepository:   - User RefId: ${loginResponseDto.user.refId}');
    Log.d('🔍 AuthRepository:   - User OrgId: ${loginResponseDto.user.orgId}');

    final loginResult = _mapToLoginResult(loginResponseDto);

    // Save authentication token and user data
    await _saveLoginData(loginResult);

    return loginResult;
  }

  @override
  Future<void> logout() async {
    final requestInfo = AuthEndpoint.logout();

    await _authenticatedClient.post<void>(
      requestInfo.path,
      fromJson: (json) => null,
    );

    // Clear local authentication data
    await _clearLoginData();
  }

  @override
  Future<LoginResult> refreshToken(String refreshToken) async {
    final requestInfo = AuthEndpoint.refreshToken(refreshToken: refreshToken);

    final response = await _nonAuthenticatedClient.post<LoginResponseDto>(
      requestInfo.path,
      data: requestInfo.data,
      fromJson: (json) => _mapLoginResponse(json),
    );

    final loginResponseDto = _validateAndExtractResponse(
      response,
      'refresh token',
    );
    return _mapToLoginResult(loginResponseDto);
  }

  @override
  Future<LoginResult> getProfile() async {
    final requestInfo = AuthEndpoint.getProfile();

    final response = await _authenticatedClient.get<LoginResponseDto>(
      requestInfo.path,
      fromJson: (json) => _mapLoginResponse(json),
    );

    final loginResponseDto = _validateAndExtractResponse(response, 'profile');
    return _mapToLoginResult(loginResponseDto);
  }

  @override
  Future<LoginResult> getAccountInfo() async {
    final requestInfo = AuthEndpoint.getAccountInfo();

    final response = await _authenticatedClient.get<AccountInfoResponseDto>(
      requestInfo.path,
      fromJson: (json) => _mapAccountInfoResponse(json),
    );

    final accountInfoResponseDto = _validateAndExtractAccountInfoResponse(
      response,
      'account info',
    );

    // Convert AccountInfoResponseDto to LoginResponseDto for compatibility
    // Since AccountInfoResponseDto now contains user data directly, we need to create a UserDto
    final userDto = UserDto(
      id: accountInfoResponseDto.id,
      email: accountInfoResponseDto.email,
      firstName: accountInfoResponseDto.firstName,
      lastName: accountInfoResponseDto.lastName,
      orgId: accountInfoResponseDto.orgId,
      refId: accountInfoResponseDto.refId,
      phone: accountInfoResponseDto.phone,
      additional: const UserAdditionalDto(), // Use default additional data
    );

    final loginResponseDto = LoginResponseDto(
      accessToken: '', // Account info doesn't return access token
      user: userDto,
    );

    return _mapToLoginResult(loginResponseDto);
  }

  @override
  Future<bool> changePassword(String oldPassword, String newPassword) async {
    final requestInfo = AuthEndpoint.changePassword(
      oldPassword: oldPassword,
      newPassword: newPassword,
    );

    final response = await _authenticatedClient.post<ChangePasswordResponseDto>(
      requestInfo.path,
      data: requestInfo.data,
      fromJson: (json) => _mapChangePasswordResponse(json),
    );

    final changePasswordResponseDto = _validateAndExtractChangePasswordResponse(
      response,
      'change password',
    );

    return changePasswordResponseDto.success;
  }

  /// Validate response and extract data safely
  LoginResponseDto _validateAndExtractResponse(
    core_network.DataResponse<LoginResponseDto> response,
    String operation,
  ) {
    final data = response.response;
    if (data == null) {
      throw AppLogicException(
        message: 'No $operation data received from server',
      );
    }
    return data;
  }

  /// Map JSON response to LoginResponseDto with proper error handling
  LoginResponseDto _mapLoginResponse(dynamic json) {
    if (json is Map<String, dynamic>) {
      try {
        Log.d('🔍 AuthRepository: Raw JSON before parsing: $json');
        Log.d('🔍 AuthRepository: User data in JSON: ${json['user']}');
        if (json['user'] is Map<String, dynamic>) {
          Log.d(
            '🔍 AuthRepository: User refId in JSON: ${json['user']['refId']}',
          );
          Log.d('🔍 AuthRepository: User id in JSON: ${json['user']['id']}');
        }

        return LoginResponseDto.fromJson(json);
      } catch (e) {
        throw AppLogicException(
          message: 'Failed to parse login response: ${e.toString()}',
        );
      }
    } else {
      throw const AppLogicException(
        message: 'Invalid response format: expected Map<String, dynamic>',
      );
    }
  }

  /// Map JSON response to ChangePasswordResponseDto with proper error handling
  ChangePasswordResponseDto _mapChangePasswordResponse(dynamic json) {
    if (json is Map<String, dynamic>) {
      try {
        // Handle the case where response is wrapped in a 'response' object
        if (json.containsKey('response') &&
            json['response'] is Map<String, dynamic>) {
          final responseData = json['response'] as Map<String, dynamic>;
          // If the response contains a message, consider it successful
          if (responseData.containsKey('message')) {
            return ChangePasswordResponseDto(
              success: true,
              message: responseData['message'] as String?,
            );
          }
        }

        // Try to parse as direct DTO format
        return ChangePasswordResponseDto.fromJson(json);
      } catch (e) {
        throw AppLogicException(
          message: 'Failed to parse change password response: ${e.toString()}',
        );
      }
    } else {
      throw const AppLogicException(
        message: 'Invalid response format: expected Map<String, dynamic>',
      );
    }
  }

  /// Map JSON response to AccountInfoResponseDto with proper error handling
  AccountInfoResponseDto _mapAccountInfoResponse(dynamic json) {
    if (json is Map<String, dynamic>) {
      try {
        Log.d('🔍 AuthRepository: Raw JSON before parsing account info: $json');
        Log.d('🔍 AuthRepository: User ID in JSON: ${json['id']}');
        Log.d('🔍 AuthRepository: User email in JSON: ${json['email']}');
        Log.d(
          '🔍 AuthRepository: User firstName in JSON: ${json['firstName']}',
        );
        Log.d('🔍 AuthRepository: User lastName in JSON: ${json['lastName']}');
        Log.d('🔍 AuthRepository: User orgId in JSON: ${json['orgId']}');
        Log.d('🔍 AuthRepository: User refId in JSON: ${json['refId']}');
        Log.d('🔍 AuthRepository: User phone in JSON: ${json['phone']}');

        return AccountInfoResponseDto.fromJson(json);
      } catch (e) {
        throw AppLogicException(
          message: 'Failed to parse account info response: ${e.toString()}',
        );
      }
    } else {
      throw const AppLogicException(
        message: 'Invalid response format: expected Map<String, dynamic>',
      );
    }
  }

  /// Validate change password response and extract data safely
  ChangePasswordResponseDto _validateAndExtractChangePasswordResponse(
    core_network.DataResponse<ChangePasswordResponseDto> response,
    String operation,
  ) {
    final data = response.response;
    if (data == null) {
      throw AppLogicException(
        message: 'No $operation data received from server',
      );
    }
    return data;
  }

  /// Validate account info response and extract data safely
  AccountInfoResponseDto _validateAndExtractAccountInfoResponse(
    core_network.DataResponse<AccountInfoResponseDto> response,
    String operation,
  ) {
    final data = response.response;
    if (data == null) {
      throw AppLogicException(
        message: 'No $operation data received from server',
      );
    }
    return data;
  }

  /// Map LoginResponseDto to LoginResult (UI model)
  LoginResult _mapToLoginResult(LoginResponseDto loginResponseDto) {
    Log.d('🔍 AuthRepository: Mapping DTO to UI model:');
    Log.d('🔍 AuthRepository:   - DTO User ID: ${loginResponseDto.user.id}');
    Log.d(
      '🔍 AuthRepository:   - DTO User RefId: ${loginResponseDto.user.refId}',
    );
    Log.d(
      '🔍 AuthRepository:   - DTO User OrgId: ${loginResponseDto.user.orgId}',
    );
    Log.d(
      '🔍 AuthRepository:   - DTO User Phone: ${loginResponseDto.user.phone}',
    );

    final userModel = UserMapper.toModel(loginResponseDto.user);

    Log.d('🔍 AuthRepository: After mapping to UI model:');
    Log.d('🔍 AuthRepository:   - Model User ID: ${userModel.id}');
    Log.d('🔍 AuthRepository:   - Model User RefId: ${userModel.refId}');
    Log.d('🔍 AuthRepository:   - Model User OrgId: ${userModel.orgId}');
    Log.d('🔍 AuthRepository:   - Model User Phone: ${userModel.phone}');

    return LoginResult(
      accessToken: loginResponseDto.accessToken,
      user: userModel,
    );
  }

  /// Save login data to preferences
  Future<void> _saveLoginData(LoginResult loginResult) async {
    try {
      // Get AppPreferences instance
      final appPreferences = getIt.get<AppPreferences>();

      // Save authentication token
      await appPreferences.saveAuthToken(loginResult.accessToken);

      // Save user data
      final userData = {
        'id': loginResult.user.id,
        'email': loginResult.user.email,
        'firstName': loginResult.user.firstName,
        'lastName': loginResult.user.lastName,
        'orgId': loginResult.user.orgId,
        'refId': loginResult.user.refId,
        'additional': {
          'schoolYear': loginResult.user.additional.schoolYear,
          'schoolYearName': loginResult.user.additional.schoolYearName,
          'provinceId': loginResult.user.additional.provinceId,
          'schoolName': loginResult.user.additional.schoolName,
          'schoolCode': loginResult.user.additional.schoolCode,
          'canPreschool': loginResult.user.additional.canPreschool,
          'canPrimarySchool': loginResult.user.additional.canPrimarySchool,
          'canLowerSecondarySchool':
              loginResult.user.additional.canLowerSecondarySchool,
          'canUpperSecondarySchool':
              loginResult.user.additional.canUpperSecondarySchool,
        },
      };

      Log.d('🔍 AuthRepository: Saving user data:');
      Log.d('🔍 AuthRepository:   - ID: ${loginResult.user.id}');
      Log.d('🔍 AuthRepository:   - RefId: ${loginResult.user.refId}');
      Log.d('🔍 AuthRepository:   - OrgId: ${loginResult.user.orgId}');

      await appPreferences.saveUserData(userData);

      Log.d('🔍 AuthRepository: Login data saved successfully');
    } catch (e) {
      Log.e('🔍 AuthRepository: Failed to save login data: $e');
      // Don't throw here to avoid breaking the login flow
    }
  }

  /// Clear login data from preferences
  Future<void> _clearLoginData() async {
    try {
      // Get AppPreferences instance
      final appPreferences = getIt.get<AppPreferences>();

      // Clear authentication data
      await appPreferences.logout();

      Log.d('🔍 AuthRepository: Login data cleared successfully');
    } catch (e) {
      Log.e('🔍 AuthRepository: Failed to clear login data: $e');
      // Don't throw here to avoid breaking the logout flow
    }
  }
}
