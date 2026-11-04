enum ContactRelationshipEnum {
  father(1),
  mother(2),
  other(9);

  const ContactRelationshipEnum(this.value);
  final int value;

  static ContactRelationshipEnum fromValue(int value) {
    return ContactRelationshipEnum.values.firstWhere(
      (enumValue) => enumValue.value == value,
      orElse: () => ContactRelationshipEnum.other,
    );
  }
}
