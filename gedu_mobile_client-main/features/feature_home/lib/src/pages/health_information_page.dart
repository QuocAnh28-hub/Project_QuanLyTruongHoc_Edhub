import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';
import 'package:get_it/get_it.dart';

import '../bloc/health_information_bloc.dart';
import '../bloc/health_information_form_bloc.dart';

import 'widgets/health_information_app_bar.dart';
import 'widgets/health_information_form.dart';

/// Health Information Page
class HealthInformationPage extends StatefulWidget {
  const HealthInformationPage({
    super.key,
    required this.refId,
    required this.studentId,
  });

  final String refId;
  final int studentId;

  @override
  State<HealthInformationPage> createState() => _HealthInformationPageState();
}

class _HealthInformationPageState extends State<HealthInformationPage> {
  @override
  void initState() {
    super.initState();
    _loadHealthInformationData();
  }

  void _loadHealthInformationData() {
    context.read<HealthInformationBloc>().add(
      LoadHealthInformationDataEvent(
        refId: widget.refId,
        studentId: widget.studentId,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return BlocBuilder<HealthInformationBloc, HealthInformationState>(
      builder: (context, state) {
        return Scaffold(
          backgroundColor: AppColors.appBackground,
          appBar: HealthInformationAppBar(state: state, l10n: l10n),
          body: _buildBody(state, l10n),
        );
      },
    );
  }

  Widget _buildBody(HealthInformationState state, AppLocalizations? l10n) {
    if (state is HealthInformationLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state is HealthInformationError) {
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

    if (state is HealthInformationSuccess) {
      final student = state.student;
      return SingleChildScrollView(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space4x,
          vertical: AppSpacing.space6x,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Allergies Section
            _buildInfoCard(
              title: l10n?.allergiesTitle ?? 'Dị ứng',
              children: [
                _buildTypeRow(
                  label: l10n?.foodAllergyLabel ?? 'Dị ứng thực phẩm',
                  content: _getMedicalInfoContent(
                    student,
                    StudentMedicalInfoTypeEnum.foodAllergy,
                  ),
                ),
                _buildDivider(),
                _buildTypeRow(
                  label: l10n?.drugAllergyLabel ?? 'Dị ứng thuốc',
                  content: _getMedicalInfoContent(
                    student,
                    StudentMedicalInfoTypeEnum.drugAllergy,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space4x),

            // Chronic Diseases Section
            _buildInfoCard(
              title: l10n?.chronicDiseasesTitle ?? 'Bệnh mãn tính/bệnh nền',
              children: [
                _buildTypeRow(
                  label: l10n?.chronicDiseasesLabel ?? 'Bệnh mãn tính/bệnh nền',
                  content: _getMedicalInfoContent(
                    student,
                    StudentMedicalInfoTypeEnum.chronicOrUnderlying,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space4x),

            // Additional Notes Section
            _buildInfoCard(
              title: l10n?.additionalNotesTitle ?? 'Ghi chú thêm',
              children: [
                _buildTypeRow(
                  label:
                      l10n?.additionalNotesLabel ??
                      'Đặc điểm hoặc thói quen đặc biệt cần lưu ý',
                  content: _getMedicalInfoContent(
                    student,
                    StudentMedicalInfoTypeEnum.undetermined,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space6x),

            // Edit Health Information Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  _showHealthInformationForm(context, l10n, state);
                },
                style: AppButtonStyles.primary.copyWith(
                  padding: WidgetStateProperty.all(
                    const EdgeInsets.symmetric(vertical: AppSpacing.space4x),
                  ),
                ),
                label: const Text('Cập nhật', style: AppTypography.bodyMedium),
              ),
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
        borderRadius: BorderRadius.circular(AppSpacing.borderRadius8px),
        border: Border.all(color: AppColors.black.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _buildTypeRow({required String label, required Widget content}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space2x),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Type label
          Text(
            label,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: AppSpacing.space1x),
          // Content
          content,
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 1,
      color: AppColors.textSecondary.withValues(alpha: 0.2),
    );
  }

  Widget _getMedicalInfoContent(
    StudentModel student,
    StudentMedicalInfoTypeEnum type,
  ) {
    final medicalInfo = student.studentMedicalInfo
        .where((info) => info.typeEnum == type)
        .firstOrNull;

    if (medicalInfo?.description != null &&
        medicalInfo!.description!.isNotEmpty) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Assets.images.home.homeShield.designSystemSvg(width: 20, height: 20),
          const SizedBox(width: AppSpacing.space1x),
          Text(
            medicalInfo.description!,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      );
    } else {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '-',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      );
    }
  }

  void _showHealthInformationForm(
    BuildContext context,
    AppLocalizations? l10n,
    HealthInformationSuccess state,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      isDismissible: false,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) => BlocProvider(
        create: (context) => GetIt.instance<HealthInformationFormBloc>(),
        child: HealthInformationForm(
          student: state.student,
          refId: widget.refId,
          studentId: widget.studentId,
          onSaved: () {
            // Refresh the health information data after saving
            _loadHealthInformationData();
          },
        ),
      ),
    );
  }
}
