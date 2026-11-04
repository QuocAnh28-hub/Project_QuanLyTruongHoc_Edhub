import '../../exception/app_exception.dart';
import 'domain_exception_mapper.dart';

extension DomainExceptionExt<T> on AppException {
  T? handleDomainException({
    required DomainExceptionMapper mapper,
    required T defaultValue,
  }) {
    final type = mapper.mapException(this);
    return type.isValidDomainCase
        ? type.getDefaultValue(defaultValue)
        : throw this;
  }
}
