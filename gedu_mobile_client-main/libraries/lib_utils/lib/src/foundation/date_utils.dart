import 'package:intl/intl.dart';

import '../datetime/datetime_extension.dart';

extension DateTimeExt on DateTime {
  String? toLocalWithFormat(String format) {
    return DateUtils.convertToLocalString(this, format);
  }

  String? toLocalWithddMMMyyyyWithSpace() {
    return toLocalWithFormat(DaDateFormat.ddMMMyyyyWithSpace);
  }

  String? toUTCWithFormat(String format) {
    return DateFormat(format).format(toUtc());
  }

  DateTime startOfDay() {
    return DateTime(year, month, day);
  }

  String millisecondsString() {
    return millisecondsSinceEpoch.toString();
  }
}

extension StringExt on String {
  DateTime? toUTCFromISO() {
    return DateUtils.utcDateFromISO(this);
  }

  DateTime? fromHourMinSec() {
    final format = DateFormat(DaDateFormat.hhmmss);
    try {
      return format.parse(this);
    } catch (e) {
      return null;
    }
  }

  DateTime? toLocalDateTime() {
    return DateTime.tryParse(this);
  }

  DateTime? toDateTimeWithFormat(String formatString) {
    final format = DateFormat(formatString);
    try {
      return format.parse(this);
    } catch (e) {
      return null;
    }
  }
}

class DateUtils {
  static DateTime? utcDateFromISO(String? dateString) {
    var finalString = dateString ?? '';
    if (finalString.isEmpty) {
      return null;
    }
    if (finalString.toLowerCase().endsWith('z') == false) {
      finalString += 'Z';
    }
    return DateTime.tryParse(finalString);
  }

  static String? convertToLocalString(DateTime? dateTime, String format) {
    if (dateTime != null) {
      return DateFormat(format).format(dateTime.toLocal());
    }
    return null;
  }
}
