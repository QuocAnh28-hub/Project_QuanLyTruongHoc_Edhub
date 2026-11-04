import 'package:core_students/core_students.dart';

abstract class ReligionRepository {
  Future<List<ReligionModel>> getReligions();
}
