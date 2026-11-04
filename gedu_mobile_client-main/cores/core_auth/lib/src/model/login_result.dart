import 'user_model.dart';

/// UI model for login result
class LoginResult {
  final String accessToken;
  final UserModel user;

  const LoginResult({required this.accessToken, required this.user});

  @override
  String toString() {
    return 'LoginResult{accessToken: ${accessToken.substring(0, 20)}..., user: $user}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LoginResult &&
          runtimeType == other.runtimeType &&
          accessToken == other.accessToken &&
          user == other.user;

  @override
  int get hashCode => accessToken.hashCode ^ user.hashCode;
}
