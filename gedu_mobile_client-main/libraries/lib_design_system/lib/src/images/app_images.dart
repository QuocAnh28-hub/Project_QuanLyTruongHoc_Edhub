import 'image_constants.dart';

/// Main app images class that provides access to all design system images
class AppImages {
  AppImages._();

  // Logo Images
  static const String logo = ImageConstants.logo;
  static const String logoLight = ImageConstants.logoLight;
  static const String logoDark = ImageConstants.logoDark;
  static const String logoSmall = ImageConstants.logoSmall;

  // Icon Images
  static const String iconHome = ImageConstants.iconHome;
  static const String iconProfile = ImageConstants.iconProfile;
  static const String iconSettings = ImageConstants.iconSettings;
  static const String iconSearch = ImageConstants.iconSearch;
  static const String iconNotification = ImageConstants.iconNotification;
  static const String iconMenu = ImageConstants.iconMenu;
  static const String iconClose = ImageConstants.iconClose;
  static const String iconBack = ImageConstants.iconBack;
  static const String iconForward = ImageConstants.iconForward;
  static const String iconEdit = ImageConstants.iconEdit;
  static const String iconDelete = ImageConstants.iconDelete;
  static const String iconAdd = ImageConstants.iconAdd;
  static const String iconRemove = ImageConstants.iconRemove;
  static const String iconCheck = ImageConstants.iconCheck;
  static const String iconError = ImageConstants.iconError;
  static const String iconWarning = ImageConstants.iconWarning;
  static const String iconInfo = ImageConstants.iconInfo;
  static const String iconSuccess = ImageConstants.iconSuccess;

  // Placeholder Images
  static const String placeholderAvatar = ImageConstants.placeholderAvatar;
  static const String placeholderImage = ImageConstants.placeholderImage;
  static const String placeholderCard = ImageConstants.placeholderCard;
  static const String placeholderBanner = ImageConstants.placeholderBanner;

  // Background Images
  static const String backgroundLogin = ImageConstants.backgroundLogin;
  static const String backgroundRegister = ImageConstants.backgroundRegister;
  static const String backgroundHome = ImageConstants.backgroundHome;
  static const String backgroundProfile = ImageConstants.backgroundProfile;

  // Illustration Images
  static const String illustrationEmpty = ImageConstants.illustrationEmpty;
  static const String illustrationError = ImageConstants.illustrationError;
  static const String illustrationSuccess = ImageConstants.illustrationSuccess;
  static const String illustrationLoading = ImageConstants.illustrationLoading;
  static const String illustrationNotFound =
      ImageConstants.illustrationNotFound;

  // Onboarding Images
  static const String onboarding1 = ImageConstants.onboarding1;
  static const String onboarding2 = ImageConstants.onboarding2;
  static const String onboarding3 = ImageConstants.onboarding3;

  // Feature Images
  static const String featureAuth = ImageConstants.featureAuth;
  static const String featureCourse = ImageConstants.featureCourse;
  static const String featureProfile = ImageConstants.featureProfile;
  static const String featureSettings = ImageConstants.featureSettings;

  // Tab Bar Icons
  static const String tabHome = ImageConstants.tabHome;
  static const String tabHomeSelected = ImageConstants.tabHomeSelected;
  static const String tabMessage = ImageConstants.tabMessage;
  static const String tabNewFeeds = ImageConstants.tabNewFeeds;
  static const String tabNotifications = ImageConstants.tabNotifications;
  static const String tabProfile = ImageConstants.tabProfile;
  static const String tabProfileSelected = ImageConstants.tabProfileSelected;

  // Home Images
  static const String homeGradientBg = ImageConstants.homeGradientBg;

  /// Get image asset path
  static String getAssetPath(String imagePath) {
    return imagePath;
  }

  /// Get image with package name
  static String getImageWithPackage(String imagePath, String packageName) {
    return 'packages/$packageName/$imagePath';
  }

  /// Check if image exists
  static bool exists(String imagePath) {
    // This would typically check if the asset exists
    // For now, we'll assume all defined images exist
    return imagePath.isNotEmpty;
  }
}
