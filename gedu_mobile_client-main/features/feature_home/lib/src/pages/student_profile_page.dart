import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_storage/core_storage.dart' hide getIt;
import 'package:core_students/core_students.dart';
import 'package:feature_home/feature_home.dart';

import 'tabs/widgets/profile_status_badge.dart';
import 'widgets/request_edit_info_sheet.dart';
import 'widgets/request_edit_info_submitted_sheet.dart';

class StudentProfilePage extends StatefulWidget {
  const StudentProfilePage({super.key});

  @override
  State<StudentProfilePage> createState() => _StudentProfilePageState();
}

class _StudentProfilePageState extends State<StudentProfilePage> {
  @override
  void initState() {
    super.initState();
    _loadStudentProfile();
  }

  void _loadStudentProfile() {
    final appPreferences = getIt<AppPreferences>();
    final refId = AuthStorage.getRefId();
    final selectedStudentData = appPreferences.getSelectedStudent();

    if (refId != null && selectedStudentData != null) {
      final selectedStudentId = selectedStudentData['id'] as int?;
      if (selectedStudentId != null) {
        context.read<StudentProfileBloc>().add(
          LoadStudentProfileEvent(
            refId: refId.toString(),
            studentId: selectedStudentId,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

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
          l10n?.studentProfileTitle ?? 'Hồ sơ học sinh',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),
      body: BlocBuilder<StudentProfileBloc, StudentProfileState>(
        builder: (context, state) {
          if (state is StudentProfileLoading) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    width: 40,
                    height: 40,
                    child: CircularProgressIndicator(
                      strokeWidth: 3,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.space4x),
                  Text(
                    l10n?.loadingStudentProfile ?? 'Loading student profile...',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            );
          }

          if (state is StudentProfileError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: AppColors.error),
                  const SizedBox(height: AppSpacing.space3x),
                  Text(
                    state.message,
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.space3x),
                  ElevatedButton(
                    onPressed: _loadStudentProfile,
                    style: AppButtonStyles.primary,
                    child: Text(l10n?.retry ?? 'Thử lại'),
                  ),
                ],
              ),
            );
          }

          if (state is StudentProfileSuccess) {
            return _buildStudentProfileContent(context, state.student, l10n);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildStudentProfileContent(
    BuildContext context,
    StudentModel student,
    AppLocalizations? l10n,
  ) {
    return RefreshIndicator(
      onRefresh: () async {
        // Reload student profile data when user pulls to refresh
        _loadStudentProfile();
      },
      color: AppColors.primary,
      backgroundColor: AppColors.white,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4x), // 16px
        child: Column(
          children: [
            // Main Student Information Card
            _buildStudentInfoCard(student, l10n),
            const SizedBox(height: AppSpacing.space3x),

            // Personal Information Card
            _buildInfoCard(
              icon: Assets.images.home.studentInfo.designSystemSvg(),
              title: l10n?.personalInformationTitle ?? 'Thông tin cá nhân',
              subtitle:
                  l10n?.personalInformationSubtitle ??
                  'Chi tiết học sinh và thông tin liên hệ.',
              status: student.confirmedById != null
                  ? ProfileStatus.success
                  : ProfileStatus.warning,
              statusContent: student.confirmedById != null
                  ? l10n?.alreadyConfirmedStatus ?? 'ĐÃ XÁC NHẬN'
                  : l10n?.needsConfirmationStatus ?? 'CẦN XÁC NHẬN',
              onTap: () async {
                final refId = AuthStorage.getRefId();
                if (refId != null) {
                  final result = await context.push(
                    '/student-information',
                    extra: {'refId': refId.toString(), 'studentId': student.id},
                  );

                  // If result is true, reload profile data
                  if (result == true) {
                    _loadStudentProfile();
                  }
                }
              },
            ),
            const SizedBox(height: AppSpacing.space2x),

            // Academic & Policy Card
            _buildInfoCard(
              icon: Assets.images.home.studentPolicy.designSystemSvg(),
              title: l10n?.academicPolicyTitle ?? 'Học vụ & Chính sách',
              subtitle:
                  l10n?.academicPolicySubtitle ??
                  'Thông tin học vụ và quy định chung.',
              status: ProfileStatus.empty,
              onTap: () {
                final appPreferences = getIt<AppPreferences>();
                final refId = AuthStorage.getRefId();
                if (refId != null) {
                  context.push(
                    '/academic-policy',
                    extra: {'refId': refId.toString(), 'studentId': student.id},
                  );
                }
              },
            ),
            const SizedBox(height: AppSpacing.space2x),

            // Health Information Card
            _buildInfoCard(
              icon: Assets.images.home.studentHealth.designSystemSvg(),
              title: l10n?.healthInformationTitle ?? 'Thông tin sức khoẻ',
              subtitle:
                  l10n?.healthInformationSubtitle ??
                  'Thông tin về dị ứng và các bệnh lý nền.',
              status: student.studentMedicalInfo.isEmpty
                  ? ProfileStatus.neutral
                  : ProfileStatus.empty,
              statusContent: l10n?.addToProfileStatus ?? 'BỔ SUNG HỒ SƠ',
              onTap: () {
                final refId = AuthStorage.getRefId();
                if (refId != null) {
                  context.push(
                    '/health-information',
                    extra: {'refId': refId.toString(), 'studentId': student.id},
                  );
                }
              },
            ),
            const SizedBox(height: AppSpacing.space2x),

            // Document Profile Card
            _buildInfoCard(
              icon: Assets.images.home.studentDocument.designSystemSvg(),
              title: l10n?.documentProfileTitle ?? 'Hồ sơ văn bản',
              subtitle:
                  l10n?.documentProfileSubtitle ??
                  'Giấy tờ tùy thân và các văn bản bắt buộc.',
              status: student.documents == 0
                  ? ProfileStatus.neutral
                  : ProfileStatus.empty,
              statusContent: l10n?.addToProfileStatus ?? 'BỔ SUNG HỒ SƠ',
              onTap: () {
                // TODO: Navigate to document profile details
              },
            ),
            const SizedBox(height: AppSpacing.space4x),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentInfoCard(StudentModel student, AppLocalizations? l10n) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.space4x), // 16px padding
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius8px),
        border: Border.all(color: AppColors.black.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Student Avatar and Basic Info
          Row(
            children: [
              CircleAvatar(
                radius: 32,
                backgroundColor: AppColors.primary,
                child: Text(
                  (student.firstName.isNotEmpty ? student.firstName[0] : 'S')
                      .toUpperCase(),
                  style: AppTypography.titleLarge.copyWith(
                    color: AppColors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space3x),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      student.displayName,
                      style: AppTypography.titleLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space1x),
                    Text(
                      '${l10n?.studentIdLabel ?? 'Mã học sinh'}: ${student.code}',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.space3x),
          Divider(color: AppColors.border, height: 1),
          const SizedBox(height: AppSpacing.space3x),

          // Academic Information Section
          Text(
            l10n?.academicInformationTitle ?? 'Thông tin học vụ',
            style: AppTypography.titleSmall.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),

          _buildInfoRow(
            icon: Icons.class_outlined,
            label: l10n?.classLabel ?? 'Lớp',
            value:
                student.currentClassName ?? l10n?.noClassYet ?? 'Chưa có lớp',
          ),
          const SizedBox(height: AppSpacing.space2x),
          _buildInfoRow(
            icon: Icons.school_outlined,
            label: l10n?.curriculumLabel ?? 'Chương trình học',
            value: 'Song ngữ', // Using the value from the design
          ),

          const SizedBox(height: AppSpacing.space3x),
          Divider(color: AppColors.border, height: 1),
          const SizedBox(height: AppSpacing.space3x),

          // Primary Contact Section
          Text(
            l10n?.primaryContactLabel ?? 'Người liên hệ chính',
            style: AppTypography.titleSmall.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),

          _buildInfoRow(
            icon: Icons.contact_phone_outlined,
            label: l10n?.contactPersonLabel ?? 'Người liên hệ',
            value:
                '${student.mainStudentContact?.phone ?? '0902 412 856'} (${l10n?.fatherLabel ?? 'Cha'})',
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.textSecondary),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: Text(
            label,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Flexible(
          child: Text(
            value,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w500,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard({
    required dynamic icon,
    required String title,
    required String subtitle,
    ProfileStatus? status,
    String? statusContent,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.space4x),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppSpacing.borderRadius8px),
          border: Border.all(color: AppColors.black.withValues(alpha: 0.1)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (icon is IconData)
              Icon(icon, size: 24, color: AppColors.primary)
            else if (icon is Widget)
              icon,
            const SizedBox(width: AppSpacing.space3x),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Flexible(
                        child: Text(
                          title,
                          style: AppTypography.bodyLarge.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (status != null) ...[
                        const SizedBox(width: AppSpacing.space2x),
                        ProfileStatusBadge(
                          status: status,
                          content: statusContent,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: AppSpacing.space1x),
                  Text(
                    subtitle,
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: AppSpacing.space2x),
            Icon(Icons.chevron_right, color: AppColors.textSecondary),
          ],
        ),
      ),
    );
  }
}
