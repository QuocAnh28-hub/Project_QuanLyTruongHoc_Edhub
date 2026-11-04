import 'package:core_localization/core_localization.dart';
import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../../router/login_router.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

/// Login page for the authentication feature
class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _departmentController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  late AppPreferences _appPreferences;

  late final AuthBloc _authBloc;
  bool _hasClearedAuthData = false;
  String? _lastShownError;

  @override
  void initState() {
    super.initState();
    _authBloc = context.read<AuthBloc>();
    _appPreferences = GetIt.instance<AppPreferences>();
    // Set context for loading overlay
    _authBloc.setContext(context);
    // Add listeners to track field changes
    _phoneController.addListener(_onFieldChanged);
    _passwordController.addListener(_onFieldChanged);

    // Load stored credentials
    _loadStoredCredentials();

    // Load remember me status
    _loadRememberMeStatus();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Check if we should clear password field based on route parameters
    final extra = GoRouterState.of(context).extra as Map<String, dynamic>?;
    final shouldClearPassword = extra?['clearPassword'] as bool? ?? false;

    if (shouldClearPassword && !_hasClearedAuthData) {
      _hasClearedAuthData = true;
      // Clear userData immediately to prevent BlocListener from triggering
      _authBloc.addDebounce(const ClearAuthDataEvent());

      WidgetsBinding.instance.addPostFrameCallback((_) {
        _clearPasswordField();
        Log.d(
          'LoginPage: Password field cleared and auth data cleared after change password success',
        );
      });
    }
  }

  @override
  void dispose() {
    _departmentController.dispose();
    _phoneController.removeListener(_onFieldChanged);
    _phoneController.dispose();
    _passwordController.removeListener(_onFieldChanged);
    _passwordController.dispose();
    super.dispose();
  }

  void _onFieldChanged() {
    // Reset error tracking when user starts typing new input
    if (_lastShownError != null) {
      _lastShownError = null;
      Log.d('LoginPage: Form field changed, reset error tracking');
    }

    // Update BLoC state when form fields change
    _authBloc.addDebounce(
      FormFieldChangedEvent(
        phoneNumber: _phoneController.text,
        password: _passwordController.text,
      ),
    );
  }

  void _loadStoredCredentials() {
    final storedPhone = _appPreferences.getUserPhoneNumber();
    final storedProvince = _appPreferences.getUserProvince();

    if (storedPhone != null) {
      _phoneController.text = storedPhone;
      // Update BLoC state with stored phone
      _authBloc.add(
        FormFieldChangedEvent(
          phoneNumber: storedPhone,
          password: _passwordController.text,
        ),
      );
    }

    if (storedProvince != null) {
      _departmentController.text = storedProvince;
      // Update BLoC state with stored province
      _authBloc.add(ProvinceSelectedEvent(province: storedProvince));
    }
  }

  void _loadRememberMeStatus() {
    final rememberMeEnabled = _appPreferences.getRememberMeStatus();
    Log.d('LoginPage: Loaded remember me status: $rememberMeEnabled');

    // Update BLoC state with remember me status
    _authBloc.add(RememberMeChangedEvent(rememberMe: rememberMeEnabled));
  }

  void _clearPasswordField() {
    _passwordController.clear();
    setState(() {
      // Trigger rebuild to update button state
    });
  }

  Future<void> _showProvinceSelection() async {
    // Get current province from BLoC state
    final currentState = _authBloc.state;
    final currentProvince = currentState.selectedProvince;

    final selectedProvince = await LoginRouter.showProvinceSelection(
      context,
      selectedProvince: currentProvince,
    );

    if (selectedProvince != null) {
      _departmentController.text = selectedProvince;
      // Update BLoC state
      _authBloc.addDebounce(ProvinceSelectedEvent(province: selectedProvince));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          // Handle forgot password dialog state
          if (state.showForgotPasswordDialog) {
            Log.d('LoginPage: Showing forgot password dialog');
            LoginRouter.showForgotPasswordDialog(context);
            return;
          }

          // Handle successful login - userData is present
          if (state.userData != null) {
            Log.d('LoginPage: Processing successful login');

            // Clear any existing snackbars when login succeeds
            ScaffoldMessenger.of(context).clearSnackBars();
            _lastShownError = null; // Reset error tracking

            // Navigate based on password change status and student review confirmation
            final passwordChanged = AuthStorage.getPasswordChanged();
            final studentReviewConfirmed =
                AuthStorage.getStudentReviewConfirmed();

            if (!passwordChanged) {
              Log.d('LoginPage: Navigating to change password');
              LoginRouter.navigateToChangePassword(
                context,
                isFirstTimeLogin: true,
              );
            } else if (!studentReviewConfirmed) {
              Log.d('LoginPage: Navigating to student review');
              LoginRouter.navigateToStudentReview(context);
            } else {
              Log.d('LoginPage: Navigating to home');
              LoginRouter.navigateToHome(context);
            }
          }
          // Handle error messages - only show if there's an error AND no user data AND it's a new error
          else if (state.errorMessage != null &&
              state.userData == null &&
              state.errorMessage != _lastShownError) {
            Log.d('LoginPage: Processing new error message');
            _lastShownError = state.errorMessage;
            LoginRouter.showError(context, state.errorMessage!);
          }
        },
        child: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            // Unified state handling - all states return the same UI
            // The BlocListener handles the specific state actions
            return Stack(
              children: [
                Assets.images.loginBg.designSystemImage(),
                _buildLoginUI(state.isLoading),
                // Add your existing content here
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildLoginUI(bool isLoading) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: AppSpacing.all(AppSpacing.space8x),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: AppSpacing.space4x),
              _buildHeaderSection(),
              const SizedBox(height: AppSpacing.space12x),
              _buildLoginForm(),
              const SizedBox(height: AppSpacing.space6x),
              _buildRememberMeSection(),
              const SizedBox(height: AppSpacing.space8x),
              _buildLoginButton(isLoading),
              const SizedBox(height: AppSpacing.space24x),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderSection() {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    return Column(
      children: [
        // App Logo - Same as onboarding page
        Assets.images.logo.designSystemSvg(height: 42, fit: BoxFit.contain),

        const SizedBox(height: AppSpacing.space6x),

        // Title
        Text(
          l10n.loginTitle,
          style: AppTypography.headlineLarge.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),

        const SizedBox(height: AppSpacing.space3x),

        // Subtitle
        Text(
          l10n.loginSubtitle,
          style: AppTypography.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildLoginForm() {
    return Column(
      children: [
        // Department Field
        _buildDepartmentField(),

        const SizedBox(height: AppSpacing.space6x),

        // Phone Field
        _buildPhoneField(),

        const SizedBox(height: AppSpacing.space6x),

        // Password Field
        _buildPasswordField(),
      ],
    );
  }

  Widget _buildDepartmentField() {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    return GestureDetector(
      onTap: _showProvinceSelection,
      child: AbsorbPointer(
        child: Material3TextField(
          controller: _departmentController,
          labelText: l10n.loginDepartmentLabel,
          hintText: l10n.loginDepartmentHint,
          suffixIcon: const Icon(
            Icons.keyboard_arrow_down,
            color: AppColors.textSecondary,
          ),
          textInputAction: TextInputAction.next,
        ),
      ),
    );
  }

  Widget _buildPhoneField() {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    return Material3TextField(
      controller: _phoneController,
      labelText: l10n.loginPhoneLabel,
      hintText: l10n.loginPhoneHint,
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return l10n.loginPhoneError;
        }
        return null;
      },
    );
  }

  Widget _buildPasswordField() {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    return Material3TextField(
      controller: _passwordController,
      labelText: l10n.loginPasswordLabel,
      hintText: l10n.loginPasswordHint,
      obscureText: _obscurePassword,
      textInputAction: TextInputAction.done,
      suffixIcon: GestureDetector(
        onTap: () {
          setState(() {
            _obscurePassword = !_obscurePassword;
          });
        },
        child: UnconstrainedBox(
          child: _obscurePassword
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
      validator: (value) {
        if (value == null || value.isEmpty) {
          return l10n.loginPasswordError;
        }
        return null;
      },
    );
  }

  Widget _buildRememberMeSection() {
    final l10n = AppLocalizations.of(context);
    if (l10n == null) {
      return Container();
    }

    // Only show "Remember me" checkbox if user has already changed their password
    final passwordChanged = AuthStorage.getPasswordChanged();
    if (!passwordChanged) {
      return const SizedBox.shrink();
    }

    // Get remember me state from BLoC
    final currentState = _authBloc.state;
    final rememberMe = currentState.rememberMe;

    return Row(
      children: [
        // Remember me checkbox with proper touch area
        Expanded(
          child: GestureDetector(
            onTap: () {
              // Toggle remember me when text is tapped
              _authBloc.addDebounce(
                RememberMeChangedEvent(rememberMe: !rememberMe),
              );
            },
            child: Row(
              children: [
                Checkbox(
                  value: rememberMe,
                  onChanged: (value) {
                    // Update BLoC state with new remember me value
                    _authBloc.addDebounce(
                      RememberMeChangedEvent(rememberMe: value ?? false),
                    );
                  },
                  activeColor: AppColors.primary,
                  checkColor: AppColors.white,
                ),
                Text(
                  l10n.loginRememberMeText,
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ),
        // Forgot password button with proper touch area
        TextButton(
          onPressed: () =>
              _authBloc.addDebounce(const ShowForgotPasswordDialogEvent()),
          child: Text(
            l10n.loginForgotPasswordText,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLoginButton(bool isLoading) {
    final l10n = AppLocalizations.of(context);

    // Get current state to check form validation
    final currentState = _authBloc.state;
    final isFormValid = currentState.isFormValid;

    return SizedBox(
      height: AppDimensions.buttonHeight,
      child: ElevatedButton(
        onPressed: (isLoading || !isFormValid) ? null : _handleLogin,
        style: isFormValid && !isLoading
            ? AppButtonStyles.primary
            : AppButtonStyles.disabled,
        child: isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    ColorConstants.buttonTextWhite,
                  ),
                ),
              )
            : Text(
                l10n?.loginButtonText ?? 'Login',
                style: AppTypography.bodyLarge.copyWith(
                  color: isFormValid
                      ? ColorConstants.buttonTextWhite
                      : AppColors.textSecondary,
                  fontWeight: FontWeight.w600,
                ),
              ),
      ),
    );
  }

  void _handleLogin() {
    // Lose focus and hide keyboard
    FocusScope.of(context).unfocus();

    if (_formKey.currentState?.validate() ?? false) {
      // Validate Vietnamese phone number format
      final phoneNumber = _phoneController.text.trim();
      // if (!phoneNumber.isValidVietnamesePhone) {
      //   LoginRouter.showError(context, 'Số điện thoại không đúng định dạng');
      //   return;
      // }

      // Reset error tracking to allow new error messages to be shown
      _lastShownError = null;
      Log.d('LoginPage: Starting new login attempt, reset error tracking');

      // Get current state from BLoC
      final currentState = _authBloc.state;
      // For first-time login (password not changed), always save credentials
      // For subsequent logins, only save if "Remember me" is checked
      final passwordChanged = AuthStorage.getPasswordChanged();
      final shouldRememberMe = passwordChanged ? currentState.rememberMe : true;

      Log.d('LoginPage: Password changed status: $passwordChanged');
      Log.d('LoginPage: Remember me checkbox: ${currentState.rememberMe}');
      Log.d('LoginPage: Will save credentials: $shouldRememberMe');

      // Use addDebounce to prevent multiple rapid clicks (300ms debounce)
      _authBloc.addDebounce(
        LoginEvent(
          email: phoneNumber,
          password: _passwordController.text,
          province: currentState.selectedProvince,
          rememberMe: shouldRememberMe,
        ),
      );
    }
  }
}
