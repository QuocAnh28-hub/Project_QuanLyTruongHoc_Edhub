import '../../exception/app_exception.dart';
import 'domain_exception_type.dart';

abstract class DomainExceptionMapper {
  DomainExceptionType mapException(AppException exception);
}