import 'dart:async';

import 'package:core_localization/core_localization.dart';
import 'package:core_storage/core_storage.dart';
import 'package:flutter/material.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../router/login_router.dart';

/// Onboarding page with welcome screens
class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _autoScrollTimer;

  @override
  void initState() {
    super.initState();
    _markOnboardingStarted();
    _startAutoScroll();
  }

  void _markOnboardingStarted() {
    AuthStorage.saveOnboardingState(true);
    Log.d('OnboardingPage: Marked onboarding as started');
  }

  List<OnboardingItem> _getOnboardingItems(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      // Fallback to hardcoded strings if localization is not available
      return [];
    }

    return [
      OnboardingItem(
        title: l10n.onboardingWelcomeTitle1,
        description: l10n.onboardingWelcomeDescription1,
        image: Assets.images.onboarding.onboarding1,
      ),
      OnboardingItem(
        title: l10n.onboardingWelcomeTitle2,
        description: l10n.onboardingWelcomeDescription2,
        image: Assets.images.onboarding.onboarding2,
      ),
      OnboardingItem(
        title: l10n.onboardingWelcomeTitle3,
        description: l10n.onboardingWelcomeDescription3,
        image: Assets.images.onboarding.onboarding3,
      ),
    ];
  }

  @override
  void dispose() {
    _autoScrollTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Header with logo
            _buildHeader(),

            // Page content
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                  _restartAutoScroll();
                },
                itemCount: _getOnboardingItems(context).length,
                itemBuilder: (context, index) {
                  return _buildOnboardingItem(
                    _getOnboardingItems(context)[index],
                  );
                },
              ),
            ),

            // Bottom section with indicators and buttons
            _buildBottomSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: AppSpacing.all(AppSpacing.space6x),
      child: Center(
        child: Assets.images.logo.designSystemSvg(
          height: 42,
          fit: BoxFit.contain,
        ),
      ),
    );
  }

  Widget _buildOnboardingItem(OnboardingItem item) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Illustration - Full width
        Expanded(
          flex: 3,
          child: item.image.designSystemSvg(
            fit: BoxFit.fitWidth,
            width: double.infinity,
          ),
        ),

        // Content with padding
        Padding(
          padding: AppSpacing.horizontal(AppSpacing.space4x),
          child: Column(
            children: [
              // Title
              StandardText.headlineMedium(
                item.title,
                color: AppColors.textPrimary,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.space3x),
              // Description
              StandardText.onboardingSubtitle(
                item.description,
                color: ColorConstants.onboardingDescription,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.space4x),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBottomSection() {
    return Container(
      padding: AppSpacing.symmetric(
        horizontal: AppSpacing.space4x,
        vertical: AppSpacing.space8x,
      ),
      child: Column(
        children: [
          // Page indicators
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              _getOnboardingItems(context).length,
              (index) => Container(
                margin: AppSpacing.horizontal(AppSpacing.space1x),
                width: _currentPage == index
                    ? AppSpacing.space6x
                    : AppSpacing.space2x,
                height: AppSpacing.space2x,
                decoration: BoxDecoration(
                  color: _currentPage == index
                      ? AppColors.primary
                      : AppColors.textSecondary.withValues(alpha: 0.3),
                  borderRadius: AppSpacing.borderRadius(AppSpacing.space1x),
                ),
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.space8x),

          // Action button
          SizedBox(
            width: double.infinity,
            height: AppDimensions.buttonHeight,
            child: ElevatedButton(
              onPressed: _handleButtonPress,
              style: AppButtonStyles.primaryRounded,
              child: Text(
                AppLocalizations.of(context)?.onboardingLoginButton ?? 'Login',
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _handleButtonPress() {
    _navigateToLogin();
  }

  void _navigateToLogin() {
    Log.d('OnboardingPage: Navigating to login');
    LoginRouter.navigateToLogin(context);
  }

  /// Start auto-scroll timer
  void _startAutoScroll() {
    _autoScrollTimer?.cancel();
    _autoScrollTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        _scrollToNextPage();
      }
    });
  }

  /// Restart auto-scroll timer
  void _restartAutoScroll() {
    _startAutoScroll();
  }

  /// Scroll to next page with infinite loop
  void _scrollToNextPage() {
    final totalPages = _getOnboardingItems(context).length;
    if (totalPages > 0) {
      final nextPage = (_currentPage + 1) % totalPages;
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }
}

/// Data class for onboarding items
class OnboardingItem {
  final String title;
  final String description;
  final SvgGenImage image;

  const OnboardingItem({
    required this.title,
    required this.description,
    required this.image,
  });
}
