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
  AppLocalizations(String locale) : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

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
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates = <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('vi')
  ];

  /// Title for the first onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Welcome to G-Edu'**
  String get onboardingWelcomeTitle1;

  /// Description for the first onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Gedu is a powerful support application, helping Teachers: manage classes effectively and communicate with Parents easily, so that every class hour is and every student is carefully cared for'**
  String get onboardingWelcomeDescription1;

  /// Title for the second onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Smart class management'**
  String get onboardingWelcomeTitle2;

  /// Description for the second onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Intuitive teaching, effective assignment delivery'**
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
  /// **'Smart class management'**
  String get onboardingWelcomeTitle4;

  /// Description for the fourth onboarding screen
  ///
  /// In en, this message translates to:
  /// **'Intuitive teaching, effective assignment delivery'**
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

  /// First time login label
  ///
  /// In en, this message translates to:
  /// **'First Time Login'**
  String get loginFirstTimeLabel;

  /// Login page title
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get loginTitle;

  /// Login page subtitle
  ///
  /// In en, this message translates to:
  /// **'Select Province/City and enter registered phone number, provided password.'**
  String get loginSubtitle;

  /// Province/City field label
  ///
  /// In en, this message translates to:
  /// **'Province/City'**
  String get loginDepartmentLabel;

  /// Province/City field hint
  ///
  /// In en, this message translates to:
  /// **'Select Province/City'**
  String get loginDepartmentHint;

  /// Phone number field label
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get loginPhoneLabel;

  /// Phone number field hint
  ///
  /// In en, this message translates to:
  /// **'Enter phone number'**
  String get loginPhoneHint;

  /// Phone number validation error
  ///
  /// In en, this message translates to:
  /// **'Please enter your phone number'**
  String get loginPhoneError;

  /// Label for email input field
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get loginEmailLabel;

  /// Hint text for email input field
  ///
  /// In en, this message translates to:
  /// **'Enter your email'**
  String get loginEmailHint;

  /// Error message when email is empty
  ///
  /// In en, this message translates to:
  /// **'Please enter your email'**
  String get loginEmailError;

  /// Error message when email format is invalid
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid email address'**
  String get loginEmailFormatError;

  /// Password field label
  ///
  /// In en, this message translates to:
  /// **'Enter Password'**
  String get loginPasswordLabel;

  /// Password field hint
  ///
  /// In en, this message translates to:
  /// **'Enter password'**
  String get loginPasswordHint;

  /// Password validation error
  ///
  /// In en, this message translates to:
  /// **'Please enter your password'**
  String get loginPasswordError;

  /// Login button text
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get loginButtonText;

  /// Remember me checkbox text
  ///
  /// In en, this message translates to:
  /// **'Remember me'**
  String get loginRememberMeText;

  /// Forgot password button text
  ///
  /// In en, this message translates to:
  /// **'Forgot Password'**
  String get loginForgotPasswordText;

  /// Title for forgot password dialog
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgotPasswordTitle;

  /// Message shown in forgot password dialog
  ///
  /// In en, this message translates to:
  /// **'Please contact your homeroom teacher to reset your password.'**
  String get forgotPasswordMessage;

  /// Button text to close forgot password dialog
  ///
  /// In en, this message translates to:
  /// **'I understand'**
  String get forgotPasswordButtonText;

  /// Title for change password success page
  ///
  /// In en, this message translates to:
  /// **'Password changed successfully'**
  String get changePasswordSuccessTitle;

  /// Message for change password success page
  ///
  /// In en, this message translates to:
  /// **'You have successfully changed your password and need to log in again.'**
  String get changePasswordSuccessMessage;

  /// Button text for change password success page
  ///
  /// In en, this message translates to:
  /// **'Log in again'**
  String get changePasswordSuccessButtonText;

  /// Title for change password page
  ///
  /// In en, this message translates to:
  /// **'Change password'**
  String get changePasswordTitle;

  /// Subtitle for change password page
  ///
  /// In en, this message translates to:
  /// **'Create a new password to protect your account.'**
  String get changePasswordSubtitle;

  /// Current password field label
  ///
  /// In en, this message translates to:
  /// **'Current password'**
  String get changePasswordCurrentPasswordLabel;

  /// Current password field hint
  ///
  /// In en, this message translates to:
  /// **'Enter current password'**
  String get changePasswordCurrentPasswordHint;

  /// Navigation bar title for change password page
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get changePasswordNavTitle;

  /// Label for new password field
  ///
  /// In en, this message translates to:
  /// **'New password'**
  String get changePasswordNewPasswordLabel;

  /// New password field hint
  ///
  /// In en, this message translates to:
  /// **'Enter new password'**
  String get changePasswordNewPasswordHint;

  /// Label for confirm password field
  ///
  /// In en, this message translates to:
  /// **'New password'**
  String get changePasswordConfirmPasswordLabel;

  /// Confirm password field hint
  ///
  /// In en, this message translates to:
  /// **'Confirm new password'**
  String get changePasswordConfirmPasswordHint;

  /// Title for password requirements section
  ///
  /// In en, this message translates to:
  /// **'New password must include'**
  String get changePasswordRequirementsTitle;

  /// Minimum characters requirement
  ///
  /// In en, this message translates to:
  /// **'Minimum 8 characters'**
  String get changePasswordRequirementMinChars;

  /// Minimum letter requirement
  ///
  /// In en, this message translates to:
  /// **'Minimum 1 letter'**
  String get changePasswordRequirementMinLetter;

  /// Minimum number requirement
  ///
  /// In en, this message translates to:
  /// **'Minimum 1 number'**
  String get changePasswordRequirementMinNumber;

  /// Weak password strength indicator
  ///
  /// In en, this message translates to:
  /// **'Weak'**
  String get changePasswordStrengthWeak;

  /// Strong password strength indicator
  ///
  /// In en, this message translates to:
  /// **'Strong'**
  String get changePasswordStrengthStrong;

  /// Button text for change password
  ///
  /// In en, this message translates to:
  /// **'Change password'**
  String get changePasswordButtonText;

  /// Error message when passwords don't match
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match'**
  String get changePasswordErrorPasswordsNotMatch;

  /// Loading message shown during login process
  ///
  /// In en, this message translates to:
  /// **'Logging in...'**
  String get loginLoadingMessage;

  /// Loading message shown during password change process
  ///
  /// In en, this message translates to:
  /// **'Updating password...'**
  String get changePasswordLoadingMessage;

  /// Title for language selection bottom sheet
  ///
  /// In en, this message translates to:
  /// **'Select Language'**
  String get languageSelectionTitle;

  /// English language option
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get languageEnglish;

  /// Vietnamese language option
  ///
  /// In en, this message translates to:
  /// **'Tiếng Việt'**
  String get languageVietnamese;

  /// Text for language selection button
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get languageButtonText;

  /// Student status: waiting for enrollment
  ///
  /// In en, this message translates to:
  /// **'Waiting for enrollment'**
  String get studentStatusWaitingForEnrollment;

  /// Student status: currently studying
  ///
  /// In en, this message translates to:
  /// **'Currently studying'**
  String get studentStatusCurrentlyStudying;

  /// Student status: on hold
  ///
  /// In en, this message translates to:
  /// **'On hold'**
  String get studentStatusOnHold;

  /// Student status: graduated
  ///
  /// In en, this message translates to:
  /// **'Graduated'**
  String get studentStatusGraduated;

  /// Student status: dropped out
  ///
  /// In en, this message translates to:
  /// **'Dropped out'**
  String get studentStatusDroppedOut;

  /// Student gender: male
  ///
  /// In en, this message translates to:
  /// **'Male'**
  String get studentGenderMale;

  /// Student gender: female
  ///
  /// In en, this message translates to:
  /// **'Female'**
  String get studentGenderFemale;

  /// Province selection title
  ///
  /// In en, this message translates to:
  /// **'Select Province/City'**
  String get provinceSelectionTitle;

  /// Province search hint
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get provinceSearchHint;

  /// Province search label
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get provinceSearchLabel;

  /// Dashboard logout confirmation text
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get dashboardConfirmLogout;

  /// Dashboard logout error message prefix
  ///
  /// In en, this message translates to:
  /// **'Logout failed: '**
  String get dashboardLogoutError;

  /// Dashboard home tab label
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get dashboardTabHome;

  /// Dashboard messages tab label
  ///
  /// In en, this message translates to:
  /// **'Messages'**
  String get dashboardTabMessages;

  /// Dashboard news feed tab label
  ///
  /// In en, this message translates to:
  /// **'News Feed'**
  String get dashboardTabNewsFeed;

  /// Dashboard notifications tab label
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get dashboardTabNotifications;

  /// Dashboard account tab label
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get dashboardTabAccount;

  /// Dashboard greeting text
  ///
  /// In en, this message translates to:
  /// **'Good morning'**
  String get dashboardGreeting;

  /// Dashboard greeting with user name
  ///
  /// In en, this message translates to:
  /// **'Good morning,\n{firstName} {lastName}'**
  String dashboardGreetingWithName(String firstName, String lastName);

  /// Dashboard student name placeholder
  ///
  /// In en, this message translates to:
  /// **'Student Name'**
  String get dashboardStudentNamePlaceholder;

  /// Dashboard class placeholder
  ///
  /// In en, this message translates to:
  /// **'Class'**
  String get dashboardClassPlaceholder;

  /// Dashboard no class yet placeholder
  ///
  /// In en, this message translates to:
  /// **'No class yet'**
  String get dashboardNoClassYet;

  /// Dashboard teaching classes title
  ///
  /// In en, this message translates to:
  /// **'Teaching Classes'**
  String get dashboardTeachingClasses;

  /// Dashboard student profile text
  ///
  /// In en, this message translates to:
  /// **'Student Profile'**
  String get dashboardStudentProfile;

  /// Dashboard message feature text
  ///
  /// In en, this message translates to:
  /// **'Send Message'**
  String get dashboardFeatureMessage;

  /// Dashboard schedule feature text
  ///
  /// In en, this message translates to:
  /// **'Schedule'**
  String get dashboardFeatureSchedule;

  /// Dashboard menu feature text
  ///
  /// In en, this message translates to:
  /// **'Menu'**
  String get dashboardFeatureMenu;

  /// Dashboard view schedule feature text
  ///
  /// In en, this message translates to:
  /// **'View Schedule'**
  String get dashboardFeatureViewSchedule;

  /// Dashboard view menu feature text
  ///
  /// In en, this message translates to:
  /// **'View Menu'**
  String get dashboardFeatureViewMenu;

  /// Dashboard notifications section title
  ///
  /// In en, this message translates to:
  /// **'New Notifications'**
  String get dashboardNotificationsTitle;

  /// Dashboard attendance status section title
  ///
  /// In en, this message translates to:
  /// **'Attendance Status'**
  String get dashboardAttendanceTitle;

  /// Dashboard today's schedule section title
  ///
  /// In en, this message translates to:
  /// **'Today\'s Schedule'**
  String get dashboardScheduleTitle;

  /// Dashboard see all button text
  ///
  /// In en, this message translates to:
  /// **'See All'**
  String get dashboardSeeAll;

  /// Dashboard attendance present status
  ///
  /// In en, this message translates to:
  /// **'Present'**
  String get dashboardAttendancePresent;

  /// Dashboard schedule description when student has classes
  ///
  /// In en, this message translates to:
  /// **'Today My An has 5 classes in the morning and afternoon.'**
  String get dashboardScheduleEmpty;

  /// Dashboard class name with prefix
  ///
  /// In en, this message translates to:
  /// **'Class {className}'**
  String dashboardClassPrefix(String className);

  /// Dashboard attendance feature text
  ///
  /// In en, this message translates to:
  /// **'Attendance'**
  String get dashboardFeatureAttendance;

  /// Dashboard tuition feature text
  ///
  /// In en, this message translates to:
  /// **'Tuition'**
  String get dashboardFeatureTuition;

  /// Dashboard scores feature text
  ///
  /// In en, this message translates to:
  /// **'Scores'**
  String get dashboardFeatureScores;

  /// Dashboard leave request feature text
  ///
  /// In en, this message translates to:
  /// **'Leave Request'**
  String get dashboardFeatureLeaveRequest;

  /// Dashboard digital transcript feature text
  ///
  /// In en, this message translates to:
  /// **'Digital Transcript'**
  String get dashboardFeatureTranscript;

  /// Dashboard health information feature text
  ///
  /// In en, this message translates to:
  /// **'Health Information'**
  String get dashboardFeatureHealthInfo;

  /// Dashboard view profile button text
  ///
  /// In en, this message translates to:
  /// **'View Profile'**
  String get dashboardViewProfile;

  /// Dashboard recent notifications section title
  ///
  /// In en, this message translates to:
  /// **'Recent Notifications'**
  String get dashboardRecentNotifications;

  /// Dashboard new notifications count message
  ///
  /// In en, this message translates to:
  /// **'You have {count} new notifications'**
  String dashboardNewNotificationsCount(int count);

  /// Dashboard school week section title
  ///
  /// In en, this message translates to:
  /// **'School Week'**
  String get dashboardSchoolWeek;

  /// Dashboard school week message
  ///
  /// In en, this message translates to:
  /// **'Week {week} - Active Learning Week'**
  String dashboardSchoolWeekMessage(int week);

  /// Dashboard confirm student info prompt prefix
  ///
  /// In en, this message translates to:
  /// **'Please check and confirm the information of'**
  String get dashboardConfirmStudentInfoPrefix;

  /// Dashboard confirm student info prompt suffix
  ///
  /// In en, this message translates to:
  /// **'so Gedu can provide the most accurate information.'**
  String get dashboardConfirmStudentInfoSuffix;

  /// Dashboard check and confirm button text
  ///
  /// In en, this message translates to:
  /// **'Check and confirm'**
  String get dashboardCheckAndConfirm;

  /// Dashboard account management title
  ///
  /// In en, this message translates to:
  /// **'Account Management'**
  String get dashboardAccountManagementTitle;

  /// Dashboard change password text
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get dashboardChangePassword;

  /// Dashboard notification settings text
  ///
  /// In en, this message translates to:
  /// **'Notification Settings'**
  String get dashboardNotificationSettings;

  /// Dashboard support title
  ///
  /// In en, this message translates to:
  /// **'Support'**
  String get dashboardSupportTitle;

  /// Dashboard user guide text
  ///
  /// In en, this message translates to:
  /// **'User Guide'**
  String get dashboardUserGuide;

  /// Dashboard video guide text
  ///
  /// In en, this message translates to:
  /// **'Video Guide'**
  String get dashboardVideoGuide;

  /// Dashboard FAQ text
  ///
  /// In en, this message translates to:
  /// **'FAQ'**
  String get dashboardFAQ;

  /// Dashboard logout text
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get dashboardLogout;

  /// Dashboard logout confirmation message
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to logout?'**
  String get dashboardLogoutConfirmation;

  /// Dashboard cancel text
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get dashboardCancel;

  /// Student review welcome title
  ///
  /// In en, this message translates to:
  /// **'Welcome Parent,'**
  String get studentReviewWelcomeTitle;

  /// Student review instruction text
  ///
  /// In en, this message translates to:
  /// **'Your account is linked to multiple students. Please select a student to continue.'**
  String get studentReviewInstruction;

  /// Student review class label
  ///
  /// In en, this message translates to:
  /// **'Class'**
  String get studentReviewClassLabel;

  /// Student review school label
  ///
  /// In en, this message translates to:
  /// **'School'**
  String get studentReviewSchoolLabel;

  /// Student review continue button
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get studentReviewContinueButton;

  /// Student review error message prefix
  ///
  /// In en, this message translates to:
  /// **'An error occurred:'**
  String get studentReviewErrorMessage;

  /// Student review retry button
  ///
  /// In en, this message translates to:
  /// **'Try again'**
  String get studentReviewRetryButton;

  /// Student review no name placeholder
  ///
  /// In en, this message translates to:
  /// **'No name yet'**
  String get studentReviewNoName;

  /// Student review class placeholder
  ///
  /// In en, this message translates to:
  /// **'Class'**
  String get studentReviewClassPlaceholder;

  /// Profile page title
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get profileAccountTitle;

  /// Profile student profile text
  ///
  /// In en, this message translates to:
  /// **'Student Profile'**
  String get profileStudentProfile;

  /// Student selection sheet title
  ///
  /// In en, this message translates to:
  /// **'Select Student'**
  String get studentSelectionTitle;

  /// Please select a student message
  ///
  /// In en, this message translates to:
  /// **'Please select a student to continue'**
  String get studentSelectionPleaseSelect;

  /// Short please select a student message
  ///
  /// In en, this message translates to:
  /// **'Please select a student'**
  String get studentSelectionPleaseSelectShort;

  /// Profile no phone number placeholder
  ///
  /// In en, this message translates to:
  /// **'No phone number yet'**
  String get profileNoPhoneYet;

  /// Student profile page title
  ///
  /// In en, this message translates to:
  /// **'Student Profile'**
  String get studentProfileTitle;

  /// Personal information section title
  ///
  /// In en, this message translates to:
  /// **'Personal Information'**
  String get personalInformationTitle;

  /// Personal information section subtitle
  ///
  /// In en, this message translates to:
  /// **'Student details and contact information.'**
  String get personalInformationSubtitle;

  /// Academic and policy section title
  ///
  /// In en, this message translates to:
  /// **'Academic & Policy'**
  String get academicPolicyTitle;

  /// Academic and policy section subtitle
  ///
  /// In en, this message translates to:
  /// **'Academic information and general regulations.'**
  String get academicPolicySubtitle;

  /// Health information section title
  ///
  /// In en, this message translates to:
  /// **'Health Information'**
  String get healthInformationTitle;

  /// Health information section subtitle
  ///
  /// In en, this message translates to:
  /// **'Information about allergies and underlying medical conditions.'**
  String get healthInformationSubtitle;

  /// Document profile section title
  ///
  /// In en, this message translates to:
  /// **'Document Profile'**
  String get documentProfileTitle;

  /// Document profile section subtitle
  ///
  /// In en, this message translates to:
  /// **'Identification documents and required documents.'**
  String get documentProfileSubtitle;

  /// Status when student information needs confirmation
  ///
  /// In en, this message translates to:
  /// **'NEEDS CONFIRMATION'**
  String get needsConfirmationStatus;

  /// Status tag for items that are already confirmed
  ///
  /// In en, this message translates to:
  /// **'ĐÃ XÁC NHẬN'**
  String get alreadyConfirmedStatus;

  /// Status tag for items that need to be added to profile
  ///
  /// In en, this message translates to:
  /// **'ADD TO PROFILE'**
  String get addToProfileStatus;

  /// Student ID label
  ///
  /// In en, this message translates to:
  /// **'Student ID'**
  String get studentIdLabel;

  /// Class label
  ///
  /// In en, this message translates to:
  /// **'Class'**
  String get classLabel;

  /// Curriculum label
  ///
  /// In en, this message translates to:
  /// **'Curriculum'**
  String get curriculumLabel;

  /// Primary contact label
  ///
  /// In en, this message translates to:
  /// **'Primary Contact'**
  String get primaryContactLabel;

  /// Father label
  ///
  /// In en, this message translates to:
  /// **'Father'**
  String get fatherLabel;

  /// Retry button text
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No class yet placeholder
  ///
  /// In en, this message translates to:
  /// **'No class yet'**
  String get noClassYet;

  /// Loading message for student profile
  ///
  /// In en, this message translates to:
  /// **'Loading student profile...'**
  String get loadingStudentProfile;

  /// Academic information section title
  ///
  /// In en, this message translates to:
  /// **'Academic Information'**
  String get academicInformationTitle;

  /// Contact person label
  ///
  /// In en, this message translates to:
  /// **'Contact Person'**
  String get contactPersonLabel;

  /// Admission information section title
  ///
  /// In en, this message translates to:
  /// **'Admission Information'**
  String get admissionInformationTitle;

  /// Admission date label
  ///
  /// In en, this message translates to:
  /// **'Date of admission'**
  String get admissionDateLabel;

  /// Admission academic year label
  ///
  /// In en, this message translates to:
  /// **'Admission academic year'**
  String get admissionYearLabel;

  /// Admission type label
  ///
  /// In en, this message translates to:
  /// **'Admission type'**
  String get admissionTypeLabel;

  /// In district admission type
  ///
  /// In en, this message translates to:
  /// **'In District'**
  String get admissionTypeInDistrict;

  /// Out of district admission type
  ///
  /// In en, this message translates to:
  /// **'Out of District'**
  String get admissionTypeOutOfDistrict;

  /// Transfer school admission type
  ///
  /// In en, this message translates to:
  /// **'Transfer School'**
  String get admissionTypeTransfer;

  /// Class information section title
  ///
  /// In en, this message translates to:
  /// **'Class Information'**
  String get classInformationTitle;

  /// Status label
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get statusLabel;

  /// Currently studying status
  ///
  /// In en, this message translates to:
  /// **'ĐANG HỌC'**
  String get currentlyStudyingStatus;

  /// Regime and policy section title
  ///
  /// In en, this message translates to:
  /// **'Regime & Policy'**
  String get regimePolicyTitle;

  /// Priority status label
  ///
  /// In en, this message translates to:
  /// **'Priority status'**
  String get priorityStatusLabel;

  /// Disability status label
  ///
  /// In en, this message translates to:
  /// **'Disability status'**
  String get disabilityStatusLabel;

  /// Medical info group for undetermined cases
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get medicalInfoGroupUndetermined;

  /// Medical info group for allergies
  ///
  /// In en, this message translates to:
  /// **'Allergy'**
  String get medicalInfoGroupAllergy;

  /// Medical info group for chronic or underlying diseases
  ///
  /// In en, this message translates to:
  /// **'Chronic/Underlying Disease'**
  String get medicalInfoGroupChronicOrUnderlying;

  /// Medical info type for undetermined cases
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get medicalInfoTypeUndetermined;

  /// Medical info type for food allergies
  ///
  /// In en, this message translates to:
  /// **'Food Allergy'**
  String get medicalInfoTypeFoodAllergy;

  /// Medical info type for drug allergies
  ///
  /// In en, this message translates to:
  /// **'Drug Allergy'**
  String get medicalInfoTypeDrugAllergy;

  /// Medical info type for chronic or underlying diseases
  ///
  /// In en, this message translates to:
  /// **'Chronic/Underlying Disease'**
  String get medicalInfoTypeChronicOrUnderlying;

  /// Allergies section title
  ///
  /// In en, this message translates to:
  /// **'Allergies'**
  String get allergiesTitle;

  /// Food allergies label
  ///
  /// In en, this message translates to:
  /// **'Food allergies'**
  String get foodAllergyLabel;

  /// Drug allergies label
  ///
  /// In en, this message translates to:
  /// **'Drug allergies'**
  String get drugAllergyLabel;

  /// Chronic diseases section title
  ///
  /// In en, this message translates to:
  /// **'Chronic/Underlying Diseases'**
  String get chronicDiseasesTitle;

  /// Chronic diseases label
  ///
  /// In en, this message translates to:
  /// **'Chronic/Underlying Diseases'**
  String get chronicDiseasesLabel;

  /// Additional notes section title
  ///
  /// In en, this message translates to:
  /// **'Additional Notes (Special characteristics or habits to note)'**
  String get additionalNotesTitle;

  /// Additional notes label
  ///
  /// In en, this message translates to:
  /// **'Additional notes'**
  String get additionalNotesLabel;

  /// Profile has information status
  ///
  /// In en, this message translates to:
  /// **'HAS INFO'**
  String get profileNeutralStatus;

  /// Contact relationship - Father
  ///
  /// In en, this message translates to:
  /// **'Father'**
  String get contactRelationshipFather;

  /// Contact relationship - Mother
  ///
  /// In en, this message translates to:
  /// **'Mother'**
  String get contactRelationshipMother;

  /// Contact relationship - Other
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get contactRelationshipOther;

  /// Student information page title
  ///
  /// In en, this message translates to:
  /// **'Personal Information'**
  String get studentInformationTitle;

  /// Status when student information is confirmed
  ///
  /// In en, this message translates to:
  /// **'CONFIRMED'**
  String get confirmedStatus;

  /// General information section title
  ///
  /// In en, this message translates to:
  /// **'General Information'**
  String get generalInformationTitle;

  /// ID/CCCD label
  ///
  /// In en, this message translates to:
  /// **'ID/CCCD'**
  String get idCccdLabel;

  /// Date of birth label
  ///
  /// In en, this message translates to:
  /// **'Date of Birth'**
  String get dateOfBirthLabel;

  /// Gender label
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get genderLabel;

  /// Nationality label
  ///
  /// In en, this message translates to:
  /// **'Nationality'**
  String get nationalityLabel;

  /// Religion label
  ///
  /// In en, this message translates to:
  /// **'Religion'**
  String get religionLabel;

  /// Permanent address label
  ///
  /// In en, this message translates to:
  /// **'Permanent Address'**
  String get permanentAddressLabel;

  /// Temporary address label
  ///
  /// In en, this message translates to:
  /// **'Temporary Address'**
  String get temporaryAddressLabel;

  /// Contact information section title
  ///
  /// In en, this message translates to:
  /// **'Contact Information'**
  String get contactInformationTitle;

  /// Primary contact tag text
  ///
  /// In en, this message translates to:
  /// **'Primary Contact'**
  String get primaryContactTag;

  /// Relationship to student label
  ///
  /// In en, this message translates to:
  /// **'Relationship to student'**
  String get relationshipToStudentLabel;

  /// Year of birth label
  ///
  /// In en, this message translates to:
  /// **'Year of birth'**
  String get yearOfBirthLabel;

  /// Occupation label
  ///
  /// In en, this message translates to:
  /// **'Occupation'**
  String get occupationLabel;

  /// Phone number label
  ///
  /// In en, this message translates to:
  /// **'Phone number'**
  String get phoneNumberLabel;

  /// Confirm student information button text
  ///
  /// In en, this message translates to:
  /// **'Confirm student information'**
  String get confirmStudentInformationButton;

  /// Request information edit button text
  ///
  /// In en, this message translates to:
  /// **'Request information edit'**
  String get requestInformationEditButton;

  /// Student information card subtitle
  ///
  /// In en, this message translates to:
  /// **'Personal information and contact details of the student.'**
  String get studentInformationSubtitle;

  /// Detailed student information section title
  ///
  /// In en, this message translates to:
  /// **'Detailed Student Information'**
  String get detailedStudentInfoTitle;

  /// Male gender label
  ///
  /// In en, this message translates to:
  /// **'Male'**
  String get genderMale;

  /// Female gender label
  ///
  /// In en, this message translates to:
  /// **'Female'**
  String get genderFemale;

  /// Title for request edit info sheet
  ///
  /// In en, this message translates to:
  /// **'Request information edit'**
  String get requestEditInfoTitle;

  /// Label for request details field
  ///
  /// In en, this message translates to:
  /// **'Request details'**
  String get requestEditInfoDetailsLabel;

  /// Hint for request details field
  ///
  /// In en, this message translates to:
  /// **'Please describe the information that needs to be corrected...'**
  String get requestEditInfoDetailsHint;

  /// Title for request submitted sheet
  ///
  /// In en, this message translates to:
  /// **'Request sent'**
  String get requestEditInfoSubmittedTitle;

  /// Subtitle for request submitted sheet
  ///
  /// In en, this message translates to:
  /// **'The school will review your request and respond as soon as possible.'**
  String get requestEditInfoSubmittedSubtitle;

  /// Send information button text
  ///
  /// In en, this message translates to:
  /// **'Send information'**
  String get requestEditInfoSend;

  /// I understand button text
  ///
  /// In en, this message translates to:
  /// **'I understand'**
  String get iUnderstand;

  /// Welcome dialog title with user name
  ///
  /// In en, this message translates to:
  /// **'Welcome {userName}!'**
  String welcomeDialogTitle(String userName);

  /// Welcome dialog message
  ///
  /// In en, this message translates to:
  /// **'G-Edu will be a powerful assistant, helping you manage work and classes more effectively.'**
  String get welcomeDialogMessage;

  /// Welcome dialog button text
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get welcomeDialogButtonText;
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) => <String>['en', 'vi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {


  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en': return AppLocalizationsEn();
    case 'vi': return AppLocalizationsVi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.'
  );
}
