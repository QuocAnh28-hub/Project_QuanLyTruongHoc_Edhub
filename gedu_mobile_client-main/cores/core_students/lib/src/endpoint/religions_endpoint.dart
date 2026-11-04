import 'package:core_network/core_network.dart';
import 'package:injectable/injectable.dart';

/// Request info for getting religions
class GetReligionsRequestInfo extends GenericRequestInfo {
  @override
  RestMethod get method => RestMethod.get;

  @override
  String get path => '/shares/religions';
}

@injectable
class ReligionsEndpoint {
  /// Get religions endpoint
  static GetReligionsRequestInfo getReligions() {
    return GetReligionsRequestInfo();
  }
}
