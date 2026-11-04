import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';

import '../bloc/student_information_bloc.dart';
import '../utils/utils.dart';

import 'widgets/collapsible_section.dart';
import 'widgets/contact_item.dart';
import 'tabs/widgets/profile_status_badge.dart';
import 'widgets/request_edit_info_sheet.dart';
import 'widgets/request_edit_info_submitted_sheet.dart';

/// Student Information Page
class StudentInformationPage extends StatefulWidget {
  const StudentInformationPage({
    super.key,
    required this.refId,
    required this.studentId,
  });

  final String refId;
  final int studentId;

  @override
  State<StudentInformationPage> createState() => _StudentInformationPageState();
}

class _StudentInformationPageState extends State<StudentInformationPage> {
  bool _isConfirming = false;

  @override
  void initState() {
    super.initState();
    _loadStudentInformationData();
  }

  void _loadStudentInformationData() {
    context.read<StudentInformationBloc>().add(
      LoadStudentInformationDataEvent(
        refId: widget.refId,
        studentId: widget.studentId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return BlocListener<StudentInformationBloc, StudentInformationState>(
      listener: (context, state) {
        if (state is StudentInformationSuccess && _isConfirming) {
          // Reset loading state
          setState(() {
            _isConfirming = false;
          });

          // Show success snackbar
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Xác nhận thông tin học sinh thành công.',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
              backgroundColor: AppColors.gray900,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          );

          // Don't pop back - let user stay on the info page
        }
      },
      child: BlocBuilder<StudentInformationBloc, StudentInformationState>(
        builder: (context, state) {
          return Scaffold(
            backgroundColor: AppColors.appBackground,
            appBar: _buildAppBar(state, l10n),
            body: _buildBody(state, l10n),
          );
        },
      ),
    );
  }

  PreferredSizeWidget _buildAppBar(
    StudentInformationState state,
    AppLocalizations? l10n,
  ) {
    return AppBar(
      backgroundColor: AppColors.navBarBackground,
      automaticallyImplyLeading: false,
      centerTitle: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: AppColors.textPrimary),
        onPressed: () {
          // Return true to indicate data was potentially updated
          Navigator.of(context).pop(true);
        },
      ),
      title: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            l10n?.studentInformationTitle ?? 'Thông tin cá nhân',
            style: AppTypography.titleMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
          if (state is StudentInformationSuccess) ...[
            const SizedBox(height: AppSpacing.space0_5x),
            _buildProfileStatusBadge(state.student, l10n),
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
    final needsConfirmation = student.confirmedById == null;

    if (needsConfirmation) {
      return ProfileStatusBadge(
        status: ProfileStatus.warning,
        content: l10n?.needsConfirmationStatus ?? 'CẦN XÁC NHẬN',
      );
    }

    return ProfileStatusBadge(
      status: ProfileStatus.success,
      content: l10n?.confirmedStatus ?? 'ĐÃ XÁC NHẬN',
    );
  }

  Widget _buildBody(StudentInformationState state, AppLocalizations? l10n) {
    if (state is StudentInformationLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is StudentInformationError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              state.message,
              style: AppTypography.bodyMedium.copyWith(color: AppColors.error),
            ),
            const SizedBox(height: AppSpacing.space4x),
            ElevatedButton(
              onPressed: _loadStudentInformationData,
              style: AppButtonStyles.primaryRounded,
              child: Text('Thử lại'),
            ),
          ],
        ),
      );
    }

    if (state is StudentInformationSuccess) {
      final student = state.student;
      final religions = state.religions;

      return Column(
        children: [
          // Scrollable content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.space4x),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Student detailed information section
                  CollapsibleSection(
                    title: 'Thông tin chi tiết học sinh',
                    icon: Assets.images.profile.studentInfoGeneral,
                    defaultExpanded: true,
                    children: [
                      Column(
                        children: [
                          _buildInfoRow(
                            label: 'Mã định danh/CCCD',
                            value: student.citizenId ?? '-',
                          ),
                          _buildDivider(),
                          _buildInfoRow(
                            label: 'Ngày sinh',
                            value: student.dateOfBirthDisplay,
                          ),
                          _buildDivider(),
                          _buildInfoRow(
                            label: 'Giới tính',
                            value: student.sexEnum.getLocalizedDisplayText(
                              l10n,
                            ),
                          ),
                          _buildDivider(),
                          _buildInfoRow(
                            label: 'Quốc tịch',
                            value: student.nationalityTitle ?? '-',
                          ),
                          _buildDivider(),
                          _buildInfoRow(
                            label: 'Tôn giáo',
                            value: _getReligionTitle(
                              student.religionId,
                              religions,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.space4x),

                  // Contact Information section
                  CollapsibleSection(
                    title: 'Thông tin liên hệ',
                    icon: Assets.images.profile.studentInfoContact,
                    defaultExpanded: true,
                    useListView: true,
                    children: student.studentContacts
                        .map(
                          (contact) => ContactItem(
                            contact: contact,
                            student: student,
                            l10n: l10n,
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
            ),
          ),

          // Bottom buttons section
          Container(
            padding: const EdgeInsets.all(AppSpacing.space4x),
            child: _buildActionButtons(l10n, student),
          ),
        ],
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildInfoRow({required String label, required String value}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space2x),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.start,
            ),
          ),
          const SizedBox(width: AppSpacing.space2x),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.black,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.end,
              softWrap: true,
              overflow: TextOverflow.visible,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return const Divider(height: 1, thickness: 1, color: AppColors.border);
  }

  String _getReligionTitle(int? religionId, List<ReligionModel> religions) {
    if (religionId == null) return '-';

    final religion = religions.firstWhere(
      (r) => r.id == religionId,
      orElse: () => const ReligionModel(id: -1, title: '-'),
    );

    return religion.title;
  }

  Widget _buildActionButtons(AppLocalizations? l10n, StudentModel student) {
    return Column(
      children: [
        // Only show confirm button if student is not confirmed
        if (student.confirmedById == null) ...[
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isConfirming
                  ? null
                  : () {
                      setState(() {
                        _isConfirming = true;
                      });

                      context.read<StudentInformationBloc>().add(
                        ConfirmStudentInformationEvent(
                          refId: widget.refId,
                          studentId: widget.studentId,
                        ),
                      );
                    },
              style: AppButtonStyles.primaryRounded,
              child: _isConfirming
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          AppColors.white,
                        ),
                      ),
                    )
                  : Text(
                      l10n?.confirmStudentInformationButton ??
                          'Xác nhận thông tin học sinh',
                      style: AppTypography.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: AppSpacing.space3x),
        ],
        // Always show request edit button
        TextButton(
          onPressed: () {
            _showRequestEditInfoSheet();
          },
          child: Text(
            l10n?.requestInformationEditButton ?? 'Yêu cầu chỉnh sửa thông tin',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.space3x),
      ],
    );
  }

  void _showRequestEditInfoSheet() {
    final textController = TextEditingController();

    showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return RequestEditInfoSheet(
          controller: textController,
          onCancel: () => Navigator.of(context).pop(),
          onSubmit: () => Navigator.of(context).pop(textController.text.trim()),
        );
      },
    ).then((details) {
      if (details is String && details.isNotEmpty) {
        _showRequestEditInfoSubmittedSheet(details);
      }
    });
  }

  void _showRequestEditInfoSubmittedSheet(String details) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return RequestEditInfoSubmittedSheet(
          details: details,
          onClose: () => Navigator.of(context).pop(),
        );
      },
    );
  }
}
