import 'phone_validator.dart';

/// Extensions for phone number validation
extension PhoneNumberExtensions on String {
  /// Check if the string is a valid phone number format
  bool get isValidPhoneFormat => PhoneValidator.isValidFormat(this);

  /// Check if the string is a valid Vietnamese phone number
  bool get isValidVietnamesePhone =>
      PhoneValidator.isValidVietnamesePhone(this);

  /// Format the phone number for Vietnamese format
  String get formatVietnamesePhone =>
      PhoneValidator.formatVietnamesePhone(this);

  /// Extract phone parts (country code and national number)
  Map<String, String> get phoneParts => PhoneValidator.extractPhoneParts(this);

  /// Validate phone number with default country (VN)
  Future<PhoneValidationResult> validatePhone() async {
    return PhoneValidator.validate(this);
  }

  /// Format Vietnamese phone number for display
  Future<String> formatPhone() async {
    return PhoneValidator.formatPhoneNumber(this);
  }

  /// Get country code from phone number
  Future<String?> getPhoneCountryCode() async {
    return PhoneValidator.getCountryCode(this);
  }

  /// Get national number (without country code)
  Future<String?> getPhoneNationalNumber() async {
    return PhoneValidator.getNationalNumber(this);
  }

  /// Check if phone number is mobile number
  Future<bool> isMobilePhone() async {
    return PhoneValidator.isMobileNumber(this);
  }
}
