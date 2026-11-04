abstract class EnumType {
  EnumType(this.rawValue);

  final String rawValue;

  static T fromText<T extends EnumType>(
      {required String? text, required List<T> values, required T orElse}) {
    return values.firstWhere(
          (e) => _checkType(e, text),
      orElse: () => orElse,
    );
  }
}

bool _checkType(EnumType e, String? text) {
  return e.rawValue.toLowerCase() == text?.toLowerCase() || _checkName(e, text);
}

bool _checkName(dynamic e, String? text) {
  if (e is Enum) {
    return e.name.toLowerCase() == text?.toLowerCase();
  } else {
    return false;
  }
}
