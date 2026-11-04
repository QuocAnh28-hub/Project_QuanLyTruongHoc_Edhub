import 'package:core_localization/core_localization.dart';
import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';
import 'widgets/student_card.dart';

/// Bottom sheet for selecting a student
class StudentSelectionSheet extends StatelessWidget {
  const StudentSelectionSheet({
    required this.students,
    required this.currentStudent,
    required this.onStudentSelected,
    super.key,
  });

  final List<StudentModel> students;
  final StudentModel? currentStudent;
  final Function(StudentModel) onStudentSelected;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle bar
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 16),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.gray300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Title
          Padding(
            padding: AppSpacing.all(AppSpacing.space4x),
            child: Text(
              AppLocalizations.of(context)?.studentSelectionTitle ??
                  'Select Student',
              style: AppTypography.titleLarge.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          // Student list
          Flexible(
            child: ListView.builder(
              shrinkWrap: true,
              padding: AppSpacing.all(AppSpacing.space4x),
              itemCount: students.length,
              itemBuilder: (context, index) {
                final student = students[index];
                final isSelected = currentStudent?.code == student.code;

                return StudentCard(
                  student: student,
                  isSelected: isSelected,
                  showDisplayName: true,
                  onTap: () => _selectStudent(context, student),
                );
              },
            ),
          ),
          // Bottom padding for safe area
          SizedBox(height: MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  void _selectStudent(BuildContext context, StudentModel student) {
    // Close the bottom sheet
    Navigator.of(context).pop();

    // Call the callback to let parent handle the business logic
    onStudentSelected(student);
  }
}
