import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_vi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('vi'),
  ];

  /// Title for the first onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Welcome to G-Edu'**
  String get onboardingWelcomeTitle1;

  /// Description for the first onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Multi-utility education management application for parents and students.'**
  String get onboardingWelcomeDescription1;

  /// Title for the second onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Track student attendance daily'**
  String get onboardingWelcomeTitle2;

  /// Description for the second onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Complete peace of mind with attendance and activity photos of your child.'**
  String get onboardingWelcomeDescription2;

  /// Title for the third onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Convenient tuition payment without fees'**
  String get onboardingWelcomeTitle3;

  /// Description for the third onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Efficient tuition management, saving time and costs.'**
  String get onboardingWelcomeDescription3;

  /// Title for the fourth onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Easy connection with Parents and students'**
  String get onboardingWelcomeTitle4;

  /// Description for the fourth onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Send quick notifications to the entire class or private exchanges with individual parents, making communication effective and timely'**
  String get onboardingWelcomeDescription4;

  /// Skip button text for onboarding
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get onboardingSkipButton;

  /// Next button text for onboarding
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get onboardingNextButton;

  /// Login button text for onboarding
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get onboardingLoginButton;

  /// Dashboard greeting text
  ///
  /// In en, this message translates to:
  /// **'Xin chào'**
  String get dashboardGreeting;

  /// Dashboard student section title
  ///
  /// In en, this message translates to:
  /// **'Học sinh của bạn'**
  String get dashboardStudentSectionTitle;

  /// Dashboard view all notifications button
  ///
  /// In en, this message translates to:
  /// **'Xem tất cả'**
  String get dashboardViewAllNotifications;

  /// Dashboard notifications section title
  ///
  /// In en, this message translates to:
  /// **'Thông báo'**
  String get dashboardNotificationsTitle;

  /// Dashboard school week section title
  ///
  /// In en, this message translates to:
  /// **'Tuần học'**
  String get dashboardSchoolWeekTitle;

  /// Dashboard feature titles
  ///
  /// In en, this message translates to:
  /// **'Điểm danh'**
  String get dashboardFeatureAttendance;

  /// In en, this message translates to:
  /// **'Học phí'**
  String get dashboardFeatureTuition;

  /// In en, this message translates to:
  /// **'Thời khóa biểu'**
  String get dashboardFeatureSchedule;

  /// In en, this message translates to:
  /// **'Báo cáo'**
  String get dashboardFeatureReport;

  /// In en, this message translates to:
  /// **'Hoạt động'**
  String get dashboardFeatureActivity;

  /// In en, this message translates to:
  /// **'Thực đơn'**
  String get dashboardFeatureMenu;

  /// Dashboard account management section title
  ///
  /// In en, this message translates to:
  /// **'Quản lý tài khoản'**
  String get dashboardAccountManagementTitle;

  /// Dashboard support section title
  ///
  /// In en, this message translates to:
  /// **'Hỗ trợ'**
  String get dashboardSupportTitle;

  /// Dashboard menu items
  ///
  /// In en, this message translates to:
  /// **'Đổi mật khẩu'**
  String get dashboardChangePassword;

  /// In en, this message translates to:
  /// **'Hồ sơ học sinh'**
  String get dashboardStudentProfile;

  /// In en, this message translates to:
  /// **'Cài đặt thông báo'**
  String get dashboardNotificationSettings;

  /// In en, this message translates to:
  /// **'Tài liệu hướng dẫn sử dụng'**
  String get dashboardUserGuide;

  /// In en, this message translates to:
  /// **'Video hướng dẫn'**
  String get dashboardVideoGuide;

  /// In en, this message translates to:
  /// **'Câu hỏi thường gặp'**
  String get dashboardFAQ;

  /// In en, this message translates to:
  /// **'Đăng xuất'**
  String get dashboardLogout;

  /// Dashboard logout confirmation dialog
  ///
  /// In en, this message translates to:
  /// **'Bạn có chắc chắn muốn đăng xuất?'**
  String get dashboardLogoutConfirmation;

  /// Dashboard logout error message
  ///
  /// In en, this message translates to:
  /// **'Đăng xuất thất bại: '**
  String get dashboardLogoutError;

  /// Dashboard tab titles
  ///
  /// In en, this message translates to:
  /// **'Trang chủ'**
  String get dashboardTabHome;

  /// In en, this message translates to:
  /// **'Tin nhắn'**
  String get dashboardTabMessages;

  /// In en, this message translates to:
  /// **'Bảng tin'**
  String get dashboardTabNewsFeed;

  /// In en, this message translates to:
  /// **'Thông báo'**
  String get dashboardTabNotifications;

  /// In en, this message translates to:
  /// **'Tài khoản'**
  String get dashboardTabAccount;

  /// Dashboard dialog buttons
  ///
  /// In en, this message translates to:
  /// **'Hủy'**
  String get dashboardCancel;

  /// In en, this message translates to:
  /// **'Đăng xuất'**
  String get dashboardConfirmLogout;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'vi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'vi':
      return AppLocalizationsVi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
