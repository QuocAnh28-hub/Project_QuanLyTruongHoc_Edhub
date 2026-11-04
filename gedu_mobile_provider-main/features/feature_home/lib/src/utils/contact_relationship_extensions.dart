import 'package:core_localization/core_localization.dart';
import 'package:core_students/core_students.dart';

extension ContactRelationshipUIExtension on ContactRelationshipEnum {
  String getLocalizedDisplayText(AppLocalizations? l10n) {
    switch (this) {
      case ContactRelationshipEnum.father:
        return l10n?.contactRelationshipFather ?? 'Cha';
      case ContactRelationshipEnum.mother:
        return l10n?.contactRelationshipMother ?? 'Mẹ';
      case ContactRelationshipEnum.other:
        return l10n?.contactRelationshipOther ?? 'Khác';
    }
  }
}
