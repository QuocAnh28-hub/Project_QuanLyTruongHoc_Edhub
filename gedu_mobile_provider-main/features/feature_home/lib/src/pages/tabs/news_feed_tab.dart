import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// News Feed Tab
class NewsFeedTab extends StatelessWidget {
  const NewsFeedTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Bảng tin',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.feed, size: 64, color: AppColors.textSecondary),
            SizedBox(height: AppSpacing.space4x),
            Text(
              'Bảng tin - Coming Soon',
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
