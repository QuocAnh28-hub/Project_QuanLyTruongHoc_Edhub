import 'package:injectable/injectable.dart';
import 'package:core_network/core_network.dart';
import 'package:lib_base/lib_base.dart';

import '../model/student_model.dart';
import '../dto/student_dto.dart';
import '../mapper/student_mapper.dart';
import '../endpoint/student_endpoint.dart';
import '../usecase/update_student_medical_info_usecase_output.dart';

@injectable
class StudentRepository {
  final AuthenticatedApiClient _apiClient;

  StudentRepository(this._apiClient);

  Future<List<StudentModel>> getStudents(String refId) async {
    try {
      Log.d('StudentRepository: 🔍 Starting getStudents with refId: $refId');

      final requestInfo = StudentEndpoint.getStudents(refId);

      final response = await _apiClient.get<List<StudentDto>>(
        requestInfo.path,
        fromJson: (json) => _mapStudentsResponse(json),
      );

      if (response.response != null) {
        final List<StudentDto> studentDtos = response.response!;
        return StudentMapper.fromDtoList(studentDtos);
      }

      return [];
    } catch (e) {
      Log.e('StudentRepository: ❌ Failed to get students: $e');
      throw Exception('Failed to get students: $e');
    }
  }

  Future<StudentModel> getStudentById(String refId, String id) async {
    try {
      Log.d('StudentRepository: 🔍 Starting getStudentById with id: $id');

      final requestInfo = StudentEndpoint.getStudentById(refId, id);

      final response = await _apiClient.get<StudentDto>(
        requestInfo.path,
        fromJson: (json) => StudentDto.fromJson(json as Map<String, dynamic>),
      );

      if (response.response != null) {
        final StudentDto studentDto = response.response!;
        return StudentMapper.fromDto(studentDto);
      }

      throw Exception('Student not found');
    } catch (e) {
      Log.e('StudentRepository: ❌ Failed to get student by ID: $e');
      throw Exception('Failed to get student by ID: $e');
    }
  }

  /// Map JSON response to list of StudentDto
  List<StudentDto> _mapStudentsResponse(dynamic json) {
    if (json is List<dynamic>) {
      // DataResponse.fromJson already extracts the 'response' field, so json is directly the array
      return json
          .map((item) => StudentDto.fromJson(item as Map<String, dynamic>))
          .toList();
    } else {
      throw Exception(
        'Invalid response format for students: expected List but got ${json.runtimeType}',
      );
    }
  }

  Future<void> confirmStudentContactInfo(String refId, int studentId) async {
    try {
      Log.d(
        'StudentRepository: 🔍 Starting confirmStudentContactInfo with refId: $refId, studentId: $studentId',
      );

      final requestInfo = StudentEndpoint.confirmStudentContactInfo(
        refId,
        studentId,
      );
      Log.d('StudentRepository: 📡 RequestInfo created:');
      Log.d('StudentRepository:   - Method: ${requestInfo.method}');
      Log.d('StudentRepository:   - Path: ${requestInfo.path}');

      await _apiClient.patch(
        requestInfo.path,
        data: {}, // Include empty request body to avoid 400 error
      );

      Log.d(
        'StudentRepository: ✅ Student contact info confirmation successful',
      );
    } catch (e) {
      Log.e('StudentRepository: ❌ Failed to confirm student contact info: $e');
      Log.e('StudentRepository: 🔍 Error type: ${e.runtimeType}');
      if (e is RemoteException) {
        Log.e('StudentRepository: 🌐 RemoteException details:');
        Log.e('StudentRepository:   - Kind: ${e.kind}');
        Log.e('StudentRepository:   - HTTP Code: ${e.httpErrorCode}');
        Log.e('StudentRepository:   - Server Error: ${e.serverError}');
        Log.e(
          'StudentRepository:   - General Message: ${e.generalServerMessage}',
        );
      }
      throw Exception('Failed to confirm student contact info: $e');
    }
  }

  Future<List<StudentMedicalInfoResponse>> updateStudentMedicalInfo(
    String refId,
    int studentId,
    List<Map<String, dynamic>> medicalList,
  ) async {
    try {
      Log.d(
        'StudentRepository: 🔍 Starting updateStudentMedicalInfo with refId: $refId, studentId: $studentId',
      );

      final requestInfo = StudentEndpoint.updateStudentMedicalInfo(
        refId,
        studentId,
      );
      Log.d('StudentRepository: 📡 RequestInfo created:');
      Log.d('StudentRepository:   - Method: ${requestInfo.method}');
      Log.d('StudentRepository:   - Path: ${requestInfo.path}');

      final response = await _apiClient.patch<List<StudentMedicalInfoResponse>>(
        requestInfo.path,
        data: {'medicalList': medicalList},
        fromJson: (json) => _mapMedicalInfoResponse(json),
      );

      if (response.response != null) {
        final List<StudentMedicalInfoResponse> medicalInfoList =
            response.response!;
        Log.d(
          'StudentRepository: ✅ Student medical info update successful, received ${medicalInfoList.length} items',
        );
        return medicalInfoList;
      }

      return [];
    } catch (e) {
      Log.e('StudentRepository: ❌ Failed to update student medical info: $e');
      Log.e('StudentRepository: 🔍 Error type: ${e.runtimeType}');
      if (e is RemoteException) {
        Log.e('StudentRepository: 🌐 RemoteException details:');
        Log.e('StudentRepository:   - Kind: ${e.kind}');
        Log.e('StudentRepository:   - HTTP Code: ${e.httpErrorCode}');
        Log.e('StudentRepository:   - Server Error: ${e.serverError}');
        Log.e(
          'StudentRepository:   - General Message: ${e.generalServerMessage}',
        );
      }
      throw Exception('Failed to update student medical info: $e');
    }
  }

  /// Map JSON response to list of StudentMedicalInfoResponse
  List<StudentMedicalInfoResponse> _mapMedicalInfoResponse(dynamic json) {
    if (json is List<dynamic>) {
      return json
          .map(
            (item) => StudentMedicalInfoResponse.fromJson(
              item as Map<String, dynamic>,
            ),
          )
          .toList();
    } else {
      throw Exception(
        'Invalid response format for medical info: expected List but got ${json.runtimeType}',
      );
    }
  }
}
