import 'package:intl/intl.dart';

extension DateTimeExtension on DateTime {
  String toAnalyticTimeStamp() {
    return DateFormat('hh:mm a, EEE, MMM dd, yyyy').format(this);
  }

  String getCurrentGmtFormat() {
    final buffer = StringBuffer(' | GMT');
    buffer
      ..write(timeZoneOffset.isNegative ? '-' : '+') // Writes a string.
      ..write(timeZoneOffset.inHours.abs().toString().padLeft(2, '0'))
      ..write(':')
      ..write(
        (timeZoneOffset.inMinutes - timeZoneOffset.inHours * 60)
            .abs()
            .toString()
            .padLeft(2, '0'),
      );
    return buffer.toString();
  }

  bool get isPast {
    return difference(DateTime.now()).inSeconds < 0;
  }

  bool get isInTenMinutes {
    return difference(DateTime.now()).inSeconds < 600;
  }

  bool get isInHalfHour {
    return difference(DateTime.now()).inMinutes <= 30;
  }

  bool get isToday {
    final now = DateTime.now();
    return now.day == day && now.month == month && now.year == year;
  }

  bool isUnder(int age) {
    final now = DateTime.now();
    final date = DateTime(
      now.year - age,
      now.month,
      now.day,
      now.hour,
      now.minute,
      now.second,
    );
    return isAfter(date);
  }

  bool get isTomorrow {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return tomorrow.day == day &&
        tomorrow.month == month &&
        tomorrow.year == year;
  }

  bool get isInTwoDays {
    final tomorrow = DateTime.now().add(const Duration(days: 2));
    return tomorrow.day == day &&
        tomorrow.month == month &&
        tomorrow.year == year;
  }

  int get durationFromNowInSeconds {
    return difference(DateTime.now()).inSeconds;
  }

  String get dayOfBirthDisplayText {
    return DaDateFormat.ddMMyyyyWith(separator: Separator.slash).format(this);
  }

  String get serverFormatText {
    return DateFormat(DateTimeFormat.utcDateTime.pattern).format(this);
  }

  String getTimeUtcFormat() {
    return toUtc().millisecondsSinceEpoch.toUtcDateTime();
  }

  DateTime get ignoreTime {
    return DateTime(year, month, day);
  }
}

enum DaTimeZone {
  asiaBangKok(
    timezone: 'Asia/Bangkok',
    differentHour: 7,
    gmtFormat: 'GMT+07:00',
    displayTimeZone: 'Indochina Time',
  ),
  asiaJakarta(
    timezone: 'Asia/Jakarta',
    differentHour: 7,
    gmtFormat: 'GMT+07:00',
    displayTimeZone: 'Western Indonesia Time',
  ),
  asiaHoChiMinh(
    timezone: 'Asia/Ho_Chi_Minh',
    differentHour: 7,
    gmtFormat: 'GMT+07:00',
    displayTimeZone: 'Indochina Time',
  ),
  asiaKualaLumpur(
    timezone: 'Asia/Kuala_Lumpur',
    differentHour: 8,
    gmtFormat: 'GMT+08:00',
    displayTimeZone: 'Malaysia Time',
  ),
  asiaSingapore(
    timezone: 'Asia/Singapore',
    differentHour: 8,
    gmtFormat: 'GMT+08:00',
    displayTimeZone: 'Singapore Standard Time',
  ),
  asiaManila(
    timezone: 'Asia/Manila',
    differentHour: 8,
    gmtFormat: 'GMT+08:00',
    displayTimeZone: 'Manila',
  );

  const DaTimeZone({
    required this.timezone,
    required this.differentHour,
    required this.gmtFormat,
    required this.displayTimeZone,
  });

  final String timezone;
  final int differentHour;
  final String gmtFormat;
  final String displayTimeZone;

  static DaTimeZone fromString(String timeZone) {
    var c = DaTimeZone.values.firstWhere(
      (e) => e.timezone == timeZone,
      orElse: () {
        return DaTimeZone.asiaSingapore;
      },
    );
    return c;
  }
}

extension DateTimeLong on int {
  String toDateTime({String pattern = 'dd MMM, hh:mm a'}) {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(
      this,
      isUtc: true,
    ).toLocal();
    return DateFormat(pattern).format(dateTime);
  }

  /// Output format 2023-08-10T08:00:00Z
  String toUtcDateTime({String pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'"}) {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(this, isUtc: true);
    return DateFormat(pattern, 'en_US').format(dateTime);
  }

  String toTimeSlot() {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(this, isUtc: false);
    return DateFormat(
      DateTimeFormat.timeOnlyLineBreak.pattern,
    ).format(dateTime).toLowerCase();
  }

  String toDateDisplay() {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(this, isUtc: false);
    return DateFormat(DateTimeFormat.display.pattern).format(dateTime);
  }

  String toAmPm() {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(this, isUtc: false);
    return DateFormat(DateTimeFormat.amPmOnly.pattern).format(dateTime);
  }

  String hourMinuteOnly() {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(this, isUtc: false);
    return DateFormat(DateTimeFormat.hourMinuteOnly.pattern).format(dateTime);
  }

  String toWeekdayAmPm() {
    final dateTime = DateTime.fromMillisecondsSinceEpoch(this, isUtc: false);
    return DateFormat(DateTimeFormat.weekdayAmPm.pattern).format(dateTime);
  }
}

extension DateTimeString on String {
  String changeDateTimeFormat({
    String fromPattern = "dd-MMM-yyyy",
    String toPattern = "yyyy-MM-dd'T'HH:mm:ss'Z'",
  }) {
    try {
      final date = DateFormat(fromPattern).parse(this);
      return DateFormat(toPattern, 'en_US').format(date);
    } on Exception {
      return this;
    }
  }

