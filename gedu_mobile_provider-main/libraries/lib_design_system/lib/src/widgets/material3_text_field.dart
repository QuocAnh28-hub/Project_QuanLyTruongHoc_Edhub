import 'package:flutter/material.dart';

import '../colors/app_colors.dart';
import '../colors/color_constants.dart';
import '../spacing/app_spacing.dart';
import '../typography/app_typography.dart';

/// Material 3 Text Field with proper floating label behavior
class Material3TextField extends StatefulWidget {
  const Material3TextField({
    super.key,
    required this.controller,
    required this.labelText,
    this.hintText,
    this.suffixIcon,
    this.prefixIcon,
    this.keyboardType,
    this.textInputAction,
    this.obscureText = false,
    this.validator,
    this.onChanged,
    this.onTap,
    this.enabled = true,
    this.readOnly = false,
    this.maxLines = 1,
    this.maxLength,
    this.autofocus = false,
    this.errorText,
    this.focusNode,
  });

  final TextEditingController controller;
  final String labelText;
  final String? hintText;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final bool obscureText;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final VoidCallback? onTap;
  final bool enabled;
  final bool readOnly;
  final int maxLines;
  final int? maxLength;
  final bool autofocus;
  final String? errorText;
  final FocusNode? focusNode;

  @override
  State<Material3TextField> createState() => _Material3TextFieldState();
}

class _Material3TextFieldState extends State<Material3TextField> {
  late FocusNode _focusNode;
  bool _ownsFocusNode = false;
  bool _hasFocus = false;
  bool _hasContent = false;

  @override
  void initState() {
    super.initState();
    if (widget.focusNode != null) {
      _focusNode = widget.focusNode!;
      _ownsFocusNode = false;
    } else {
      _focusNode = FocusNode();
      _ownsFocusNode = true;
    }
    _focusNode.addListener(_onFocusChange);
    widget.controller.addListener(_onContentChange);
    _hasContent = widget.controller.text.isNotEmpty;
  }

  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChange);
    if (_ownsFocusNode) {
      _focusNode.dispose();
    }
    widget.controller.removeListener(_onContentChange);
    super.dispose();
  }

  void _onFocusChange() {
    setState(() {
      _hasFocus = _focusNode.hasFocus;
    });
  }

  void _onContentChange() {
    setState(() {
      _hasContent = widget.controller.text.isNotEmpty;
    });
  }

  Color _getFloatingLabelColor() {
    // Error state takes priority
    if (widget.errorText != null && widget.errorText!.isNotEmpty) {
      return AppColors.error;
    } else if (_hasFocus) {
      return ColorConstants.focusBlue; // Focused state
    } else if (_hasContent) {
      return ColorConstants.onSurfaceVariant; // Not focused but has content
    } else {
      return AppColors.textSecondary; // Default state
    }
  }


  @override
  Widget build(BuildContext context) {
    // Determine what to show as label and hint based on focus and content state
    final bool shouldShowFloatingLabel = _hasFocus || _hasContent;
    final String? displayLabelText = shouldShowFloatingLabel ? widget.labelText : null;
    final String? displayHintText = shouldShowFloatingLabel ? widget.hintText : widget.hintText;

    return TextFormField(
      controller: widget.controller,
      focusNode: _focusNode,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      obscureText: widget.obscureText,
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      maxLines: widget.maxLines,
      maxLength: widget.maxLength,
      autofocus: widget.autofocus,
      cursorColor: ColorConstants.focusBlue,
      style: AppTypography.bodyLarge.copyWith(color: AppColors.textPrimary),
      decoration: InputDecoration(
        // Use outlined style (no fill)
        filled: false,
        isDense: true,
        labelText: displayLabelText,
        hintText: displayHintText,
        prefixIcon: widget.prefixIcon,
        suffixIcon: widget.suffixIcon,
        labelStyle: AppTypography.bodyLarge.copyWith(
          color: AppColors.textSecondary,
        ),
        floatingLabelStyle: AppTypography.bodyLarge.copyWith(
          color: _getFloatingLabelColor(),
        ),
        hintStyle: AppTypography.bodyLarge.copyWith(
          color: AppColors.textSecondary.withValues(alpha: 0.6),
        ),
        errorText: widget.errorText,
        // Default outline border
        border: OutlineInputBorder(
          borderRadius: AppSpacing.getTextFieldBorderRadius(),
          borderSide: BorderSide(color: AppColors.textFieldBorder, width: 1.0),
        ),
        // Enabled state border
        enabledBorder: OutlineInputBorder(
          borderRadius: AppSpacing.getTextFieldBorderRadius(),
          borderSide: BorderSide(color: AppColors.textFieldBorder, width: 1.0),
        ),
        // Focused state border
        focusedBorder: OutlineInputBorder(
          borderRadius: AppSpacing.getTextFieldBorderRadius(),
          borderSide: BorderSide(color: ColorConstants.focusBlue, width: 2.0),
        ),
        // Error state border
        errorBorder: OutlineInputBorder(
          borderRadius: AppSpacing.getTextFieldBorderRadius(),
          borderSide: const BorderSide(color: AppColors.error, width: 1.0),
        ),
        // Focused error state border
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: AppSpacing.getTextFieldBorderRadius(),
          borderSide: const BorderSide(color: AppColors.error, width: 2.0),
        ),
        // Disabled state border
        disabledBorder: OutlineInputBorder(
          borderRadius: AppSpacing.getTextFieldBorderRadius(),
          borderSide: BorderSide(
            color: AppColors.textSecondary.withValues(alpha: 0.3),
            width: 1.0,
          ),
        ),
        contentPadding: AppSpacing.symmetric(
          horizontal: AppSpacing.space4x,
          vertical: AppSpacing.space3x,
        ),
      ),
      validator: widget.validator,
      onChanged: widget.onChanged,
      onTap: widget.onTap,
    );
  }
}
