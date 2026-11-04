import 'package:injectable/injectable.dart';
import 'friendly_message_config.dart';

@singleton
class FriendlyMessageConfigImpl implements FriendlyMessageConfig {
  @override
  String get platformMessage => 'Platform error occurred';

  @override
  String get noInternetMessage =>
      'No internet connection. Please check your network and try again.';

  @override
  String get serverDefinedMessage =>
      'Server error occurred. Please try again later.';

  @override
  String get serverUndefinedMessage =>
      'An unexpected server error occurred. Please try again.';

  @override
  String get refreshTokenFailedMessage =>
      'Session expired. Please log in again.';

  @override
  String get timeoutMessage =>
      'Request timed out. Please check your connection and try again.';

  @override
  String get cancellationMessage => 'Request was cancelled.';

  @override
  String get unknownMessage => 'An unknown error occurred. Please try again.';

  @override
  String get connectionSecurityMessage =>
      'Connection security error. Please try again.';

  @override
  String get somethingWrongMessage => 'Something went wrong. Please try again.';

  @override
  String get loadConfigurationMessage =>
      'Failed to load configuration. Please try again.';

  @override
  String get dataParsingMessage => 'Failed to parse data. Please try again.';

  @override
  String get commonOkMessage => 'OK';

  @override
  String get commonErrorMessage => 'Error';

  @override
  String get commonRefreshText => 'Refresh';
}
