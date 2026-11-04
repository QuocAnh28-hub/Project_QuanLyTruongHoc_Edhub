import 'package:flutter/material.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';

class RequestEditInfoSubmittedSheet extends StatelessWidget {
  const RequestEditInfoSubmittedSheet({
    super.key,
    required this.details,
    required this.onClose,
  });

  final String details;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      padding: const EdgeInsets.all(AppSpacing.space4x),
      child: Column(
        mainAxisSize: MainAxisSize.min,
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
            child: Assets.images.profile.infoUpdateRequested.designSystemSvg(),
          ),
          const SizedBox(height: AppSpacing.space3x),
          Center(
            child: Text(
              l10n?.requestInformationEditButton ?? 'Đã gửi yêu cầu chỉnh sửa',
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),
          Center(
            child: Text(
              l10n?.forgotPasswordMessage ??
                  'Nhà trường sẽ xem xét yêu cầu của bạn và phản hồi trong thời gian sớm nhất.',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: AppSpacing.space3x),
          Text(
            l10n?.additionalNotesLabel ?? 'Chi tiết yêu cầu',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: AppSpacing.space1x),
          Text(
            details,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space4x),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onClose,
              style: AppButtonStyles.primaryRounded,
              child: Text(l10n?.forgotPasswordButtonText ?? 'Tôi đã hiểu'),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 8),
        ],
      ),
    );
  }
}
