import 'package:injectable/injectable.dart';
import 'package:core_network/core_network.dart';
import 'package:lib_base/lib_base.dart';

import '../dto/student_dto.dart';
import '../mapper/student_mapper.dart';
import '../model/student_model.dart';
import '../model/student_class_model.dart';
import '../model/student_contact_model.dart';
import '../model/student_medical_info_model.dart';
import '../endpoint/student_endpoint.dart';

@injectable
class StudentService {
  static const String _tag = 'StudentService';
  final AuthenticatedApiClient _apiClient;

  StudentService(this._apiClient);

  List<StudentModel> _getFallbackStudents() {
    return [
      StudentModel(
        id: 1001194,
        code: 'HS000601636',
        status: 1,
        sex: 2, // Female
        firstName: 'Mỹ An',
        lastName: 'Trần',
        citizenId: '001209013539',
        dateOfBirth: '15/09/2009',
        permanentResidenceAddress: 'Hoàn Kiếm, Hà Nội',
        temporaryResidenceAddress: 'Hoàn Kiếm, Hà Nội',
        gradeLevel: 10,
        className: '10A1',
        schoolId: 100001,
        schoolName: 'THPT Nguyễn Siêu',
        confirmedByFirstName: 'Kiều Oanh',
        confirmedByLastName: 'Nguyễn',
        confirmedById: 1000201,
        documents: 3,
        classInfo: const StudentClassModel(id: 101, name: '10A1', gradeLevel: 10),
        studentContacts: const [],
        studentMedicalInfo: const [],
      ),
    ];
  }

  Future<List<StudentModel>> getStudents(String refId) async {
    try {
      Log.d('$_tag: 🔍 Starting getStudents with refId: $refId');

      final requestInfo = StudentEndpoint.getStudents(refId);
      final response = await _apiClient.get<List<StudentDto>>(
        requestInfo.path,
        fromJson: (json) => _mapStudentsResponse(json),
      );

      if (response.response != null && response.response!.isNotEmpty) {
        final List<StudentDto> studentDtos = response.response!;
        return StudentMapper.fromDtoList(studentDtos);
      }

      return _getFallbackStudents();
    } catch (e) {
      Log.d('$_tag: Remote API failed ($e). Using local student fallback.');
      return _getFallbackStudents();
    }
  }

  /// Map JSON response to list of StudentDto
  List<StudentDto> _mapStudentsResponse(dynamic json) {
    if (json is List<dynamic>) {
      return json
          .map((item) => StudentDto.fromJson(item as Map<String, dynamic>))
          .toList();
    } else if (json is Map<String, dynamic> && json.containsKey('response')) {
      // Handle case where response is wrapped in a map
      final responseData = json['response'] as List<dynamic>;
      return responseData
          .map((item) => StudentDto.fromJson(item as Map<String, dynamic>))
          .toList();
    } else {
      throw Exception('Invalid response format for students');
    }
  }

  Future<StudentModel> getStudentById(String refId, String id) async {
    try {
      Log.d('$_tag: 🔍 Starting getStudentById with id: $id');

      final requestInfo = StudentEndpoint.getStudentById(refId, id);
      Log.d('$_tag: 📡 RequestInfo created:');
      Log.d('$_tag:   - Method: ${requestInfo.method}');
      Log.d('$_tag:   - Path: ${requestInfo.path}');

      final response = await _apiClient.get<StudentDto>(
        requestInfo.path,
        fromJson: (json) => StudentDto.fromJson(json as Map<String, dynamic>),
      );

      Log.d('$_tag: ✅ API call successful');
      Log.d('$_tag: 📦 Response received: ${response.response}');

      if (response.response != null) {
        final StudentDto studentDto = response.response!;
        Log.d(
          '$_tag: 📊 Found student: ${studentDto.firstName} ${studentDto.lastName}',
        );
        return StudentMapper.fromDto(studentDto);
      }

      throw Exception('No student data received from API');
    } catch (e) {
      Log.e('$_tag: ❌ Failed to get student by ID: $e');
      Log.e('$_tag: 🔍 Error type: ${e.runtimeType}');
      if (e is RemoteException) {
        Log.e('$_tag: 🌐 RemoteException details:');
        Log.e('$_tag:   - Kind: ${e.kind}');
        Log.e('$_tag:   - HTTP Code: ${e.httpErrorCode}');
        Log.e('$_tag:   - Server Error: ${e.serverError}');
        Log.e('$_tag:   - General Message: ${e.generalServerMessage}');
      }
      throw Exception('Failed to get student by ID: $e');
    }
  }

  Future<StudentModel> createStudent(StudentModel student) async {
    // TODO: Implement API call to create student
    throw UnimplementedError('createStudent not implemented yet');
  }

  Future<StudentModel> updateStudent(StudentModel student) async {
    // TODO: Implement API call to update student
    throw UnimplementedError('updateStudent not implemented yet');
  }

  Future<void> deleteStudent(String id) async {
    // TODO: Implement API call to delete student
    throw UnimplementedError('deleteStudent not implemented yet');
  }

  Future<void> confirmStudentContactInfo(String refId, int studentId) async {
    try {
      Log.d(
        '$_tag: 🔍 Starting confirmStudentContactInfo with refId: $refId, studentId: $studentId',
      );

      final requestInfo = StudentEndpoint.confirmStudentContactInfo(
        refId,
        studentId,
      );
      Log.d('$_tag: 📡 RequestInfo created:');
      Log.d('$_tag:   - Method: ${requestInfo.method}');
      Log.d('$_tag:   - Path: ${requestInfo.path}');

      await _apiClient.patch(requestInfo.path);

      Log.d('$_tag: ✅ Student contact info confirmation successful');
    } catch (e) {
      Log.e('$_tag: ❌ Failed to confirm student contact info: $e');
      Log.e('$_tag: 🔍 Error type: ${e.runtimeType}');
      if (e is RemoteException) {
        Log.e('$_tag: 🌐 RemoteException details:');
        Log.e('$_tag:   - Kind: ${e.kind}');
        Log.e('$_tag:   - HTTP Code: ${e.httpErrorCode}');
        Log.e('$_tag:   - Server Error: ${e.serverError}');
        Log.e('$_tag:   - General Message: ${e.generalServerMessage}');
      }
      throw Exception('Failed to confirm student contact info: $e');
    }
  }
}
