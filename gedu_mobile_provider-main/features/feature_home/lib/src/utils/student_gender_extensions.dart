import 'package:core_localization/core_localization.dart';
import 'package:core_students/core_students.dart';

extension StudentGenderUIExtension on StudentGender {
  String getLocalizedDisplayText(AppLocalizations? l10n) {
    switch (this) {
      case StudentGender.male:
        return l10n?.genderMale ?? 'Nam';
      case StudentGender.female:
        return l10n?.genderFemale ?? 'Nữ';
    }
  }
}
