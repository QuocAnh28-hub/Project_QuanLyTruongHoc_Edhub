import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';

import '../bloc/academic_policy_bloc.dart';
import '../utils/student_status_extensions.dart';
import '../utils/admission_type_extensions.dart';

/// Academic & Policy Page
class AcademicPolicyPage extends StatefulWidget {
  const AcademicPolicyPage({
    super.key,
    required this.refId,
    required this.studentId,
  });

  final String refId;
  final int studentId;

  @override
  State<AcademicPolicyPage> createState() => _AcademicPolicyPageState();
}

class _AcademicPolicyPageState extends State<AcademicPolicyPage> {
  @override
  void initState() {
    super.initState();
    _loadAcademicPolicyData();
  }

  void _loadAcademicPolicyData() {
    context.read<AcademicPolicyBloc>().add(
      LoadAcademicPolicyDataEvent(
        refId: widget.refId,
        studentId: widget.studentId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return BlocBuilder<AcademicPolicyBloc, AcademicPolicyState>(
      builder: (context, state) {
        return Scaffold(
          backgroundColor: AppColors.appBackground,
          appBar: AppBar(
            backgroundColor: AppColors.navBarBackground,
            automaticallyImplyLeading: false,
            leading: IconButton(
              icon: Icon(Icons.arrow_back, color: AppColors.textPrimary),
              onPressed: () => Navigator.of(context).pop(),
            ),
            title: Text(
              l10n?.academicPolicyTitle ?? 'Học vụ & Chính sách',
              style: AppTypography.titleMedium.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
            elevation: 0,
            iconTheme: const IconThemeData(color: AppColors.textPrimary),
          ),
          body: _buildBody(state, l10n),
        );
      },
    );
  }

  Widget _buildBody(AcademicPolicyState state, AppLocalizations? l10n) {
    if (state is AcademicPolicyLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is AcademicPolicyError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: AppColors.error),
            const SizedBox(height: AppSpacing.space3x),
            Text(
              state.message,
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }

    if (state is AcademicPolicySuccess) {
      final student = state.student;
      return SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4x),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Admission Information Card
            _buildInfoCard(
              title: l10n?.admissionInformationTitle ?? 'Thông tin nhập học',
              children: _buildInfoRowsWithDividers([
                _buildInfoRow(
                  svgIcon: Assets.images.profile.admissionDate,
                  label: l10n?.admissionDateLabel ?? 'Ngày nhập học',
                  value: student.admissionDateDisplay,
                ),
                _buildInfoRow(
                  svgIcon: Assets.images.profile.admissionYear,
                  label: l10n?.admissionYearLabel ?? 'Năm học nhập học',
                  value: student.admissionSchoolYearTitle ?? 'N/A',
                ),
                _buildInfoRow(
                  svgIcon: Assets.images.profile.admissionStatus,
                  label: l10n?.admissionTypeLabel ?? 'Hình thức nhập học',
                  value:
                      student.admissionTypeEnum?.getLocalizedDisplayText(
                        l10n,
                      ) ??
                      'N/A',
                ),
              ]),
            ),
            const SizedBox(height: AppSpacing.space3x),

            // Class Information Card
            _buildInfoCard(
              title: l10n?.classInformationTitle ?? 'Thông tin lớp học',
              children: _buildInfoRowsWithDividers([
                _buildInfoRow(
                  svgIcon: Assets.images.profile.studentStatus,
                  label: l10n?.statusLabel ?? 'Trạng thái',
                  value: '',
                  trailing: _buildStudentStatusBadge(student.statusEnum, l10n),
                ),
                _buildInfoRow(
                  svgIcon: Assets.images.profile.gradeName,
                  label: 'Khối',
                  value: student.studentGradeLevel != null
                      ? 'Cấp ${student.studentGradeLevel}'
                      : 'N/A',
                ),
                _buildInfoRow(
                  svgIcon: Assets.images.profile.classInfo,
                  label: l10n?.classLabel ?? 'Lớp',
                  value: student.currentClassName ?? 'N/A',
                ),
                _buildInfoRow(
                  icon: Icons.book_outlined,
                  label: l10n?.curriculumLabel ?? 'Chương trình học',
                  value: 'Song ngữ',
                ),
              ]),
            ),
            const SizedBox(height: AppSpacing.space3x),

            // Regime & Policy Card
            _buildInfoCard(
              title: l10n?.regimePolicyTitle ?? 'Chế độ & chính sách',
              children: _buildInfoRowsWithDividers([
                _buildInfoRow(
                  svgIcon: Assets.images.profile.priorityPolicy,
                  label: l10n?.priorityStatusLabel ?? 'Diện ưu tiên',
                  value: student.priorityPolicyTitle ?? 'N/A',
                ),
                _buildInfoRow(
                  svgIcon: Assets.images.profile.specialNeedsPolicy,
                  label: l10n?.disabilityStatusLabel ?? 'Diện khuyết tật',
                  value: student.specialNeedsPolicyTitle ?? 'N/A',
                ),
              ]),
            ),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildInfoCard({
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(
        left: AppSpacing.space4x,
        right: AppSpacing.space4x,
        top: AppSpacing.space2x,
        bottom: AppSpacing.space1x,
      ),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius12px),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow.withValues(alpha: 0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: AppTypography.titleSmall.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppSpacing.space1x),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required String label,
    required String value,
    Widget? trailing,
    IconData? icon,
    SvgGenImage? svgIcon,
  }) {
    Widget leadingWidget;
    if (svgIcon != null) {
      leadingWidget = svgIcon.designSystemSvg();
    } else if (icon != null) {
      leadingWidget = Icon(icon, size: 20, color: AppColors.textSecondary);
    } else {
      leadingWidget = const SizedBox.shrink();
    }

    return ListTile(
      contentPadding: AppSpacing.symmetric(vertical: AppSpacing.space0_5x),
      leading: leadingWidget,
      title: Text(
        label,
        style: AppTypography.bodyMedium.copyWith(
          color: AppColors.textSecondary,
          fontWeight: FontWeight.w500,
        ),
      ),
      trailing:
          trailing ??
          Text(
            value,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w500,
            ),
          ),
    );
  }

  List<Widget> _buildInfoRowsWithDividers(List<Widget> rows) {
    return rows.asMap().entries.map((entry) {
      final index = entry.key;
      final row = entry.value;
      final isLast = index == rows.length - 1;

      return Column(
        children: [
          row,
          if (!isLast)
            Container(
              height: 1,
              color: AppColors.textSecondary.withValues(alpha: 0.2),
            ),
        ],
      );
    }).toList();
  }

  Widget _buildStudentStatusBadge(
    StudentStatus status,
    AppLocalizations? l10n,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space1x,
        vertical: AppSpacing.space0_5x,
      ),
      decoration: BoxDecoration(
        color: status.badgeBackgroundColor,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius4px),
        border: Border.all(
          color: status.badgeBorderColor,
          width: AppSpacing.borderWidth1px,
        ),
      ),
      child: Text(
        status.getLocalizedDisplayText(l10n).toUpperCase(),
        style: AppTypography.bodySmall.copyWith(
          color: status.badgeTextColor,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
