// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get onboardingWelcomeTitle1 => 'Welcome to G-Edu';

  @override
  String get onboardingWelcomeDescription1 =>
      'Multi-utility education management application for parents and students.';

  @override
  String get onboardingWelcomeTitle2 => 'Track student attendance daily';

  @override
  String get onboardingWelcomeDescription2 =>
      'Complete peace of mind with attendance and activity photos of your child.';

  @override
  String get onboardingWelcomeTitle3 =>
      'Convenient tuition payment without fees';

  @override
  String get onboardingWelcomeDescription3 =>
      'Efficient tuition management, saving time and costs.';

  @override
  String get onboardingSkipButton => 'Skip';

  @override
  String get onboardingNextButton => 'Next';

  @override
  String get onboardingLoginButton => 'Login';

  @override
  String get loginFirstTimeLabel => 'First Time Login';

  @override
  String get loginTitle => 'Login';

  @override
  String get loginSubtitle =>
      'Enter your registered email and provided password.';

  @override
  String get loginDepartmentLabel => 'Province/City';

  @override
  String get loginDepartmentHint => 'Select Province/City';

  @override
  String get loginPhoneLabel => 'Email';

  @override
  String get loginPhoneHint => 'Enter email';

  @override
  String get loginPhoneError => 'Please enter your email';

  @override
  String get loginPasswordLabel => 'Enter Password';

  @override
  String get loginPasswordHint => 'Enter password';

  @override
  String get loginPasswordError => 'Please enter your password';

  @override
  String get loginButtonText => 'Login';

  @override
  String get loginRememberMeText => 'Remember me';

  @override
  String get loginForgotPasswordText => 'Forgot Password';

  @override
  String get forgotPasswordTitle => 'Forgot Password?';

  @override
  String get forgotPasswordMessage =>
      'Please contact your homeroom teacher to reset your password.';

  @override
  String get forgotPasswordButtonText => 'I understand';

  @override
  String get changePasswordSuccessTitle => 'Password changed successfully';

  @override
  String get changePasswordSuccessMessage =>
      'You have successfully changed your password and need to log in again.';

  @override
  String get changePasswordSuccessButtonText => 'Log in again';

  @override
  String get changePasswordTitle => 'Change password';

  @override
  String get changePasswordSubtitle =>
      'Create a new password to protect your account.';

  @override
  String get changePasswordCurrentPasswordLabel => 'Current password';

  @override
  String get changePasswordCurrentPasswordHint => 'Enter current password';

  @override
  String get changePasswordNavTitle => 'Change Password';

  @override
  String get changePasswordNewPasswordLabel => 'New password';

  @override
  String get changePasswordNewPasswordHint => 'Enter new password';

  @override
  String get changePasswordConfirmPasswordLabel => 'New password';

  @override
  String get changePasswordConfirmPasswordHint => 'Confirm new password';

  @override
  String get changePasswordRequirementsTitle => 'New password must include';

  @override
  String get changePasswordRequirementMinChars => 'Minimum 8 characters';

  @override
  String get changePasswordRequirementMinLetter => 'Minimum 1 letter';

  @override
  String get changePasswordRequirementMinNumber => 'Minimum 1 number';

  @override
  String get changePasswordStrengthWeak => 'Weak';

  @override
  String get changePasswordStrengthStrong => 'Strong';

  @override
  String get changePasswordButtonText => 'Change password';

  @override
  String get changePasswordErrorPasswordsNotMatch => 'Passwords do not match';

  @override
  String get loginLoadingMessage => 'Logging in...';

  @override
  String get changePasswordLoadingMessage => 'Updating password...';

  @override
  String get languageSelectionTitle => 'Select Language';

  @override
  String get languageEnglish => 'English';

  @override
  String get languageVietnamese => 'Tiếng Việt';

  @override
  String get languageButtonText => 'Language';

  @override
  String get studentStatusWaitingForEnrollment => 'Waiting for enrollment';

  @override
  String get studentStatusCurrentlyStudying => 'Currently studying';

  @override
  String get studentStatusOnHold => 'On hold';

  @override
  String get studentStatusGraduated => 'Graduated';

  @override
  String get studentStatusDroppedOut => 'Dropped out';

  @override
  String get studentGenderMale => 'Male';

  @override
  String get studentGenderFemale => 'Female';

  @override
  String get provinceSelectionTitle => 'Select Province/City';

  @override
  String get provinceSearchHint => 'Search';

  @override
  String get provinceSearchLabel => 'Search';

  @override
  String get dashboardConfirmLogout => 'Logout';

  @override
  String get dashboardLogoutError => 'Logout failed: ';

  @override
  String get dashboardTabHome => 'Home';

  @override
  String get dashboardTabMessages => 'Messages';

  @override
  String get dashboardTabNewsFeed => 'News Feed';

  @override
  String get dashboardTabNotifications => 'Notifications';

  @override
  String get dashboardTabAccount => 'Account';

  @override
  String get dashboardGreeting => 'Good morning';

  @override
  String dashboardGreetingWithName(String firstName, String lastName) {
    return 'Good morning,\n$firstName $lastName';
  }

  @override
  String get dashboardStudentNamePlaceholder => 'Student Name';

  @override
  String get dashboardClassPlaceholder => 'Class';

  @override
  String get dashboardNoClassYet => 'No class yet';

  @override
  String get dashboardStudentProfile => 'Student Profile';

  @override
  String get dashboardFeatureMessage => 'Send Message';

  @override
  String get dashboardFeatureSchedule => 'Schedule';

  @override
  String get dashboardFeatureMenu => 'Menu';

  @override
  String get dashboardFeatureViewSchedule => 'View Schedule';

  @override
  String get dashboardFeatureViewMenu => 'View Menu';

  @override
  String get dashboardNotificationsTitle => 'New Notifications';

  @override
  String get dashboardAttendanceTitle => 'Attendance Status';

  @override
  String get dashboardScheduleTitle => 'Today\'s Schedule';

  @override
  String get dashboardSeeAll => 'See All';

  @override
  String get dashboardAttendancePresent => 'Present';

  @override
  String get dashboardScheduleEmpty =>
      'Today My An has 5 classes in the morning and afternoon.';

  @override
  String dashboardClassPrefix(String className) {
    return 'Class $className';
  }

  @override
  String get dashboardFeatureAttendance => 'Attendance';

  @override
  String get dashboardFeatureTuition => 'Tuition';

  @override
  String get dashboardFeatureScores => 'Scores';

  @override
  String get dashboardFeatureLeaveRequest => 'Leave Request';

  @override
  String get dashboardFeatureTranscript => 'Digital Transcript';

  @override
  String get dashboardFeatureHealthInfo => 'Health Information';

  @override
  String get dashboardViewProfile => 'View Profile';

  @override
  String get dashboardRecentNotifications => 'Recent Notifications';

  @override
  String dashboardNewNotificationsCount(int count) {
    return 'You have $count new notifications';
  }

  @override
  String get dashboardSchoolWeek => 'School Week';

  @override
  String dashboardSchoolWeekMessage(int week) {
    return 'Week $week - Active Learning Week';
  }

  @override
  String get dashboardConfirmStudentInfoPrefix =>
      'Please check and confirm the information of';

  @override
  String get dashboardConfirmStudentInfoSuffix =>
      'so Gedu can provide the most accurate information.';

  @override
  String get dashboardCheckAndConfirm => 'Check and confirm';

  @override
  String get dashboardAccountManagementTitle => 'Account Management';

  @override
  String get dashboardChangePassword => 'Change Password';

  @override
  String get dashboardNotificationSettings => 'Notification Settings';

  @override
  String get dashboardSupportTitle => 'Support';

  @override
  String get dashboardUserGuide => 'User Guide';

  @override
  String get dashboardVideoGuide => 'Video Guide';

  @override
  String get dashboardFAQ => 'FAQ';

  @override
  String get dashboardLogout => 'Logout';

  @override
  String get dashboardLogoutConfirmation => 'Are you sure you want to logout?';

  @override
  String get dashboardCancel => 'Cancel';

  @override
  String get studentReviewWelcomeTitle => 'Welcome Parent,';

  @override
  String get studentReviewInstruction =>
      'Your account is linked to multiple students. Please select a student to continue.';

  @override
  String get studentReviewClassLabel => 'Class';

  @override
  String get studentReviewSchoolLabel => 'School';

  @override
  String get studentReviewContinueButton => 'Continue';

  @override
  String get studentReviewErrorMessage => 'An error occurred:';

  @override
  String get studentReviewRetryButton => 'Try again';

  @override
  String get studentReviewNoName => 'No name yet';

  @override
  String get studentReviewClassPlaceholder => 'Class';

  @override
  String get profileAccountTitle => 'Account';

  @override
  String get profileStudentProfile => 'Student Profile';

  @override
  String get studentSelectionTitle => 'Select Student';

  @override
  String get studentSelectionPleaseSelect =>
      'Please select a student to continue';

  @override
  String get studentSelectionPleaseSelectShort => 'Please select a student';

  @override
  String get profileNoPhoneYet => 'No phone number yet';

  @override
  String get studentProfileTitle => 'Student Profile';

  @override
  String get personalInformationTitle => 'Personal Information';

  @override
  String get personalInformationSubtitle =>
      'Student details and contact information.';

  @override
  String get academicPolicyTitle => 'Academic & Policy';

  @override
  String get academicPolicySubtitle =>
      'Academic information and general regulations.';

  @override
  String get healthInformationTitle => 'Health Information';

  @override
  String get healthInformationSubtitle =>
      'Information about allergies and underlying medical conditions.';

  @override
  String get documentProfileTitle => 'Document Profile';

  @override
  String get documentProfileSubtitle =>
      'Identification documents and required documents.';

  @override
  String get needsConfirmationStatus => 'NEEDS CONFIRMATION';

  @override
  String get alreadyConfirmedStatus => 'ĐÃ XÁC NHẬN';

  @override
  String get addToProfileStatus => 'ADD TO PROFILE';

  @override
  String get studentIdLabel => 'Student ID';

  @override
  String get classLabel => 'Class';

  @override
  String get curriculumLabel => 'Curriculum';

  @override
  String get primaryContactLabel => 'Primary Contact';

  @override
  String get fatherLabel => 'Father';

  @override
  String get retry => 'Retry';

  @override
  String get noClassYet => 'No class yet';

  @override
  String get loadingStudentProfile => 'Loading student profile...';

  @override
  String get academicInformationTitle => 'Academic Information';

  @override
  String get contactPersonLabel => 'Contact Person';

  @override
  String get admissionInformationTitle => 'Admission Information';

  @override
  String get admissionDateLabel => 'Date of admission';

  @override
  String get admissionYearLabel => 'Admission academic year';

  @override
  String get admissionTypeLabel => 'Admission type';

  @override
  String get admissionTypeInDistrict => 'In District';

  @override
  String get admissionTypeOutOfDistrict => 'Out of District';

  @override
  String get admissionTypeTransfer => 'Transfer School';

  @override
  String get classInformationTitle => 'Class Information';

  @override
  String get statusLabel => 'Status';

  @override
  String get currentlyStudyingStatus => 'ĐANG HỌC';

  @override
  String get regimePolicyTitle => 'Regime & Policy';

  @override
  String get priorityStatusLabel => 'Priority status';

  @override
  String get disabilityStatusLabel => 'Disability status';

  @override
  String get medicalInfoGroupUndetermined => 'Other';

  @override
  String get medicalInfoGroupAllergy => 'Allergy';

  @override
  String get medicalInfoGroupChronicOrUnderlying =>
      'Chronic/Underlying Disease';

  @override
  String get medicalInfoTypeUndetermined => 'Other';

  @override
  String get medicalInfoTypeFoodAllergy => 'Food Allergy';

  @override
  String get medicalInfoTypeDrugAllergy => 'Drug Allergy';

  @override
  String get medicalInfoTypeChronicOrUnderlying => 'Chronic/Underlying Disease';

  @override
  String get allergiesTitle => 'Allergies';

  @override
  String get foodAllergyLabel => 'Food allergies';

  @override
  String get drugAllergyLabel => 'Drug allergies';

  @override
  String get chronicDiseasesTitle => 'Chronic/Underlying Diseases';

  @override
  String get chronicDiseasesLabel => 'Chronic/Underlying Diseases';

  @override
  String get additionalNotesTitle =>
      'Additional Notes (Special characteristics or habits to note)';

  @override
  String get additionalNotesLabel => 'Additional notes';

  @override
  String get profileNeutralStatus => 'HAS INFO';

  @override
  String get contactRelationshipFather => 'Father';

  @override
  String get contactRelationshipMother => 'Mother';

  @override
  String get contactRelationshipOther => 'Other';

  @override
  String get studentInformationTitle => 'Personal Information';

  @override
  String get confirmedStatus => 'CONFIRMED';

  @override
  String get generalInformationTitle => 'General Information';

  @override
  String get idCccdLabel => 'ID/CCCD';

  @override
  String get dateOfBirthLabel => 'Date of Birth';

  @override
  String get genderLabel => 'Gender';

  @override
  String get nationalityLabel => 'Nationality';

  @override
  String get religionLabel => 'Religion';

  @override
  String get permanentAddressLabel => 'Permanent Address';

  @override
  String get temporaryAddressLabel => 'Temporary Address';

  @override
  String get contactInformationTitle => 'Contact Information';

  @override
  String get primaryContactTag => 'Primary Contact';

  @override
  String get relationshipToStudentLabel => 'Relationship to student';

  @override
  String get yearOfBirthLabel => 'Year of birth';

  @override
  String get occupationLabel => 'Occupation';

  @override
  String get phoneNumberLabel => 'Phone number';

  @override
  String get confirmStudentInformationButton => 'Confirm student information';

  @override
  String get requestInformationEditButton => 'Request information edit';

  @override
  String get studentInformationSubtitle =>
      'Personal information and contact details of the student.';

  @override
  String get detailedStudentInfoTitle => 'Detailed Student Information';

  @override
  String get genderMale => 'Male';

  @override
  String get genderFemale => 'Female';

  @override
  String get requestEditInfoTitle => 'Request information edit';

  @override
  String get requestEditInfoDetailsLabel => 'Request details';

  @override
  String get requestEditInfoDetailsHint =>
      'Please describe the information that needs to be corrected...';

  @override
  String get requestEditInfoSubmittedTitle => 'Request sent';

  @override
  String get requestEditInfoSubmittedSubtitle =>
      'The school will review your request and respond as soon as possible.';

  @override
  String get requestEditInfoSend => 'Send information';

  @override
  String get iUnderstand => 'I understand';
}
