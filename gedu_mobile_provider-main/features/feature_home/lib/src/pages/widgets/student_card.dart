import 'package:core_localization/core_localization.dart';
import 'package:core_students/core_students.dart';
import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Custom painter for dashed line
class DashedLinePainter extends CustomPainter {
  final Color color;
  final double dashWidth;
  final double dashSpace;

  DashedLinePainter({
    required this.color,
    this.dashWidth = 4.0,
    this.dashSpace = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.0;

    double startX = 0;
    while (startX < size.width) {
      canvas.drawLine(Offset(startX, 0), Offset(startX + dashWidth, 0), paint);
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

/// Reusable student card component used in student selection and review screens
class StudentCard extends StatelessWidget {
  const StudentCard({
    required this.student,
    required this.isSelected,
    required this.onTap,
    this.showDisplayName = false,
    super.key,
  });

  final StudentModel student;
  final bool isSelected;
  final VoidCallback onTap;
  final bool showDisplayName;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: AppSpacing.space4x),
        padding: AppSpacing.all(AppSpacing.space4x),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppSpacing.borderRadius16px),
          border: Border.all(
            color: isSelected
                ? AppColors.textFieldFocusBorder
                : AppColors.gray200,
            width: isSelected ? 2.0 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student avatar
            Container(
              width: AppSpacing.space12x, // 48px
              height: AppSpacing.space12x, // 48px
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.gray100,
                border: Border.all(
                  color: AppColors.gray200,
                  width: AppSpacing.borderWidth1px,
                ),
              ),
              child: Center(
                child: Text(
                  _getAvatarLetter(),
                  style: AppTypography.titleMedium.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),

            SizedBox(width: AppSpacing.space3x), // 12px
            // Student information
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Student name
                  Text(
                    showDisplayName ? student.displayName : student.fullName,
                    style: AppTypography.titleMedium.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),

                  SizedBox(height: AppSpacing.space2x), // 8px
                  // Dash border
                  Container(
                    height: 1,
                    child: CustomPaint(
                      painter: DashedLinePainter(color: AppColors.gray300),
                      size: Size(double.infinity, 1),
                    ),
                  ),

                  SizedBox(height: AppSpacing.space2x), // 8px
                  // Class information
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Assets.images.classIcon.designSystemSvg(
                        width: AppSpacing.space4x, // 16px
                        height: AppSpacing.space4x, // 16px
                      ),
                      SizedBox(width: AppSpacing.space1x), // 4px
                      SizedBox(
                        width: AppSpacing
                            .space20x, // Fixed width for label alignment
                        child: Text(
                          AppLocalizations.of(context)?.classLabel ?? 'Lớp',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.gray500,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          student.currentClassName ??
                              (AppLocalizations.of(context)?.noClassYet ??
                                  'Chưa có lớp'),
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.left, // Left-align the content
                          maxLines: null, // Allow multiple lines
                          overflow: TextOverflow.visible,
                        ),
                      ),
                    ],
                  ),

                  SizedBox(height: AppSpacing.space1x), // 4px
                  // School information
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Assets.images.school.designSystemSvg(
                        width: AppSpacing.space4x, // 16px
                        height: AppSpacing.space4x, // 16px
                      ),
                      SizedBox(width: AppSpacing.space1x), // 4px
                      SizedBox(
                        width: AppSpacing
                            .space20x, // Fixed width for label alignment
                        child: Text(
                          AppLocalizations.of(
                                context,
                              )?.studentReviewSchoolLabel ??
                              'Trường học',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.gray500,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          student.schoolName ?? '',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.left, // Left-align the content
                          maxLines: null, // Allow multiple lines
                          overflow: TextOverflow.visible,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Selection indicator - aligned to top with student name
            Container(
              width: AppSpacing.space6x, // 24px
              height: AppSpacing.space6x, // 24px
              child: isSelected
                  ? Assets.images.checked.designSystemSvg(
                      width: AppSpacing.space3x, // 12px
                      height: AppSpacing.space3x, // 12px
                    )
                  : Assets.images.unchecked.designSystemSvg(
                      width: AppSpacing.space3x, // 12px
                      height: AppSpacing.space3x, // 12px
                    ),
            ),
          ],
        ),
      ),
    );
  }

  /// Get the first character of the student's first name for the avatar
  String _getAvatarLetter() {
    return student.firstName.trim().substring(0, 1).toUpperCase();
  }
}
