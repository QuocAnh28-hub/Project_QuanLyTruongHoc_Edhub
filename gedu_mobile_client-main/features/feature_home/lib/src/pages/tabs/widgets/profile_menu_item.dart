import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Profile menu item widget
class ProfileMenuItem extends StatelessWidget {
  const ProfileMenuItem({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
  });

  final Widget icon;
  final String title;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: AppSpacing.symmetric(
        horizontal: AppSpacing.space3x,
        vertical: AppSpacing.space1x,
      ),
      leading: SizedBox(width: 24, height: 24, child: icon),
      title: Text(
        title,
        style: AppTypography.bodyMedium.copyWith(color: AppColors.black),
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios,
        size: 16,
        color: AppColors.textSecondary,
      ),
      onTap: onTap,
    );
  }
}
