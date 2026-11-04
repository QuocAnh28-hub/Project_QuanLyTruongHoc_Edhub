// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:core_network/core_network.dart' as _i309;
import 'package:core_students/core_students.dart' as _i279;
import 'package:core_students/src/endpoint/religions_endpoint.dart' as _i777;
import 'package:core_students/src/endpoint/student_endpoint.dart' as _i718;
import 'package:core_students/src/repository/religion_repository_impl.dart'
    as _i477;
import 'package:core_students/src/repository/student_repository.dart' as _i344;
import 'package:core_students/src/service/religions_service.dart' as _i388;
import 'package:core_students/src/service/student_service.dart' as _i130;
import 'package:core_students/src/usecase/confirm_student_contact_info_usecase.dart'
    as _i132;
import 'package:core_students/src/usecase/get_religions_usecase.dart' as _i252;
import 'package:core_students/src/usecase/get_student_by_id_usecase.dart'
    as _i902;
import 'package:core_students/src/usecase/get_students_usecase.dart' as _i1068;
import 'package:core_students/src/usecase/update_student_medical_info_usecase.dart'
    as _i840;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    gh.factory<_i777.ReligionsEndpoint>(() => _i777.ReligionsEndpoint());
    gh.factory<_i718.StudentEndpoint>(() => _i718.StudentEndpoint());
    gh.factory<_i344.StudentRepository>(
      () => _i344.StudentRepository(gh<_i309.AuthenticatedApiClient>()),
    );
    gh.factory<_i130.StudentService>(
      () => _i130.StudentService(gh<_i309.AuthenticatedApiClient>()),
    );
    gh.factory<_i279.ReligionRepository>(
      () => _i477.ReligionRepositoryImpl(gh<_i309.AuthenticatedApiClient>()),
    );
    gh.factory<_i388.ReligionsService>(
      () => _i388.ReligionsService(gh<_i279.ReligionRepository>()),
    );
    gh.factory<_i252.GetReligionsUseCase>(
      () => _i252.GetReligionsUseCase(gh<_i279.ReligionRepository>()),
    );
    gh.factory<_i132.ConfirmStudentContactInfoUseCase>(
      () =>
          _i132.ConfirmStudentContactInfoUseCase(gh<_i344.StudentRepository>()),
    );
    gh.factory<_i1068.GetStudentsUseCase>(
      () => _i1068.GetStudentsUseCase(gh<_i344.StudentRepository>()),
    );
    gh.factory<_i840.UpdateStudentMedicalInfoUseCase>(
      () =>
          _i840.UpdateStudentMedicalInfoUseCase(gh<_i344.StudentRepository>()),
    );
    gh.factory<_i902.GetStudentByIdUseCase>(
      () => _i902.GetStudentByIdUseCase(gh<_i344.StudentRepository>()),
    );
    return this;
  }
}
