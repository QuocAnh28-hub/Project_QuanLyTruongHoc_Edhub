import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:core_localization/core_localization.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';
import 'package:feature_home/feature_home.dart';

class HealthInformationForm extends StatefulWidget {
  const HealthInformationForm({
    super.key,
    this.student,
    this.onSaved,
    required this.refId,
    required this.studentId,
  });

  final StudentModel? student;
  final VoidCallback? onSaved;
  final String refId;
  final int studentId;

  @override
  State<HealthInformationForm> createState() => _HealthInformationFormState();
}

class _HealthInformationFormState extends State<HealthInformationForm> {
  // Health information states
  bool _hasFoodAllergies = false;
  bool _hasDrugAllergies = false;
  bool _hasChronicDiseases = false;
  bool _hasAdditionalNotes = false;

  // Text controllers
  final TextEditingController _foodAllergiesController =
      TextEditingController();
  final TextEditingController _drugAllergiesController =
      TextEditingController();
  final TextEditingController _chronicDiseasesController =
      TextEditingController();
  final TextEditingController _additionalNotesController =
      TextEditingController();

  // Focus nodes
  final FocusNode _foodFocusNode = FocusNode();
  final FocusNode _drugFocusNode = FocusNode();
  final FocusNode _chronicFocusNode = FocusNode();
  final FocusNode _noteFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    // Load existing data if available
    _loadExistingData();
    // Initialize with "không..." text for No selections
    _updateTextFields();
  }

  @override
  void dispose() {
    _foodAllergiesController.dispose();
    _drugAllergiesController.dispose();
    _chronicDiseasesController.dispose();
    _additionalNotesController.dispose();
    _foodFocusNode.dispose();
    _drugFocusNode.dispose();
    _chronicFocusNode.dispose();
    _noteFocusNode.dispose();
    super.dispose();
  }

  void _loadExistingData() {
    if (widget.student != null) {
      final student = widget.student!;

      // Load food allergies
      final foodAllergyInfo = student.studentMedicalInfo
          .where(
            (info) => info.typeEnum == StudentMedicalInfoTypeEnum.foodAllergy,
          )
          .firstOrNull;
      if (foodAllergyInfo?.description != null &&
          foodAllergyInfo!.description!.isNotEmpty) {
        _hasFoodAllergies = true;
        _foodAllergiesController.text = foodAllergyInfo.description!;
      }

      // Load drug allergies
      final drugAllergyInfo = student.studentMedicalInfo
          .where(
            (info) => info.typeEnum == StudentMedicalInfoTypeEnum.drugAllergy,
          )
          .firstOrNull;
      if (drugAllergyInfo?.description != null &&
          drugAllergyInfo!.description!.isNotEmpty) {
        _hasDrugAllergies = true;
        _drugAllergiesController.text = drugAllergyInfo.description!;
      }

      // Load chronic diseases
      final chronicDiseaseInfo = student.studentMedicalInfo
          .where(
            (info) =>
                info.typeEnum == StudentMedicalInfoTypeEnum.chronicOrUnderlying,
          )
          .firstOrNull;
      if (chronicDiseaseInfo?.description != null &&
          chronicDiseaseInfo!.description!.isNotEmpty) {
        _hasChronicDiseases = true;
        _chronicDiseasesController.text = chronicDiseaseInfo.description!;
      }

      // Load additional notes
      final additionalNotesInfo = student.studentMedicalInfo
          .where(
            (info) => info.typeEnum == StudentMedicalInfoTypeEnum.undetermined,
          )
          .firstOrNull;
      if (additionalNotesInfo?.description != null &&
          additionalNotesInfo!.description!.isNotEmpty) {
        _hasAdditionalNotes = true;
        _additionalNotesController.text = additionalNotesInfo.description!;
      }
    }
  }

  void _updateTextFields() {
    if (!_hasFoodAllergies) {
      _foodAllergiesController.text = 'Không dị ứng thực phẩm';
    }
    if (!_hasDrugAllergies) {
      _drugAllergiesController.text = 'Không dị ứng thuốc';
    }
    if (!_hasChronicDiseases) {
      _chronicDiseasesController.text = 'Không mắc bệnh mãn tính';
    }
    if (!_hasAdditionalNotes) {
      _additionalNotesController.text = 'Không có ghi chú đặc biệt';
    }
  }

  void _saveHealthInformation() {
    // Collect form data and create medical info list
    final List<StudentMedicalInfoRequest> medicalList = [];

    // Add food allergies if enabled
    if (_hasFoodAllergies && _foodAllergiesController.text.isNotEmpty) {
      medicalList.add(
        StudentMedicalInfoRequest(
          group: StudentMedicalInfoTypeEnum
              .foodAllergy
              .group
              .value, // Allergy group
          type:
              StudentMedicalInfoTypeEnum.foodAllergy.value, // Food allergy type
          info: _foodAllergiesController.text,
        ),
      );
    }

    // Add drug allergies if enabled
    if (_hasDrugAllergies && _drugAllergiesController.text.isNotEmpty) {
      medicalList.add(
        StudentMedicalInfoRequest(
          group: StudentMedicalInfoTypeEnum
              .drugAllergy
              .group
              .value, // Allergy group
          type: StudentMedicalInfoTypeEnum
              .drugAllergy
              .value, //// Drug allergy type
          info: _drugAllergiesController.text,
        ),
      );
    }

    // Add chronic diseases if enabled
    if (_hasChronicDiseases && _chronicDiseasesController.text.isNotEmpty) {
      medicalList.add(
        StudentMedicalInfoRequest(
          group: StudentMedicalInfoTypeEnum
              .chronicOrUnderlying
              .group
              .value, // Allergy group
          type: StudentMedicalInfoTypeEnum
              .chronicOrUnderlying
              .value, //// Chronic disease type
          info: _chronicDiseasesController.text,
        ),
      );
    }

    // Add additional notes if enabled
    if (_hasAdditionalNotes && _additionalNotesController.text.isNotEmpty) {
      medicalList.add(
        StudentMedicalInfoRequest(
          group: StudentMedicalInfoTypeEnum
              .undetermined
              .group
              .value, // Allergy group
          type:
              StudentMedicalInfoTypeEnum.undetermined.value, //Undetermined type
          info: _additionalNotesController.text,
        ),
      );
    }

    // Dispatch the update event
    context.read<HealthInformationFormBloc>().add(
      SubmitHealthInformationFormEvent(
        refId: widget.refId,
        studentId: widget.studentId,
        medicalList: medicalList,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<HealthInformationFormBloc, HealthInformationFormState>(
      listener: (context, state) {
        if (state is HealthInformationFormSuccess) {
          // Show success message and close form
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Thông tin sức khỏe đã được cập nhật thành công!'),
              backgroundColor: AppColors.success,
            ),
          );

          if (widget.onSaved != null) {
            widget.onSaved!();
          }
          Navigator.of(context).pop();
        } else if (state is HealthInformationFormError) {
          // Show error message
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Lỗi: ${state.message}'),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      child: BlocBuilder<HealthInformationFormBloc, HealthInformationFormState>(
        builder: (context, state) {
          final bottomInset = MediaQuery.of(context).viewInsets.bottom;
          return AnimatedPadding(
            duration: const Duration(milliseconds: 150),
            curve: Curves.easeOut,
            padding: EdgeInsets.only(bottom: bottomInset),
            child: Container(
              decoration: const BoxDecoration(
                color: AppColors.white,
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
                    margin: const EdgeInsets.only(top: AppSpacing.space2x),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppColors.gray300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),

                  // Header
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.space4x),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          'Cập nhật thông tin sức khỏe',
                          style: AppTypography.titleMedium.copyWith(
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Form content
                  Flexible(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.space4x,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Food Allergies Section
                          _buildHealthSection(
                            title:
                                'Học sinh có bị dị ứng với loại thực phẩm nào không?',
                            hasCondition: _hasFoodAllergies,
                            onConditionChanged: (value) {
                              setState(() {
                                _hasFoodAllergies = value;
                                if (!value) {
                                  _foodAllergiesController.text =
                                      'Không dị ứng thực phẩm';
                                  _foodFocusNode.unfocus();
                                } else {
                                  _foodAllergiesController.text = '';
                                  _foodFocusNode.requestFocus();
                                }
                              });
                            },
                            controller: _foodAllergiesController,
                            hintText: 'Dị ứng thực phẩm',
                            enabled: _hasFoodAllergies,
                            focusNode: _foodFocusNode,
                          ),

                          const SizedBox(height: AppSpacing.space4x),

                          // Drug Allergies Section
                          _buildHealthSection(
                            title:
                                'Học sinh có bị dị ứng với loại thuốc nào không?',
                            hasCondition: _hasDrugAllergies,
                            onConditionChanged: (value) {
                              setState(() {
                                _hasDrugAllergies = value;
                                if (!value) {
                                  _drugAllergiesController.text =
                                      'Không dị ứng thuốc';
                                  _drugFocusNode.unfocus();
                                } else {
                                  _drugAllergiesController.text = '';
                                  _drugFocusNode.requestFocus();
                                }
                              });
                            },
                            controller: _drugAllergiesController,
                            hintText: 'Dị ứng thuốc',
                            enabled: _hasDrugAllergies,
                            focusNode: _drugFocusNode,
                          ),

                          const SizedBox(height: AppSpacing.space4x),

                          // Chronic Diseases Section
                          _buildHealthSection(
                            title:
                                'Học sinh có bị mắc bệnh mãn tính/bệnh nào không?',
                            hasCondition: _hasChronicDiseases,
                            onConditionChanged: (value) {
                              setState(() {
                                _hasChronicDiseases = value;
                                if (!value) {
                                  _chronicDiseasesController.text =
                                      'Không mắc bệnh mãn tính';
                                  _chronicFocusNode.unfocus();
                                } else {
                                  _chronicDiseasesController.text = '';
                                  _chronicFocusNode.requestFocus();
                                }
                              });
                            },
                            controller: _chronicDiseasesController,
                            hintText: 'Bệnh mãn tính/bệnh nền',
                            enabled: _hasChronicDiseases,
                            focusNode: _chronicFocusNode,
                          ),

                          const SizedBox(height: AppSpacing.space4x),

                          // Additional Notes Section
                          _buildHealthSection(
                            title: 'Có ghi chú thêm nào cần lưu ý không?',
                            hasCondition: _hasAdditionalNotes,
                            onConditionChanged: (value) {
                              setState(() {
                                _hasAdditionalNotes = value;
                                if (!value) {
                                  _additionalNotesController.text =
                                      'Không có ghi chú đặc biệt';
                                  _noteFocusNode.unfocus();
                                } else {
                                  _additionalNotesController.text = '';
                                  _noteFocusNode.requestFocus();
                                }
                              });
                            },
                            controller: _additionalNotesController,
                            hintText:
                                'Ghi chú thêm (Đặc điểm hoặc thói quen đặc biệt cần lưu ý)',
                            enabled: _hasAdditionalNotes,
                            focusNode: _noteFocusNode,
                          ),

                          const SizedBox(height: AppSpacing.space6x),
                        ],
                      ),
                    ),
                  ),

                  // Save button
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.space4x),
                    child: SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: state is HealthInformationFormSubmitting
                            ? null
                            : () {
                                // Collect form data and save
                                _saveHealthInformation();
                              },
                        style: AppButtonStyles.primary.copyWith(
                          padding: WidgetStateProperty.all(
                            const EdgeInsets.symmetric(
                              vertical: AppSpacing.space4x,
                            ),
                          ),
                        ),
                        icon: state is HealthInformationFormSubmitting
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
                            : const Icon(Icons.save, size: 20),
                        label: Text(
                          state is HealthInformationFormSubmitting
                              ? 'Đang lưu...'
                              : 'Lưu thay đổi',
                          style: AppTypography.bodyLarge.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    height:
                        AppSpacing.space3x +
                        MediaQuery.of(context).padding.bottom,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHealthSection({
    required String title,
    required bool hasCondition,
    required ValueChanged<bool> onConditionChanged,
    required TextEditingController controller,
    required String hintText,
    required bool enabled,
    FocusNode? focusNode,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Title and toggle buttons in the same row
        Row(
          children: [
            // Title (expanded to take available space)
            Expanded(
              child: Text(
                title,
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.space2x),

            // Toggle buttons
            Row(
              children: [
                _buildToggleButton(
                  isSelected: hasCondition,
                  onTap: () => onConditionChanged(true),
                  icon: Icons.check,
                  color: AppColors.primary,
                ),
                const SizedBox(width: AppSpacing.space2x),
                _buildToggleButton(
                  isSelected: !hasCondition,
                  onTap: () => onConditionChanged(false),
                  icon: Icons.close,
                  color: AppColors.primary,
                ),
              ],
            ),
          ],
        ),

        const SizedBox(height: AppSpacing.space3x),

        // Text field - only show when condition is true
        if (hasCondition)
          Material3TextField(
            controller: controller,
            labelText: hintText,
            hintText: hintText,
            enabled: enabled,
            maxLines: 3,
            focusNode: focusNode,
          ),
      ],
    );
  }

  Widget _buildToggleButton({
    required bool isSelected,
    required VoidCallback onTap,
    required IconData icon,
    required Color color,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.space2x),
        decoration: BoxDecoration(
          color: isSelected ? color : AppColors.white,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color : AppColors.border,
            width: 1,
          ),
        ),
        child: Icon(
          icon,
          color: isSelected ? AppColors.white : AppColors.black,
          size: 20,
        ),
      ),
    );
  }
}
