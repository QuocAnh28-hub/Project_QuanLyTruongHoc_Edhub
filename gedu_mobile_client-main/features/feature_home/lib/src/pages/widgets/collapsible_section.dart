import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_localization/core_localization.dart';

class CollapsibleSection extends StatefulWidget {
  final String title;
  final SvgGenImage icon;
  final List<Widget> children;
  final bool defaultExpanded;
  final bool useListView;
  final EdgeInsets? contentPadding;

  const CollapsibleSection({
    super.key,
    required this.title,
    required this.icon,
    required this.children,
    this.defaultExpanded = false,
    this.useListView = false,
    this.contentPadding,
  });

  // Helper method to create info rows with dividers
  static List<Widget> buildInfoRows({
    required List<Map<String, String>> data,
    required AppLocalizations? l10n,
  }) {
    final List<Widget> rows = [];

    for (int i = 0; i < data.length; i++) {
      final item = data[i];
      rows.add(
        _buildInfoRow(label: item['label'] ?? '', value: item['value'] ?? '-'),
      );

      // Add divider between rows (but not after the last row)
      if (i < data.length - 1) {
        rows.add(_buildDivider());
      }
    }

    return rows;
  }

  static Widget _buildInfoRow({required String label, required String value}) {
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
                fontWeight: FontWeight.w500,
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

  static Widget _buildDivider() {
    return const Divider(height: 1, thickness: 1, color: AppColors.border);
  }

  @override
  State<CollapsibleSection> createState() => _CollapsibleSectionState();
}

class _CollapsibleSectionState extends State<CollapsibleSection> {
  late bool _isExpanded;

  @override
  void initState() {
    super.initState();
    _isExpanded = widget.defaultExpanded;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header section
        Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: const Color(0x00000000).withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          padding: const EdgeInsets.all(AppSpacing.space4x),
          child: InkWell(
            onTap: () {
              setState(() {
                _isExpanded = !_isExpanded;
              });
            },
            child: Row(
              children: [
                widget.icon.designSystemSvg(),
                const SizedBox(width: AppSpacing.space2x),
                Expanded(
                  child: Text(
                    widget.title,
                    style: AppTypography.bodyLarge.copyWith(
                      fontWeight: FontWeight.w600,
                      fontSize: FontConstants.xl,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                Icon(
                  _isExpanded
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  color: AppColors.textSecondary,
                  size: 24,
                ),
              ],
            ),
          ),
        ),

        // Content section
        if (_isExpanded) ...[
          const SizedBox(height: AppSpacing.space2x),
          if (widget.useListView)
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: widget.children.length,
              itemBuilder: (context, index) => Container(
                padding: const EdgeInsets.all(AppSpacing.space4x),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: const Color(0x00000000).withValues(alpha: 0.1),
                    width: 1,
                  ),
                ),
                child: widget.children[index],
              ),
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppSpacing.space2x),
            )
          else
            Container(
              padding: const EdgeInsets.all(AppSpacing.space4x),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: const Color(0x00000000).withOpacity(0.1),
                  width: 1,
                ),
              ),
              child: Column(children: widget.children),
            ),
        ],
      ],
    );
  }
}
