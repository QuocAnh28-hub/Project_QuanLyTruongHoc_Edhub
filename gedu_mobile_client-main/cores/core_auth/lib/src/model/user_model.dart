import 'user_additional_model.dart';

/// UI model for user data
class UserModel {
  final int id;
  final String email;
  final String firstName;
  final String lastName;
  final int orgId;
  final int? refId;
  final String? phone;
  final UserAdditionalModel additional;

  const UserModel({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.orgId,
    required this.additional,
    this.refId,
    this.phone,
  });

  @override
  String toString() {
    return 'UserModel{id: $id, email: $email, firstName: $firstName, lastName: $lastName, orgId: $orgId, refId: $refId, phone: $phone, additional: $additional}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserModel &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          email == other.email &&
          firstName == other.firstName &&
          lastName == other.lastName &&
          orgId == other.orgId &&
          refId == other.refId &&
          phone == other.phone &&
          additional == other.additional;

  @override
  int get hashCode =>
      id.hashCode ^
      email.hashCode ^
      firstName.hashCode ^
      lastName.hashCode ^
      orgId.hashCode ^
      refId.hashCode ^
      phone.hashCode ^
      additional.hashCode;
}
