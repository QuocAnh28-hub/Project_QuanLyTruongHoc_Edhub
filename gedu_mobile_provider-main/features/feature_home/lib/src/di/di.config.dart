// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:core_auth/core_auth.dart' as _i608;
import 'package:core_storage/core_storage.dart' as _i78;
import 'package:core_students/core_students.dart' as _i279;
import 'package:feature_home/src/bloc/academic_policy_bloc.dart' as _i823;
import 'package:feature_home/src/bloc/health_information_bloc.dart' as _i466;
import 'package:feature_home/src/bloc/health_information_form_bloc.dart'
    as _i189;
import 'package:feature_home/src/bloc/home_bloc.dart' as _i984;
import 'package:feature_home/src/bloc/profile_bloc.dart' as _i269;
import 'package:feature_home/src/bloc/student_information_bloc.dart' as _i461;
import 'package:feature_home/src/bloc/student_profile_bloc.dart' as _i361;
import 'package:feature_home/src/bloc/student_review_bloc.dart' as _i473;
import 'package:feature_home/src/coordinator/home_feature_coordinator.dart'
    as _i51;
import 'package:feature_home/src/coordinator/profile_feature_coordinator.dart'
    as _i389;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    gh.factory<_i51.HomeFeatureCoordinator>(
      () => _i51.HomeFeatureCoordinator(),
    );
    gh.factory<_i389.ProfileFeatureCoordinator>(
      () => _i389.ProfileFeatureCoordinator(),
    );
    gh.factory<_i473.StudentReviewBloc>(
      () => _i473.StudentReviewBloc(
        gh<_i279.GetStudentsUseCase>(),
        gh<_i78.AppPreferences>(),
      ),
    );
    gh.factory<_i189.HealthInformationFormBloc>(
      () => _i189.HealthInformationFormBloc(
        gh<_i279.UpdateStudentMedicalInfoUseCase>(),
      ),
    );
    gh.factory<_i269.ProfileBloc>(
      () => _i269.ProfileBloc(gh<_i608.GetAccountInfoUseCase>()),
    );
    gh.factory<_i461.StudentInformationBloc>(
      () => _i461.StudentInformationBloc(
        gh<_i279.GetStudentByIdUseCase>(),
        gh<_i279.GetReligionsUseCase>(),
        gh<_i279.ConfirmStudentContactInfoUseCase>(),
      ),
    );
    gh.factory<_i984.HomeBloc>(
      () => _i984.HomeBloc(
        gh<_i279.GetStudentsUseCase>(),
        gh<_i608.GetAccountInfoUseCase>(),
      ),
    );
    gh.factory<_i361.StudentProfileBloc>(
      () => _i361.StudentProfileBloc(gh<_i279.GetStudentByIdUseCase>()),
    );
    gh.factory<_i823.AcademicPolicyBloc>(
      () => _i823.AcademicPolicyBloc(gh<_i279.GetStudentByIdUseCase>()),
    );
    gh.factory<_i466.HealthInformationBloc>(
      () => _i466.HealthInformationBloc(gh<_i279.GetStudentByIdUseCase>()),
    );
    return this;
  }
}
