class DaConstants {
  static const double invalidDefaultPrice = -1;
  static const int invalidTimeInt = -1;
  static const int toastDurationNormal = 3;
  static const int toastDurationLong = 5;
  static final DateTime defaultDateOfBirth = DateTime(1990);
  static final DateTime minDateOfBirth = DateTime(1900);
  static const Map<String, dynamic> emptyMap = {};
  static const int maxInt32 = 0x7fffffff;
  static const Duration expectedCacheDuration = Duration(minutes: 2);
  static const Duration loadingDuration = Duration(milliseconds: 600);
  static const Duration smoothDuration = Duration(milliseconds: 200);
  static const Duration initTimeout = Duration(seconds: 15);
  static const Duration initShortTimeout = Duration(seconds: 5);
  static const Duration avoidTimingDuration = Duration(milliseconds: 10);
  static const Duration defaultOtpExpired = Duration(minutes: 3);
  static const Duration defaultOtpResend = Duration(minutes: 1);
  static const Duration pushNotificationThrottleDuration = Duration(seconds: 1);
}
