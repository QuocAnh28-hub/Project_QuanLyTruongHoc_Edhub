import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';
import 'package:core_localization/core_localization.dart';

import '../../bloc/health_information_bloc.dart';
import '../tabs/widgets/profile_status_badge.dart';

class HealthInformationAppBar extends StatelessWidget
    implements PreferredSizeWidget {
  final HealthInformationState state;
  final AppLocalizations? l10n;

  const HealthInformationAppBar({
    super.key,
    required this.state,
    required this.l10n,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.navBarBackground,
      automaticallyImplyLeading: false,
      centerTitle: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
        onPressed: () => Navigator.of(context).pop(),
      ),
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            l10n?.healthInformationTitle ?? 'Thông tin sức khoẻ',
            style: AppTypography.titleMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
          if (state is HealthInformationSuccess &&
              (state as HealthInformationSuccess)
                  .student
                  .studentMedicalInfo
                  .isEmpty) ...[
            const SizedBox(height: AppSpacing.space0_5x),
            _buildProfileStatusBadge(
              (state as HealthInformationSuccess).student,
              l10n,
            ),
          ],
        ],
      ),
      elevation: 0,
      iconTheme: const IconThemeData(color: AppColors.textPrimary),
    );
  }

  Widget _buildProfileStatusBadge(
    StudentModel student,
    AppLocalizations? l10n,
  ) {
    final hasMedicalInfo = student.studentMedicalInfo.isNotEmpty;

    // Only show status badge if there's no medical info
    if (!hasMedicalInfo) {
      return ProfileStatusBadge(
        status: ProfileStatus.neutral,
        content: l10n?.addToProfileStatus ?? 'BỔ SUNG HỒ SƠ',
      );
    }

    // Don't show anything if there's medical info
    return const SizedBox.shrink();
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
