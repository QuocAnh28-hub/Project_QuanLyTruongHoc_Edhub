import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

import 'profile_menu_item.dart';

/// Profile menu section widget
class ProfileMenuSection extends StatelessWidget {
  const ProfileMenuSection({super.key, this.title, required this.items});

  final String? title;
  final List<ProfileMenuItem> items;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null) ...[
          Text(
            title!,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: AppSpacing.space3x),
        ],
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppColors.black.withValues(alpha: 0.1),
              width: AppSpacing.borderWidth1px,
            ),
          ),
          child: Column(
            children: items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              final isLast = index == items.length - 1;

              return Column(
                children: [
                  item,
                  if (!isLast)
                    Container(
                      height: 1,
                      margin: EdgeInsets.symmetric(
                        horizontal: AppSpacing.space3x,
                      ),
                      color: AppColors.textSecondary.withValues(alpha: 0.2),
                    ),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
