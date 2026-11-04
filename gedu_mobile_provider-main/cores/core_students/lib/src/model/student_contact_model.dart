/// Model for student contact information
class StudentContactModel {
  final int id;
  final int userId;
  final String firstName;
  final String lastName;
  final int relationship;
  final String relationshipTitle;
  final int status;
  final bool grantAccess;
  final String? occupation;
  final String? dateOfBirth;
  final String? citizenId;
  final String? phone;
  final String? email;

  const StudentContactModel({
    required this.id,
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.relationship,
    required this.relationshipTitle,
    required this.status,
    required this.grantAccess,
    this.occupation,
    this.dateOfBirth,
    this.citizenId,
    this.phone,
    this.email,
  });

  factory StudentContactModel.fromJson(Map<String, dynamic> json) {
    return StudentContactModel(
      id: json['id'] as int,
      userId: json['userId'] as int,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      relationship: json['relationship'] as int,
      relationshipTitle: json['relationshipTitle'] as String,
      status: json['status'] as int,
      grantAccess: json['grantAccess'] as bool,
      occupation: json['occupation'] as String?,
      dateOfBirth: json['dateOfBirth'] as String?,
      citizenId: json['citizenId'] as String?,
      phone: json['phone'] as String?,
      email: json['email'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'firstName': firstName,
      'lastName': lastName,
      'relationship': relationship,
      'relationshipTitle': relationshipTitle,
      'status': status,
      'grantAccess': grantAccess,
      'occupation': occupation,
      'dateOfBirth': dateOfBirth,
      'citizenId': citizenId,
      'phone': phone,
      'email': email,
    };
  }

  /// Get full name (firstName + lastName)
  String get fullName => '$lastName $firstName';

  /// Get year of birth from dateOfBirth
  int? get yearOfBirth {
    if (dateOfBirth == null) return null;
    try {
      final birthDate = DateTime.parse(dateOfBirth!);
      return birthDate.year;
    } catch (e) {
      return null;
    }
  }

  @override
  String toString() {
    return 'StudentContactModel{id: $id, userId: $userId, firstName: $firstName, lastName: $lastName, relationship: $relationship, relationshipTitle: $relationshipTitle, status: $status, grantAccess: $grantAccess, occupation: $occupation, dateOfBirth: $dateOfBirth, citizenId: $citizenId, phone: $phone, email: $email}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StudentContactModel &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          firstName == other.firstName &&
          lastName == other.lastName &&
          relationship == other.relationship &&
          relationshipTitle == other.relationshipTitle &&
          status == other.status &&
          grantAccess == other.grantAccess &&
          occupation == other.occupation &&
          dateOfBirth == other.dateOfBirth &&
          citizenId == other.citizenId &&
          phone == other.phone &&
          email == other.email;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      firstName.hashCode ^
      lastName.hashCode ^
      relationship.hashCode ^
      relationshipTitle.hashCode ^
      status.hashCode ^
      grantAccess.hashCode ^
      occupation.hashCode ^
      dateOfBirth.hashCode ^
      citizenId.hashCode ^
      phone.hashCode ^
      email.hashCode;
}
