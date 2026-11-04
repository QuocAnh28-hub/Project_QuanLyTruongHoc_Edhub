import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_students/core_students.dart';

part 'get_religions_usecase_input.dart';
part 'get_religions_usecase_output.dart';

@injectable
class GetReligionsUseCase
    extends BaseFutureUseCase<GetReligionsInput, GetReligionsOutput> {
  final ReligionRepository _religionRepository;

  GetReligionsUseCase(this._religionRepository);

  @override
  Future<GetReligionsOutput> buildUseCase(GetReligionsInput input) async {
    try {
      final religions = await _religionRepository.getReligions();
      return GetReligionsOutput(religions: religions);
    } catch (e) {
      throw Exception('Failed to get religions: $e');
    }
  }
}
