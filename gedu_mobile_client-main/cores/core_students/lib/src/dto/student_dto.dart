import 'package:json_annotation/json_annotation.dart';
import 'package:lib_base/lib_base.dart';

part 'student_dto.g.dart';

@JsonSerializable()
class StudentDto {
  final int id;
  final String code;
  final int status;
  final String? avatar;
  final int sex;
  final String? admissionDate;
  final int? admissionSchoolYearId;
  final String? admissionSchoolYearTitle;
  final int? admissionType;
  final String firstName;
  final String lastName;
  final String? citizenId;
  @JsonKey(name: 'dateOfBirth')
  final String? dateOfBirth;
  final String? dateOfIssue;
  final String? dateOfExpiry;
  final String? placeOfIssue;
  final int? maritalStatus;
  final String? occupation;
  final int? religionId;
  final int? ethnicityId;
  final int? nationalityId;
  final String? nationalityTitle;
  final int? priorityPolicyId;
  final String? priorityPolicyTitle;
  final int? specialNeedsPolicyId;
  final String? specialNeedsPolicyTitle;
  final String permanentResidenceAddress;
  final String temporaryResidenceAddress;
  final int? originPlaceProvinceId;
  final int? originPlaceWardId;
  final int? permanentResidenceProvinceId;
  final int? permanentResidenceWardId;
  final int? temporaryResidenceProvinceId;
  final int? temporaryResidenceWardId;
  final int? gradeLevel;
  @JsonKey(name: 'class')
  final Map<String, dynamic>? classInfo;
  final int? classId;
  final int? mainContactId;
  final Map<String, dynamic>? mainStudentContact;
  final List<Map<String, dynamic>>? studentContacts;
  final List<Map<String, dynamic>>? studentMedicalInfo;
  final int? documents;

  // Legacy fields for backward compatibility
  final int? schoolId;
  final String? schoolName;
  final String? confirmedByFirstName;
  final String? confirmedByLastName;
  final int? confirmedById;
  final String? className;
  final int? classStatus;

  const StudentDto({
    required this.id,
    required this.code,
    required this.status,
    this.avatar,
    required this.sex,
    this.admissionDate,
    this.admissionSchoolYearId,
    this.admissionSchoolYearTitle,
    this.admissionType,
    required this.firstName,
    required this.lastName,
    this.citizenId,
    this.dateOfBirth,
    this.dateOfIssue,
    this.dateOfExpiry,
    this.placeOfIssue,
    this.maritalStatus,
    this.occupation,
    this.religionId,
    this.ethnicityId,
    this.nationalityId,
    this.nationalityTitle,
    this.priorityPolicyId,
    this.priorityPolicyTitle,
    this.specialNeedsPolicyId,
    this.specialNeedsPolicyTitle,
    required this.permanentResidenceAddress,
    required this.temporaryResidenceAddress,
    this.originPlaceProvinceId,
    this.originPlaceWardId,
    this.permanentResidenceProvinceId,
    this.permanentResidenceWardId,
    this.temporaryResidenceProvinceId,
    this.temporaryResidenceWardId,
    this.gradeLevel,
    this.classInfo,
    this.classId,
    this.mainContactId,
    this.mainStudentContact,
    this.studentContacts,
    this.studentMedicalInfo,
    this.documents,
    // Legacy fields
    this.schoolId,
    this.schoolName,
    this.confirmedByFirstName,
    this.confirmedByLastName,
    this.confirmedById,
    this.className,
    this.classStatus,
  });

  factory StudentDto.fromJson(Map<String, dynamic> json) {
    try {
      return _$StudentDtoFromJson(json);
    } catch (e, stackTrace) {
      // Enhanced error logging for StudentDto parsing
      Log.e('❌ StudentDto Parsing Error:', name: 'STUDENT_DTO_PARSING_ERROR');
      Log.e('❌ Error: ${e.toString()}');
      Log.e('❌ Error Type: ${e.runtimeType}');
      Log.e('❌ Raw JSON: ${Log.prettyJson(json)}');
      Log.e('❌ Available Fields: ${json.keys.toList()}');

      // Field-by-field analysis
      _logStudentFieldAnalysis(json);

      Log.e('❌ Stack Trace:', stackTrace: stackTrace);

      // Re-throw with enhanced context
      throw Exception(
        'StudentDto parsing failed: $e\nAvailable fields: ${json.keys.join(', ')}',
      );
    }
  }

