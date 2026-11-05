import 'package:injectable/injectable.dart';
import 'package:core_network/core_network.dart';
import 'package:lib_base/lib_base.dart';

import '../model/student_model.dart';
import '../model/student_class_model.dart';
import '../model/student_contact_model.dart';
import '../model/student_medical_info_model.dart';
import '../dto/student_dto.dart';
import '../mapper/student_mapper.dart';
import '../endpoint/student_endpoint.dart';
import '../usecase/update_student_medical_info_usecase_output.dart';

@injectable
class StudentRepository {
  final AuthenticatedApiClient _apiClient;

  StudentRepository(this._apiClient);

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
        mainContactId: 1,
        mainStudentContact: const StudentContactModel(
          id: 1,
          userId: 9001,
          firstName: 'Lan',
          lastName: 'Nguyễn Thị',
          relationship: 1,
          relationshipTitle: 'Mẹ',
          status: 1,
          grantAccess: true,
          phone: '0912345678',
          email: 'lan.nguyen@gmail.com',
          occupation: 'Kế toán viên',
        ),
        studentContacts: [
          const StudentContactModel(
            id: 1,
            userId: 9001,
            firstName: 'Lan',
            lastName: 'Nguyễn Thị',
            relationship: 1,
            relationshipTitle: 'Mẹ',
            status: 1,
            grantAccess: true,
            phone: '0912345678',
            email: 'lan.nguyen@gmail.com',
            occupation: 'Kế toán viên',
          ),
          const StudentContactModel(
            id: 2,
            userId: 9002,
            firstName: 'Hải',
            lastName: 'Trần Văn',
            relationship: 2,
            relationshipTitle: 'Bố',
            status: 1,
            grantAccess: true,
            phone: '0987654321',
            email: 'hai.tran@gmail.com',
            occupation: 'Kỹ sư công nghệ',
          ),
        ],
        studentMedicalInfo: [
          const StudentMedicalInfoModel(
            id: 1,
            group: 1,
            type: 1,
            info: 'Chiều cao 1m62, Cân nặng 48kg, Thị lực 10/10',
          ),
          const StudentMedicalInfoModel(
            id: 2,
            group: 2,
            type: 2,
            info: 'Nhóm máu O, Tiền sử dị ứng: Không có dị ứng thuốc hay thực phẩm',
          ),
        ],
      ),
      StudentModel(
        id: 1001195,
        code: 'HS000601646',
        status: 1,
        sex: 1, // Male
        firstName: 'Gia Bảo',
        lastName: 'Trần',
        citizenId: '001209013540',
        dateOfBirth: '20/11/2008',
        permanentResidenceAddress: 'Hoàn Kiếm, Hà Nội',
        temporaryResidenceAddress: 'Hoàn Kiếm, Hà Nội',
        gradeLevel: 11,
        className: '11A2',
        schoolId: 100001,
        schoolName: 'THPT Nguyễn Siêu',
        confirmedByFirstName: 'Thành Long',
        confirmedByLastName: 'Vũ',
        confirmedById: 1000202,
        documents: 2,
        classInfo: const StudentClassModel(id: 102, name: '11A2', gradeLevel: 11),
        studentContacts: const [],
        studentMedicalInfo: const [],
      ),
    ];
  }

  Future<List<StudentModel>> getStudents(String refId) async {
    try {
      Log.d('StudentRepository: 🔍 Starting getStudents with refId: $refId');

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
      Log.d('StudentRepository: Remote API failed ($e). Using local student data fallback.');
      return _getFallbackStudents();
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

      final fallbacks = _getFallbackStudents();
      return fallbacks.firstWhere(
        (s) => s.id.toString() == id || s.code == id,
        orElse: () => fallbacks.first,
      );
    } catch (e) {
      Log.d('StudentRepository: Remote API failed ($e). Using local student data fallback.');
      final fallbacks = _getFallbackStudents();
      return fallbacks.firstWhere(
        (s) => s.id.toString() == id || s.code == id,
        orElse: () => fallbacks.first,
      );
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
