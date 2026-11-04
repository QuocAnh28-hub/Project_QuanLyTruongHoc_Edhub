import 'package:flutter/material.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';

class RequestEditInfoSheet extends StatefulWidget {
  const RequestEditInfoSheet({
    super.key,
    required this.controller,
    required this.onCancel,
    required this.onSubmit,
  });

  final TextEditingController controller;
  final VoidCallback onCancel;
  final VoidCallback onSubmit;

  @override
  State<RequestEditInfoSheet> createState() => _RequestEditInfoSheetState();
}

class _RequestEditInfoSheetState extends State<RequestEditInfoSheet> {
  late final FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _focusNode.requestFocus();
      }
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    return AnimatedPadding(
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeOut,
      padding: EdgeInsets.only(bottom: bottomInset),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.space4x),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: AppSpacing.space3x),
                  decoration: BoxDecoration(
                    color: AppColors.gray300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Center(
                child: Text(
                  l10n?.requestEditInfoTitle ?? 'Yêu cầu chỉnh sửa thông tin',
                  style: AppTypography.titleMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.space4x),
              Material3TextField(
                controller: widget.controller,
                labelText:
                    l10n?.requestEditInfoDetailsLabel ?? 'Chi tiết yêu cầu',
                hintText:
                    l10n?.requestEditInfoDetailsHint ??
                    'Vui lòng mô tả thông tin cần được chỉnh sửa...',
                maxLines: 6,
                autofocus: true,
                focusNode: _focusNode,
              ),
              const SizedBox(height: AppSpacing.space4x),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: widget.onCancel,
                      style: AppButtonStyles.secondaryRounded,
                      child: Text(l10n?.dashboardCancel ?? 'Huỷ'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space3x),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: widget.onSubmit,
                      style: AppButtonStyles.primaryRounded,
                      child: Text(l10n?.requestEditInfoSend ?? 'Gửi thông tin'),
                    ),
                  ),
                ],
              ),
              // Extra spacer so keyboard never covers actions
              SizedBox(
                height:
                    AppSpacing.space3x + MediaQuery.of(context).padding.bottom,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
