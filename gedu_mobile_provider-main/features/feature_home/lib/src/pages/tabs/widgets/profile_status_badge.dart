import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Status badge component for profile items
class ProfileStatusBadge extends StatelessWidget {
  const ProfileStatusBadge({super.key, required this.status, this.content});

  final ProfileStatus status;
  final String? content;

  @override
  Widget build(BuildContext context) {
    switch (status) {
      case ProfileStatus.warning:
        return _buildWarningBadge(context);
      case ProfileStatus.neutral:
        return _buildNeutralBadge(context);
      case ProfileStatus.success:
        return _buildSuccessBadge(context);
      case ProfileStatus.empty:
        return const SizedBox.shrink();
    }
  }

  Widget _buildWarningBadge(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space1x,
        vertical: AppSpacing.space0_5x,
      ),
      decoration: BoxDecoration(
        color: AppColors.warningBadgeBackground,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius4px),
        border: Border.all(
          color: AppColors.warningBadgeBorder,
          width: AppSpacing.borderWidth1px,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Assets.images.home.homeShield.designSystemSvg(
            width: AppDimensions.iconSizeSmall,
            height: AppDimensions.iconSizeSmall,
          ),
          if (content != null) ...[
            const SizedBox(width: AppSpacing.space1x),
            Text(
              content!,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.warningBadgeText,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildNeutralBadge(BuildContext context) {
    if (content == null) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space1x,
        vertical: AppSpacing.space0_5x,
      ),
      decoration: BoxDecoration(
        color: AppColors.neutralBadgeBackground,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius4px),
        border: Border.all(
          color: AppColors.neutralBadgeBorder.withValues(alpha: 0.2),
          width: AppSpacing.borderWidth1px,
        ),
      ),
      child: Text(
        content!,
        style: AppTypography.bodySmall.copyWith(
          color: AppColors.black, // Text color black
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildSuccessBadge(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space1x,
        vertical: AppSpacing.space0_5x,
      ),
      decoration: BoxDecoration(
        color: AppColors.successBadgeBackground,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius4px),
        border: Border.all(
          color: AppColors.successBadgeBorder.withValues(alpha: 0.2),
          width: AppSpacing.borderWidth1px,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Assets.images.home.homeShieldChecked.designSystemSvg(
            width: AppDimensions.iconSizeSmall,
            height: AppDimensions.iconSizeSmall,
          ),
          if (content != null) ...[
            const SizedBox(width: AppSpacing.space1x),
            Text(
              content!,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.successBadgeText,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Profile status enum
enum ProfileStatus { warning, neutral, success, empty }
