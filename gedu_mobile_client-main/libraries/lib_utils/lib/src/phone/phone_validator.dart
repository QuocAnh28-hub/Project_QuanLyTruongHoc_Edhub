/// Phone number validation result
class PhoneValidationResult {
  const PhoneValidationResult({
    required this.isValid,
    required this.formattedNumber,
    required this.countryCode,
    required this.nationalNumber,
    required this.errorMessage,
  });

  final bool isValid;
  final String formattedNumber;
  final String countryCode;
  final String nationalNumber;
  final String? errorMessage;

  /// Create a valid result
  factory PhoneValidationResult.valid({
    required String formattedNumber,
    required String countryCode,
    required String nationalNumber,
  }) {
    return PhoneValidationResult(
      isValid: true,
      formattedNumber: formattedNumber,
      countryCode: countryCode,
      nationalNumber: nationalNumber,
      errorMessage: null,
    );
  }

  /// Create an invalid result
  factory PhoneValidationResult.invalid({
    required String errorMessage,
    String formattedNumber = '',
    String countryCode = '',
    String nationalNumber = '',
  }) {
    return PhoneValidationResult(
      isValid: false,
      formattedNumber: formattedNumber,
      countryCode: countryCode,
      nationalNumber: nationalNumber,
      errorMessage: errorMessage,
    );
  }
}

/// Vietnamese phone number validation utility
class PhoneValidator {
  PhoneValidator._();

  /// Vietnamese country code
  static const String vietnamCountryCode = 'VN';

  /// Validate Vietnamese phone number
  static Future<PhoneValidationResult> validateVietnamesePhone(
    String phoneNumber,
  ) async {
    try {
      final isValid = isValidVietnamesePhone(phoneNumber);

      if (!isValid) {
        return PhoneValidationResult.invalid(
          errorMessage: 'Số điện thoại không đúng định dạng',
        );
      }

      final formatted = formatVietnamesePhone(phoneNumber);
      final parts = extractPhoneParts(phoneNumber);

      return PhoneValidationResult.valid(
        formattedNumber: formatted,
        countryCode: parts['countryCode'] ?? vietnamCountryCode,
        nationalNumber: parts['nationalNumber'] ?? phoneNumber,
      );
    } catch (e) {
      return PhoneValidationResult.invalid(
        errorMessage: 'Lỗi xác thực số điện thoại: ${e.toString()}',
      );
    }
  }

  /// Validate Vietnamese phone number
  static Future<PhoneValidationResult> validate(String phoneNumber) async {
    return validateVietnamesePhone(phoneNumber);
  }

  /// Format Vietnamese phone number for display
  static Future<String> formatPhoneNumber(String phoneNumber) async {
    return formatVietnamesePhone(phoneNumber);
  }

  /// Get country code from phone number
  static Future<String?> getCountryCode(String phoneNumber) async {
    final parts = extractPhoneParts(phoneNumber);
    return parts['countryCode'];
  }

  /// Get national number (without country code)
  static Future<String?> getNationalNumber(String phoneNumber) async {
    final parts = extractPhoneParts(phoneNumber);
    return parts['nationalNumber'];
  }

  /// Check if phone number is mobile number
  static Future<bool> isMobileNumber(String phoneNumber) async {
    return isValidVietnamesePhone(phoneNumber);
  }

  /// Simple validation without external library (basic format check)
  static bool isValidFormat(String phoneNumber) {
    // Remove all non-digit characters
    final digitsOnly = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');

    // Check if it has reasonable length (7-15 digits)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return false;
    }

    // Check if it starts with a valid digit
    if (!RegExp(r'^[1-9]').hasMatch(digitsOnly)) {
      return false;
    }

    return true;
  }

  /// Validate Vietnamese phone numbers specifically
  static bool isValidVietnamesePhone(String phoneNumber) {
    // Remove all non-digit characters
    final digitsOnly = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');

    // Vietnamese phone number patterns
    final patterns = [
      RegExp(r'^84[3|5|7|8|9][0-9]{8}$'), // +84 followed by mobile prefixes
      RegExp(r'^0[3|5|7|8|9][0-9]{8}$'), // 0 followed by mobile prefixes
      RegExp(r'^[3|5|7|8|9][0-9]{8}$'), // Mobile prefixes only
    ];

    return patterns.any((pattern) => pattern.hasMatch(digitsOnly));
  }

  /// Get Vietnamese phone number format
  static String formatVietnamesePhone(String phoneNumber) {
    // Remove all non-digit characters
    final digitsOnly = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');

    // If it starts with 84, remove it and add 0
    if (digitsOnly.startsWith('84') && digitsOnly.length == 11) {
      return '0${digitsOnly.substring(2)}';
    }

    // If it's already in correct format (0xxxxxxxxx), return as is
    if (digitsOnly.startsWith('0') && digitsOnly.length == 10) {
      return digitsOnly;
    }

    // If it's missing the leading 0, add it
    if (digitsOnly.length == 9 &&
        RegExp(r'^[3|5|7|8|9]').hasMatch(digitsOnly)) {
      return '0$digitsOnly';
    }

    return digitsOnly;
  }

  /// Extract country code and national number
  static Map<String, String> extractPhoneParts(String phoneNumber) {
    // Remove all non-digit characters
    final digitsOnly = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');

    // Check if it starts with 84 (Vietnam country code)
    if (digitsOnly.startsWith('84') && digitsOnly.length >= 11) {
      return {'countryCode': '84', 'nationalNumber': digitsOnly.substring(2)};
    }

    // Default to Vietnam (84) if no country code detected
    return {'countryCode': '84', 'nationalNumber': digitsOnly};
  }
}
