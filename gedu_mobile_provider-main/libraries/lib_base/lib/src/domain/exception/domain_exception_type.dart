abstract interface class DomainExceptionType {
  bool get isValidDomainCase;

  T? getDefaultValue<T> (T defaultValue);
}