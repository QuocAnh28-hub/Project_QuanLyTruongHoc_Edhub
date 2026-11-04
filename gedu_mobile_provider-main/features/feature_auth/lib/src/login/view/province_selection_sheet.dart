import 'package:core_localization/core_localization.dart';
import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Bottom sheet for province selection
class ProvinceSelectionSheet extends StatefulWidget {
  const ProvinceSelectionSheet({
    super.key,
    required this.onProvinceSelected,
    this.selectedProvince,
  });

  final Function(String) onProvinceSelected;
  final String? selectedProvince;

  @override
  State<ProvinceSelectionSheet> createState() => _ProvinceSelectionSheetState();
}

class _ProvinceSelectionSheetState extends State<ProvinceSelectionSheet> {
  final TextEditingController _searchController = TextEditingController();
  List<String> _filteredProvinces = [];
  String? _currentSelectedProvince;
  final List<String> _allProvinces = ['An Giang', 'Đà Nẵng'];

  @override
  void initState() {
    super.initState();
    _currentSelectedProvince = widget.selectedProvince;
    _filteredProvinces = List.from(_allProvinces);
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void didUpdateWidget(ProvinceSelectionSheet oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedProvince != widget.selectedProvince) {
      setState(() {
        _currentSelectedProvince = widget.selectedProvince;
      });
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    setState(() {
      if (_searchController.text.isEmpty) {
        _filteredProvinces = List.from(_allProvinces);
      } else {
        _filteredProvinces = _allProvinces
            .where(
              (province) => province.toLowerCase().contains(
                _searchController.text.toLowerCase(),
              ),
            )
            .toList();
      }
    });
  }

  void _onProvinceSelected(String province) {
    setState(() {
      _currentSelectedProvince = province;
    });
    widget.onProvinceSelected(province);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: ColorConstants.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16),
          topRight: Radius.circular(16),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.textSecondary.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text(
              AppLocalizations.of(context)?.provinceSelectionTitle ??
                  'Chọn Tỉnh/Thành phố',
              style: AppTypography.headlineMedium.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),

          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: Material3TextField(
              controller: _searchController,
              labelText:
                  AppLocalizations.of(context)?.provinceSearchLabel ??
                  'Tìm kiếm',
              hintText:
                  AppLocalizations.of(context)?.provinceSearchHint ??
                  'Tìm kiếm',
              suffixIcon: const Icon(
                Icons.search,
                color: AppColors.textSecondary,
              ),
            ),
          ),

          // Category header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Text(
                  'TẤT CẢ',
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          // Province list
          Flexible(
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: _filteredProvinces.length,
              itemBuilder: (context, index) {
                final province = _filteredProvinces[index];
                final isSelected = province == _currentSelectedProvince;

                return Column(
                  children: [
                    ListTile(
                      title: Text(
                        province,
                        style: AppTypography.bodyLarge.copyWith(
                          color: isSelected
                              ? ColorConstants.focusBlue
                              : AppColors.textPrimary,
                          fontWeight: isSelected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                      trailing: isSelected
                          ? Icon(
                              Icons.check,
                              color: ColorConstants.focusBlue,
                              size: 20,
                            )
                          : null,
                      onTap: () => _onProvinceSelected(province),
                    ),
                    if (index < _filteredProvinces.length - 1)
                      const Divider(
                        height: 1,
                        color: AppColors.border,
                        indent: 16,
                        endIndent: 16,
                      ),
                  ],
                );
              },
            ),
          ),

          // Bottom padding for safe area
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
