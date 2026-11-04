import '../dto/user_dto.dart';
import '../model/user_model.dart';
import 'user_additional_mapper.dart';

class UserMapper {
  static UserModel toModel(UserDto dto) {
    return UserModel(
      id: dto.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      orgId: dto.orgId,
      refId: dto.refId,
      phone: dto.phone,
      additional: UserAdditionalMapper.toModel(dto.additional),
    );
  }

  static UserDto toDto(UserModel model) {
    return UserDto(
      id: model.id,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      orgId: model.orgId,
      refId: model.refId,
      phone: model.phone,
      additional: UserAdditionalMapper.toDto(model.additional),
    );
  }
}
