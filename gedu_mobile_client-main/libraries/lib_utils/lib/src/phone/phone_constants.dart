/// Phone validation constants
class PhoneConstants {
  PhoneConstants._();

  /// Common country codes
  static const String vietnam = 'VN';
  static const String unitedStates = 'US';
  static const String unitedKingdom = 'GB';
  static const String canada = 'CA';
  static const String australia = 'AU';
  static const String germany = 'DE';
  static const String france = 'FR';
  static const String japan = 'JP';
  static const String southKorea = 'KR';
  static const String china = 'CN';
  static const String india = 'IN';
  static const String singapore = 'SG';
  static const String malaysia = 'MY';
  static const String thailand = 'TH';
  static const String indonesia = 'ID';
  static const String philippines = 'PH';

  /// Vietnamese mobile prefixes
  static const List<String> vietnameseMobilePrefixes = [
    '03', '05', '07', '08', '09', // Viettel, Vinaphone, Mobifone, Vietnamobile, Gmobile
  ];

  /// Vietnamese phone number patterns
  static const List<String> vietnamesePhonePatterns = [
    r'^84[3|5|7|8|9][0-9]{8}$', // +84 followed by mobile prefixes
    r'^0[3|5|7|8|9][0-9]{8}$',  // 0 followed by mobile prefixes
    r'^[3|5|7|8|9][0-9]{8}$',   // Mobile prefixes only
  ];

  /// Common phone number length ranges
  static const int minPhoneLength = 7;
  static const int maxPhoneLength = 15;

  /// Error messages
  static const String errorInvalidFormat = 'Invalid phone number format';
  static const String errorTooShort = 'Phone number is too short';
  static const String errorTooLong = 'Phone number is too long';
  static const String errorInvalidCountry = 'Invalid country code';
  static const String errorInvalidVietnamese = 'Invalid Vietnamese phone number';
  static const String errorValidationFailed = 'Phone number validation failed';

  /// Success messages
  static const String successValidPhone = 'Valid phone number';
  static const String successValidVietnamese = 'Valid Vietnamese phone number';
} 