  String toAppointmentDisplayDateTime({
    String fromPattern = "yyyy-MM-dd'T'HH:mm:ss'Z'",
    String toPattern = "hh:mm a, dd MMMM yyyy",
  }) {
    try {
      final date = DateFormat(fromPattern).parse(this, true).toLocal();
      return DateFormat(toPattern).format(date);
    } on Exception {
      return this;
    }
  }

  DateTime? utcToDateTime() {
    try {
      return DateFormat(
        DateTimeFormat.utcDateTime.pattern,
      ).parse(this, true).toLocal();
    } on Exception {
      return null;
    }
  }

  bool isValidDateTime({String fromPattern = "dd MMM yyyy   hh:mm aa"}) {
    try {
      DateFormat(fromPattern).parse(this);
      return true;
    } catch (e) {
      return false;
    }
  }
}

extension DurationEtx on Duration {
  String get displayCountdown {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    String twoDigitSeconds = twoDigits(inSeconds.remainder(60));
    return inHours == 0
        ? '${inMinutes.remainder(60)}:$twoDigitSeconds'
        : '${twoDigits(inHours)}:${inMinutes.remainder(60)}:$twoDigitSeconds';
  }
}

enum Separator {
  dash('-'),
  slash('/'),
  space(' ');

  const Separator(this.rawValue);

  final String rawValue;
}

class DaDateFormat {
  static DateFormat ddMMyyyyWith({required Separator separator}) =>
      DateFormat('dd${separator.rawValue}MM${separator.rawValue}yyyy');

  static DateFormat ddMMMyyyyWith({required Separator separator}) =>
      withEnLocale('dd${separator.rawValue}MMM${separator.rawValue}yyyy');

  static DateFormat ddMMMWith({required Separator separator}) =>
      withEnLocale('dd${separator.rawValue}MMM');
  static DateFormat ddMMyy = DateFormat('dd/MM/yy');
  static DateFormat mmYYYY = DateFormat('MM/yyyy');
  static DateFormat serverFormat = DateFormat('yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
  static DateFormat hhmmaddMMMyyyy = withEnLocale('hh:mm a, dd MMM yyyy');
  static DateFormat hhmmaddMMMMyyyy = withEnLocale('hh:mm a, dd MMMM yyyy');
  static DateFormat yyyyMMdd = DateFormat('yyyy-MM-dd');
  static DateFormat ddMMMyyyyddmmaa = withEnLocale('dd MMM yyyy   hh:mm aa');
  static DateFormat ddMMMyyyyddmmaa1 = withEnLocale('dd MMM yyyy, hh:mm aa');
  static DateFormat ddMMMyyyy = withEnLocale('dd MMM yyyy');
  static DateFormat ddmmaa = withEnLocale('hh:mm aa');
  static DateFormat yyyyMMddhhmmss = DateFormat('yyyy-MM-dd hh:mm:ssZ');
  static DateFormat hhmma = DateFormat('h:mma');
  static DateFormat hhmmSpaceA = DateFormat('h:mm a');

  static DateFormat withEnLocale(String format) => DateFormat(format, 'en_US');

  static String hhmm = 'HH:mm';
  static String hhmmss = 'HH:mm:ss';
  static String ddMMyyyyWithSlash = 'dd/MM/yyyy';
  static String ddMMMyyyyWithHyphen = 'dd-MMM-yyyy';
  static String ddMMyyyyWithHyphen = 'dd-MM-yyyy';
  static String ddMMMyyyyWithSpace = 'dd MMM yyyy';
  static String ddMMMyyWithSpace = 'dd MMM yy';
  static String ddMMyyyyNoSymbol = 'ddMMyyyy';
  static String yyyyMMddWithHyphen = 'yyyy-MM-dd';
  static String yyyyMMddWithSlash = 'yyyy/MM/dd';
  static String apiWithZ = 'yyyy-MM-dd HH:mm:ssZ';
  static String iso8601WithMiliseconds = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
  static String iso8601 = "yyyy-MM-dd'T'HH:mm:ss";
  static String time12BeforeDate = 'hh:mm a, dd MMM yyyy';
}

enum DateTimeFormat {
  utcDateTime(pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
  utcDateOnly(pattern: 'yyyy-MM-dd'),
  display(pattern: 'dd MMMM yyy'),
  amPmOnly(pattern: 'a'),
  hourMinuteOnly(pattern: 'hh:mm'),
  timeOnly(pattern: 'hh:mm a'),
  weekdayAmPm(pattern: 'EEEE, h:mm a'),
  weekdayHourAmPm(pattern: 'EEEE, ha'),
  weekdayHourMinAmPm(pattern: 'EEEE, h:ma'),
  timeOnlyLineBreak(pattern: 'hh:mm\na'),
  dateTimeLineBreak(pattern: 'dd MMMM yyyy\nhh:mm a');

  const DateTimeFormat({required this.pattern});

  final String pattern;
}

extension DateFormatExtension on DateFormat {
  DateTime? tryParse(String? inputString, [bool utc = false]) {
    if (inputString == null) return null;
    try {
      return parse(inputString, utc);
    } on Exception {
      return null;
    }
  }

  static DateFormat ddMMMyyyy({String? separator}) {
    final aSeparator = separator ?? ' ';
    return DateFormat('dd${aSeparator}MMM${aSeparator}yyyy', 'en_US');
  }
}
