part of 'get_religions_usecase.dart';

class GetReligionsOutput extends BaseOutput {
  final List<ReligionModel> religions;

  const GetReligionsOutput({required this.religions});

  @override
  List<Object> get props => [religions];
}
