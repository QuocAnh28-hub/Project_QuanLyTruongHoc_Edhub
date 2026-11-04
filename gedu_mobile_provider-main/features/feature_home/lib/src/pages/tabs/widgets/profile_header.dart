import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

import '../../../bloc/profile_state.dart';

/// Profile header widget with gradient background and contact card
class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key, required this.state});

  final ProfileState state;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 250, // Increased height to ensure no overflow
      decoration: BoxDecoration(
        image: DecorationImage(
          image: Assets.images.profile.gradientBg
              .designSystemImage(width: double.infinity, fit: BoxFit.cover)
              .image,
          fit: BoxFit.cover,
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.space6x,
            vertical: AppSpacing.space3x, // Adjusted padding for better spacing
          ),
          child: _buildContactCard(context),
        ),
      ),
    );
  }

  Widget _buildContactCard(BuildContext context) {
    if (state is! ProfileSuccess) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.white),
      );
    }

    final accountInfo = (state as ProfileSuccess).accountInfo;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min, // Prevent unnecessary expansion
      children: [
        // Profile picture centered
        CircleAvatar(
          radius: 40,
          backgroundColor: AppColors.primary.withValues(alpha: 0.1),
          child: const Icon(Icons.person, size: 40, color: AppColors.primary),
        ),
        const SizedBox(height: AppSpacing.space3x),
        // User name centered
        Text(
          '${accountInfo.lastName} ${accountInfo.firstName}',
          style: AppTypography.titleLarge.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
          overflow: TextOverflow.ellipsis,
          maxLines: 2,
        ),
        const SizedBox(
          height: AppSpacing.space2x,
        ), // Increased spacing between name and phone
        // Email centered
        Text(
          accountInfo.email,
          style: AppTypography.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
          overflow: TextOverflow.ellipsis,
          maxLines: 2,
        ),
      ],
    );
  }
}
