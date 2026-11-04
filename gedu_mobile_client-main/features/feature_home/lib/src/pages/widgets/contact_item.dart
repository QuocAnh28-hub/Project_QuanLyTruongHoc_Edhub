import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_students/core_students.dart';
import 'package:core_localization/core_localization.dart';

import '../../utils/utils.dart';

class ContactItem extends StatelessWidget {
  final StudentContactModel contact;
  final StudentModel student;
  final AppLocalizations? l10n;

  const ContactItem({
    super.key,
    required this.contact,
    required this.student,
    required this.l10n,
  });

  @override
  Widget build(BuildContext context) {
    final isPrimaryContact = _isPrimaryContact();

    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Contact Header
          Row(
            children: [
              // Profile Picture
              CircleAvatar(
                radius: 24,
                backgroundColor: AppColors.primary.withOpacity(0.1),
                child: Text(
                  contact.fullName.substring(0, 1).toUpperCase(),
                  style: AppTypography.bodyLarge.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space2x),
              // Name and Primary Contact Tag
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      contact.fullName,
                      style: AppTypography.bodyLarge.copyWith(
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (isPrimaryContact) ...[
                      const SizedBox(height: AppSpacing.space1x),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.space2x,
                          vertical: AppSpacing.space1x,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFEAF3),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: const Color(0xFFFF3086),
                            width: 1,
                          ),
                        ),
                        child: Text(
                          l10n?.primaryContactTag ?? 'Người liên hệ chính',
                          style: AppTypography.bodySmall.copyWith(
                            color: const Color(0xFFFF3086),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space3x),

          // Contact Details
          _buildContactDetail(
            label:
                l10n?.relationshipToStudentLabel ?? 'Mối quan hệ với học sinh',
            value: contact.relationshipTitle ?? '-',
          ),
          _buildDivider(),
          _buildContactDetail(
            label: l10n?.yearOfBirthLabel ?? 'Năm sinh',
            value: contact.yearOfBirth?.toString() ?? '-',
          ),
          _buildDivider(),
          _buildContactDetail(
            label: l10n?.occupationLabel ?? 'Nghề nghiệp',
            value: contact.occupation ?? '-',
          ),
          _buildDivider(),
          _buildContactDetail(
            label: l10n?.phoneNumberLabel ?? 'Số điện thoại',
            value: contact.phone ?? '-',
          ),
          if (contact.email?.isNotEmpty == true) ...[
            _buildDivider(),
            _buildContactDetail(label: 'Email', value: contact.email!),
          ],
        ],
      ),
    );
  }

  Widget _buildContactDetail({required String label, required String value}) {
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

  bool _isPrimaryContact() {
    // If there's only one contact, it's primary
    if (student.studentContacts.length == 1) {
      return true;
    }

    // If this contact matches the main contact in student model
    if (student.mainContactId != null && contact.id == student.mainContactId) {
      return true;
    }

    return false;
  }
}