  Map<String, dynamic> toJson() => _$StudentDtoToJson(this);

  /// Analyze JSON fields specifically for StudentDto to identify parsing issues
  static void _logStudentFieldAnalysis(Map<String, dynamic> json) {
    try {
      Log.e('❌ StudentDto Field Analysis:');

      // Expected fields with their expected types
      final expectedFields = {
        'id': 'int',
        'code': 'String',
        'firstName': 'String',
        'lastName': 'String',
        'citizenId': 'String?',
        'dateOfBirth': 'String?',
        'dateOfIssue': 'String?',
        'dateOfExpiry': 'String?',
        'placeOfIssue': 'String?',
        'gender': 'int?',
        'socialInsuranceNumber': 'String?',
        'email': 'String?',
        'phoneNumber': 'String?',
        'parentPhoneNumber': 'String?',
        'registrationProvinceId': 'int?',
        'provinceName': 'String?',
        'permanentResidenceProvinceId': 'int?',
        'permanentResidenceWardId': 'int?',
        'temporaryResidenceProvinceId': 'int?',
        'temporaryResidenceWardId': 'int?',
        'gradeLevel': 'int?',
        'class': 'Map<String, dynamic>?',
        'classId': 'int?',
        'mainContactId': 'int?',
        'profilePictureUrl': 'String?',
        'ethnicity': 'String?',
        'religion': 'String?',
        'disability': 'String?',
        'fatherFullName': 'String?',
        'motherFullName': 'String?',
        'guardianFullName': 'String?',
        'admissionDate': 'String?',
        'confirmedById': 'int?',
        'className': 'String?',
        'classStatus': 'String?',
      };

      // Check each expected field
      expectedFields.forEach((fieldName, expectedType) {
        if (json.containsKey(fieldName)) {
          final value = json[fieldName];
          final actualType = value.runtimeType.toString();
          final preview = _getValuePreview(value);
          final status = _validateFieldType(value, expectedType) ? '✅' : '❌';
          Log.e(
            '❌   $status "$fieldName": $actualType = $preview (expected: $expectedType)',
          );
        } else {
          Log.e('❌   ❓ "$fieldName": MISSING (expected: $expectedType)');
        }
      });

      // Check for unexpected fields
      final unexpectedFields = json.keys
          .where((key) => !expectedFields.containsKey(key))
          .toList();
      if (unexpectedFields.isNotEmpty) {
        Log.e('❌ Unexpected fields found: $unexpectedFields');
        unexpectedFields.forEach((field) {
          final value = json[field];
          final actualType = value.runtimeType.toString();
          final preview = _getValuePreview(value);
          Log.e('❌   ⚠️  "$field": $actualType = $preview (unexpected)');
        });
      }
    } catch (e) {
      Log.e('❌ StudentDto field analysis failed: $e');
    }
  }

  /// Validate if a value matches the expected type
  static bool _validateFieldType(dynamic value, String expectedType) {
    if (expectedType.endsWith('?') && value == null) return true;

    switch (expectedType.replaceAll('?', '')) {
      case 'int':
        return value is int;
      case 'String':
        return value is String;
      case 'bool':
        return value is bool;
      case 'double':
        return value is double;
      case 'Map<String, dynamic>':
        return value is Map<String, dynamic>;
      case 'List':
        return value is List;
      default:
        return true; // Unknown type, assume valid
    }
  }

  /// Get a safe preview of a value for logging
  static String _getValuePreview(dynamic value) {
    if (value == null) return 'null';
    if (value is String) {
      return value.length > 30 ? '"${value.substring(0, 30)}..."' : '"$value"';
    }
    if (value is Map)
      return '{${value.keys.take(3).join(', ')}${value.keys.length > 3 ? '...' : ''}}';
    if (value is List)
      return '[${value.take(3).map((e) => e.toString()).join(', ')}${value.length > 3 ? '...' : ''}]';
    return value.toString();
  }
}
