import 'package:core_network/core_network.dart';
import 'package:injectable/injectable.dart';
import 'package:core_students/core_students.dart';

@injectable
class ReligionsService {
  final ReligionRepository _religionRepository;

  ReligionsService(this._religionRepository);

  Future<List<ReligionModel>> getReligions() async {
    try {
      return await _religionRepository.getReligions();
    } catch (e) {
      throw Exception('Failed to get religions: $e');
    }
  }
}
