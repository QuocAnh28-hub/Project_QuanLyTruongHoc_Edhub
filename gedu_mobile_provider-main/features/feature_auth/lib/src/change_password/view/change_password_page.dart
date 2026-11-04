import 'package:core_localization/core_localization.dart';
import 'package:core_storage/core_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../../router/login_router.dart';
import '../bloc/change_password_bloc.dart';
import '../bloc/change_password_event.dart';
import '../bloc/change_password_state.dart';

class ChangePasswordPage extends StatefulWidget {
  final bool isFirstTimeLogin;

  const ChangePasswordPage({super.key, this.isFirstTimeLogin = false});

  @override
  State<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String? _storedPassword;
  bool _obscureCurrentPassword = true;
  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;
  String? _confirmPasswordError;

  @override
  void initState() {
    super.initState();
    _loadStoredPassword();

    // Set context for loading overlay
    final changePasswordBloc = context.read<ChangePasswordBloc>();
    changePasswordBloc.setContext(context);

    // Add listeners to track password changes for validation
    _currentPasswordController.addListener(_onPasswordChanged);
    _newPasswordController.addListener(_onPasswordChanged);
    _confirmPasswordController.addListener(_onPasswordChanged);
  }

  @override
  void dispose() {
    _currentPasswordController.removeListener(_onPasswordChanged);
    _newPasswordController.removeListener(_onPasswordChanged);
    _confirmPasswordController.removeListener(_onPasswordChanged);
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _loadStoredPassword() {
    // Get stored password for first-time login
    final appPreferences = GetIt.instance<AppPreferences>();
    _storedPassword = appPreferences.getUserPassword();
  }

  void _onPasswordChanged() {
    // Trigger validation when password changes
    setState(() {
      _validatePasswords();
    });
  }

  void _validatePasswords() {
    final newPassword = _newPasswordController.text;
    final confirmPassword = _confirmPasswordController.text;

    // Clear error if both fields are empty
    if (newPassword.isEmpty && confirmPassword.isEmpty) {
      _confirmPasswordError = null;
      return;
    }

    // Show error only if confirm password field is not empty and doesn't match
    if (confirmPassword.isNotEmpty && newPassword != confirmPassword) {
      final l10n = AppLocalizations.of(context);
      _confirmPasswordError =
          l10n?.changePasswordErrorPasswordsNotMatch ??
          'Passwords do not match';
    } else {
      _confirmPasswordError = null;
    }
  }

  // Password strength validation
  bool _hasMinLength() => _newPasswordController.text.length >= 8;

  bool _hasMinLetter() =>
      RegExp(r'[a-zA-Z]').hasMatch(_newPasswordController.text);

  bool _hasMinNumber() =>
      RegExp(r'[0-9]').hasMatch(_newPasswordController.text);

  bool _isPasswordStrong() =>
      _hasMinLength() && _hasMinLetter() && _hasMinNumber();

  String _getPasswordStrength(AppLocalizations l10n) => _isPasswordStrong()
      ? l10n.changePasswordStrengthStrong
      : l10n.changePasswordStrengthWeak;

  Color _getPasswordStrengthColor() => _isPasswordStrong()
      ? ColorConstants.emeraldGreen
      : ColorConstants.amberOrange;

  bool _isFormValid() {
    if (widget.isFirstTimeLogin) {
      return _newPasswordController.text.isNotEmpty &&
          _confirmPasswordController.text.isNotEmpty &&
          _confirmPasswordError == null;
    } else {
      return _currentPasswordController.text.isNotEmpty &&
          _newPasswordController.text.isNotEmpty &&
          _confirmPasswordController.text.isNotEmpty &&
          _confirmPasswordError == null;
    }
  }

  void _handleChangePassword() {
    if (!_formKey.currentState!.validate()) return;

    final currentPassword = widget.isFirstTimeLogin
        ? _storedPassword ?? ''
        : _currentPasswordController.text;

    context.read<ChangePasswordBloc>().add(
      ChangePasswordFormSubmitted(
        currentPassword: currentPassword,
        newPassword: _newPasswordController.text,
        confirmPassword: _confirmPasswordController.text,
        isFirstTimeLogin: widget.isFirstTimeLogin,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: widget.isFirstTimeLogin
          ? null
          : AppBar(
              backgroundColor: AppColors.navBarBackground,
              automaticallyImplyLeading: false,
              leading: IconButton(
                icon: Icon(Icons.arrow_back, color: AppColors.textPrimary),
                onPressed: () => Navigator.of(context).pop(),
              ),
              title: Text(
                l10n.changePasswordNavTitle,
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              elevation: 0,
              iconTheme: const IconThemeData(color: AppColors.textPrimary),
            ),
      body: BlocListener<ChangePasswordBloc, ChangePasswordFormState>(
        listener: (context, state) {
          if (state is ChangePasswordFormSuccessNavigateToSuccessPage) {
            LoginRouter.navigateToChangePasswordSuccess(context);
          } else if (state is ChangePasswordFormError) {
            LoginRouter.showError(context, state.message);
          }
        },
        child: BlocBuilder<ChangePasswordBloc, ChangePasswordFormState>(
          builder: (context, state) {
            final isLoading = state is ChangePasswordFormLoading;

            return SafeArea(
              child: SingleChildScrollView(
                padding: AppSpacing.all(AppSpacing.space4x),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Logo and title section - only show for first time login
                      if (widget.isFirstTimeLogin) ...[
                        const SizedBox(height: AppSpacing.space4x),
                        Center(
                          child: Assets.images.logo.designSystemSvg(
                            height: 42,
                            fit: BoxFit.contain,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.space12x),
                        Text(
                          l10n.changePasswordTitle,
                          style: AppTypography.headlineLarge.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.space3x),
                        Text(
                          l10n.changePasswordSubtitle,
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.space12x),
                      ],

                      // Current Password Field - only show when not first time login
                      if (!widget.isFirstTimeLogin) ...[
                        _buildPasswordField(
                          controller: _currentPasswordController,
                          label: l10n.changePasswordCurrentPasswordLabel,
                          hintText: l10n.changePasswordCurrentPasswordHint,
                          obscureText: _obscureCurrentPassword,
                          onToggleVisibility: () {
                            setState(() {
                              _obscureCurrentPassword =
                                  !_obscureCurrentPassword;
                            });
                          },
                          errorText: state is ChangePasswordFormValidationError
                              ? state.currentPasswordError
                              : null,
                        ),
                        const SizedBox(height: AppSpacing.space6x),
                      ],

                      // New Password Field
                      _buildPasswordField(
                        controller: _newPasswordController,
                        label: l10n.changePasswordNewPasswordLabel,
                        hintText: l10n.changePasswordNewPasswordHint,
                        obscureText: _obscureNewPassword,
                        onToggleVisibility: () {
                          setState(() {
                            _obscureNewPassword = !_obscureNewPassword;
                          });
                        },
                        errorText: state is ChangePasswordFormValidationError
                            ? state.newPasswordError
                            : null,
                      ),

                      const SizedBox(height: AppSpacing.space3x),

                      // Password Requirements Section (right below new password)
                      _buildPasswordRequirements(l10n),

                      const SizedBox(height: AppSpacing.space5x),

                      // Confirm Password Field
                      _buildPasswordField(
                        controller: _confirmPasswordController,
                        label: l10n.changePasswordConfirmPasswordLabel,
                        hintText: l10n.changePasswordConfirmPasswordHint,
                        obscureText: _obscureConfirmPassword,
                        onToggleVisibility: () {
                          setState(() {
                            _obscureConfirmPassword = !_obscureConfirmPassword;
                          });
                        },
                        errorText:
                            _confirmPasswordError ??
                            (state is ChangePasswordFormValidationError
                                ? state.confirmPasswordError
                                : null),
                      ),

                      const SizedBox(height: AppSpacing.space8x),

                      const SizedBox(height: AppSpacing.space12x),

                      // Change Password Button
                      SizedBox(
                        height: AppDimensions.buttonHeight,
                        child: ElevatedButton(
                          onPressed: (isLoading || !_isFormValid())
                              ? null
                              : _handleChangePassword,
                          style: _isFormValid()
                              ? AppButtonStyles.primary
                              : AppButtonStyles.primary.copyWith(
                                  backgroundColor: WidgetStateProperty.all(
                                    AppColors.textSecondary.withValues(
                                      alpha: 0.5,
                                    ),
                                  ),
                                ),
                          child: isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      AppColors.white,
                                    ),
                                  ),
                                )
                              : Text(
                                  l10n.changePasswordButtonText,
                                  style: AppTypography.bodyLarge.copyWith(
                                    color: AppColors.white,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                        ),
                      ),

                      const SizedBox(height: AppSpacing.space24x),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildPasswordField({
    required TextEditingController controller,
    required String label,
    required String hintText,
    required bool obscureText,
    required VoidCallback onToggleVisibility,
    String? errorText,
  }) {
    return Material3TextField(
      controller: controller,
      labelText: label,
      hintText: hintText,
      obscureText: obscureText,
      errorText: errorText,
      suffixIcon: GestureDetector(
        onTap: () => onToggleVisibility(),
        child: UnconstrainedBox(
          child: obscureText
              ? Assets.images.passwordUnmasked.designSystemSvg(
                  width: AppSpacing.space6x,
                  height: AppSpacing.space6x,
                )
              : Assets.images.passwordMasked.designSystemSvg(
                  width: AppSpacing.space6x,
                  height: AppSpacing.space6x,
                ),
        ),
      ),
    );
  }

  Widget _buildPasswordRequirements(AppLocalizations l10n) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space4x,
        vertical: AppSpacing.space4x,
      ),
      decoration: BoxDecoration(
        color: ColorConstants.lightBlueBackground,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius8px),
        border: Border.all(
          color: ColorConstants.borderLight,
          width: AppSpacing.borderWidth1px,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                l10n.changePasswordRequirementsTitle,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(),
              // Only show strength label when user is typing
              if (_newPasswordController.text.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.space2x,
                    vertical: AppSpacing.space1x,
                  ),
                  child: Text(
                    _getPasswordStrength(l10n),
                    style: AppTypography.bodySmall.copyWith(
                      color: _getPasswordStrengthColor(),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.space2x),
          _buildRequirementItem(
            l10n.changePasswordRequirementMinChars,
            _hasMinLength(),
          ),
          _buildRequirementItem(
            l10n.changePasswordRequirementMinLetter,
            _hasMinLetter(),
          ),
          _buildRequirementItem(
            l10n.changePasswordRequirementMinNumber,
            _hasMinNumber(),
          ),
        ],
      ),
    );
  }

  Widget _buildRequirementItem(String text, bool isMet) {
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.space1x),
      child: Row(
        children: [
          Icon(
            isMet ? Icons.check_circle : Icons.radio_button_unchecked,
            size: AppSpacing.space4x,
            color: isMet ? AppColors.success : AppColors.textSecondary,
          ),
          const SizedBox(width: AppSpacing.space2x),
          Text(
            text,
            style: AppTypography.bodySmall.copyWith(
              color: isMet ? AppColors.success : AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
