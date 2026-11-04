import 'package:core_localization/core_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';
import '../bloc/student_review_bloc.dart';
import '../bloc/student_review_event.dart';
import '../bloc/student_review_state.dart';
import 'widgets/student_card.dart';

class StudentReviewPage extends StatefulWidget {
  const StudentReviewPage({super.key});

  @override
  State<StudentReviewPage> createState() => _StudentReviewPageState();
}

class _StudentReviewPageState
    extends BasePageState<StudentReviewPage, StudentReviewBloc> {
  @override
  void initState() {
    super.initState();
    bloc.setContext(context);
    bloc.add(const LoadStudentReviewEvent());
  }

  @override
  Widget buildPage(BuildContext context) {
    return const StudentReviewView();
  }
}

class StudentReviewView extends StatelessWidget {
  const StudentReviewView({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: BlocBuilder<StudentReviewBloc, StudentReviewState>(
        builder: (context, state) {
          if (state is StudentReviewLoading) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.selectionBlue),
            );
          }

          if (state is StudentReviewError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppColors.error,
                  ),
                  const SizedBox(height: AppSpacing.space4x),
                  Text(
                    state.message,
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.space4x),
                  ElevatedButton(
                    onPressed: () {
                      context.read<StudentReviewBloc>().add(
                        const LoadStudentReviewEvent(),
                      );
                    },
                    style: AppButtonStyles.primaryRounded,
                    child: Text(l10n?.studentReviewRetryButton ?? 'Thử lại'),
                  ),
                ],
              ),
            );
          }

          if (state is StudentReviewLoaded) {
            return Column(
              children: [
                // Welcome section
                Container(
                  padding: const EdgeInsets.only(
                    top: AppSpacing.space4x, // 20px top padding for logo
                    left: AppSpacing.space4x,
                    right: AppSpacing.space4x,
                    bottom: AppSpacing.space4x,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: AppSpacing.space12x),
                      // App Logo
                      Assets.images.logo.designSystemSvg(
                        height: 42,
                        fit: BoxFit.contain,
                      ),
                      const SizedBox(height: AppSpacing.space6x),
                      Text(
                        l10n?.studentReviewWelcomeTitle ?? '',
                        style: AppTypography.headlineMedium.copyWith(
                          color: AppColors.black,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: AppSpacing.space2x),
                      Text(
                        l10n?.studentReviewInstruction ??
                            'Tài khoản của bạn được liên kết với nhiều học sinh. Vui lòng chọn một học sinh để tiếp tục.',
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),

                // Student list
                Expanded(
                  child: ListView.builder(
                    padding: AppSpacing.horizontal(AppSpacing.space5x),
                    itemCount: state.students.length,
                    itemBuilder: (context, index) {
                      final student = state.students[index];
                      final isSelected = state.selectedStudent == student;
                      return StudentCard(
                        student: student,
                        isSelected: isSelected,
                        showDisplayName: false,
                        onTap: () {
                          context.read<StudentReviewBloc>().add(
                            SelectStudentEvent(student: student),
                          );
                        },
                      );
                    },
                  ),
                ),

                // Bottom actions
                _buildBottomActions(context, l10n),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildBottomActions(BuildContext context, AppLocalizations? l10n) {
    return BlocBuilder<StudentReviewBloc, StudentReviewState>(
      builder: (context, state) {
        if (state is StudentReviewLoaded) {
          return Container(
            decoration: const BoxDecoration(color: AppColors.white),
            padding: EdgeInsets.only(
              top: AppSpacing.space5x,
              left: AppSpacing.space5x,
              right: AppSpacing.space5x,
              bottom:
                  AppSpacing.space5x + MediaQuery.of(context).padding.bottom,
            ),
            child: ElevatedButton(
              onPressed: state.selectedStudent != null
                  ? () {
                      context.read<StudentReviewBloc>().add(
                        const ConfirmStudentReviewEvent(),
                      );
                    }
                  : null, // Disable button when no student selected
              style:
                  AppButtonStyles.customRounded(
                    backgroundColor: state.selectedStudent != null
                        ? AppColors.selectionBlue
                        : AppColors.gray400,
                    foregroundColor: AppColors.white,
                    borderRadius: AppSpacing.borderRadius12px,
                  ).copyWith(
                    minimumSize: WidgetStateProperty.all(
                      const Size(double.infinity, 56),
                    ),
                  ),
              child: Text(
                state.selectedStudent != null
                    ? (l10n?.studentReviewContinueButton ?? 'Tiếp tục')
                    : 'Vui lòng chọn học sinh',
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.white,
                ),
              ),
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }
}
