import 'package:core_localization/core_localization.dart';
import 'package:core_storage/core_storage.dart';
import 'package:flutter/material.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../router/login_router.dart';

class ChangePasswordSuccessPage extends StatefulWidget {
  const ChangePasswordSuccessPage({super.key});

  @override
  State<ChangePasswordSuccessPage> createState() =>
      _ChangePasswordSuccessPageState();
}

class _ChangePasswordSuccessPageState extends State<ChangePasswordSuccessPage> {
  int _countdown = 5;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  void _startCountdown() {
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        setState(() {
          _countdown--;
        });
        if (_countdown > 0) {
          _startCountdown();
        } else {
          _navigateToLogin();
        }
      }
    });
  }

  Future<void> _navigateToLogin() async {
    // Clear auth token before navigating to login
    await AuthStorage.clearAuthToken();
    Log.d('ChangePasswordSuccessPage: Auth token cleared');

    // Use router for navigation with password clear flag
    LoginRouter.navigateToLogin(context, clearPassword: true);
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: AppSpacing.all(AppSpacing.space8x),
          child: Column(
            children: [
              // Logo at the top
              const SizedBox(height: AppSpacing.space4x),
              Center(
                child: Assets.images.logo.designSystemSvg(
                  height: 42,
                  fit: BoxFit.contain,
                ),
              ),

              const SizedBox(height: AppSpacing.space20x),

              // Atom illustration
              Center(
                child: Assets.images.changePassSuccess.designSystemSvg(
                  width: 120,
                  height: 120,
                  fit: BoxFit.contain,
                ),
              ),

              const SizedBox(height: AppSpacing.space4x),

              // Main title
              Text(
                l10n.changePasswordSuccessTitle,
                style: AppTypography.headlineLarge.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppSpacing.space2x),

              // Body text
              Text(
                l10n.changePasswordSuccessMessage,
                style: AppTypography.bodyLarge.copyWith(
                  color: AppColors.textSecondary,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: AppSpacing.space6x),

              // Countdown button
              SizedBox(
                width: double.infinity,
                height: AppDimensions.buttonHeight,
                child: ElevatedButton(
                  onPressed: _navigateToLogin,
                  style: AppButtonStyles.primary,
                  child: Text(
                    '${l10n.changePasswordSuccessButtonText} (${_countdown}s)',
                    style: AppTypography.bodyLarge.copyWith(
                      color: AppColors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: AppSpacing.space8x),
            ],
          ),
        ),
      ),
    );
  }
}
