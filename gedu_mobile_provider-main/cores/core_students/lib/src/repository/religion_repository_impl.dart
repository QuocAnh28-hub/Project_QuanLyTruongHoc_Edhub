import 'package:injectable/injectable.dart';
import 'package:core_students/core_students.dart';
import 'package:core_network/core_network.dart';
import 'religion_repository.dart';
import '../endpoint/religions_endpoint.dart';
import '../dto/religion_dto.dart';

@Injectable(as: ReligionRepository)
class ReligionRepositoryImpl implements ReligionRepository {
  final AuthenticatedApiClient _apiClient;

  ReligionRepositoryImpl(this._apiClient);

  @override
  Future<List<ReligionModel>> getReligions() async {
    try {
      final requestInfo = ReligionsEndpoint.getReligions();

      final response = await _apiClient.get<List<ReligionDto>>(
        requestInfo.path,
        fromJson: (json) => _mapReligionsResponse(json),
      );

      if (response.response != null) {
        final List<ReligionDto> religionDtos = response.response!;
        return religionDtos
            .map((dto) => ReligionModel(id: dto.id, title: dto.title))
            .toList();
      }

      return [];
    } catch (e) {
      throw Exception('Failed to get religions: $e');
    }
  }

  /// Map JSON response to list of ReligionDto
  List<ReligionDto> _mapReligionsResponse(dynamic json) {
    if (json is List<dynamic>) {
      // DataResponse.fromJson already extracts the 'response' field, so json is directly the array
      return json
          .map((item) => ReligionDto.fromJson(item as Map<String, dynamic>))
          .toList();
    } else {
      throw Exception(
        'Invalid response format for religions: expected List but got ${json.runtimeType}',
      );
    }
  }
}
