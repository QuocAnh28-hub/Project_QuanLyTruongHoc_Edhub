import '../dto/user_additional_dto.dart';
import '../model/user_additional_model.dart';

class UserAdditionalMapper {
  static UserAdditionalModel toModel(UserAdditionalDto dto) {
    return UserAdditionalModel(
      schoolYear: dto.schoolYear,
      schoolYearName: dto.schoolYearName,
      provinceId: dto.provinceId,
      schoolName: dto.schoolName,
      schoolCode: dto.schoolCode,
      canPreschool: dto.canPreschool,
      canPrimarySchool: dto.canPrimarySchool,
      canLowerSecondarySchool: dto.canLowerSecondarySchool,
      canUpperSecondarySchool: dto.canUpperSecondarySchool,
    );
  }

  static UserAdditionalDto toDto(UserAdditionalModel model) {
    return UserAdditionalDto(
      schoolYear: model.schoolYear,
      schoolYearName: model.schoolYearName,
      provinceId: model.provinceId,
      schoolName: model.schoolName,
      schoolCode: model.schoolCode,
      canPreschool: model.canPreschool,
      canPrimarySchool: model.canPrimarySchool,
      canLowerSecondarySchool: model.canLowerSecondarySchool,
      canUpperSecondarySchool: model.canUpperSecondarySchool,
    );
  }
}
