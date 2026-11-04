import 'package:core_network/core_network.dart';
import 'package:injectable/injectable.dart';

/// Request info for getting students by reference ID
class GetStudentsRequestInfo extends GenericRequestInfo {
  final String refId;

  GetStudentsRequestInfo({required this.refId});

  @override
  RestMethod get method => RestMethod.get;

  @override
  String get path => '/student-contacts/$refId/students';
}

/// Request info for getting students by reference ID
class GetStudentRequestInfo extends GenericRequestInfo {
  final String refId;
  final String studentId;

  GetStudentRequestInfo({required this.refId, required this.studentId});

  @override
  RestMethod get method => RestMethod.get;

  @override
  String get path => '/student-contacts/$refId/students/$studentId';
}

@injectable
class StudentEndpoint {
  /// Get students by reference ID endpoint
  static GetStudentsRequestInfo getStudents(String refId) {
    return GetStudentsRequestInfo(refId: refId);
  }

  /// Get a single student by ID endpoint
  static GetStudentRequestInfo getStudentById(String refId, String studentId) {
    return GetStudentRequestInfo(refId: refId, studentId: studentId);
  }

  /// Confirm student contact info endpoint
  static ConfirmStudentContactInfoRequestInfo confirmStudentContactInfo(
    String refId,
    int studentId,
  ) {
    return ConfirmStudentContactInfoRequestInfo(
      refId: refId,
      studentId: studentId,
    );
  }

  /// Update student medical info endpoint
  static UpdateStudentMedicalInfoRequestInfo updateStudentMedicalInfo(
    String refId,
    int studentId,
  ) {
    return UpdateStudentMedicalInfoRequestInfo(
      refId: refId,
      studentId: studentId,
    );
  }
}

/// Request info for confirming student contact info
class ConfirmStudentContactInfoRequestInfo extends GenericRequestInfo {
  final String refId;
  final int studentId;

  ConfirmStudentContactInfoRequestInfo({
    required this.refId,
    required this.studentId,
  });

  @override
  RestMethod get method => RestMethod.patch;

  @override
  String get path =>
      '/student-contacts/$refId/students/$studentId/confirm-info';
}

/// Request info for updating student medical info
class UpdateStudentMedicalInfoRequestInfo extends GenericRequestInfo {
  final String refId;
  final int studentId;

  UpdateStudentMedicalInfoRequestInfo({
    required this.refId,
    required this.studentId,
  });

  @override
  RestMethod get method => RestMethod.patch;

  @override
  String get path =>
      '/student-contacts/$refId/students/$studentId/medical-info';
}
