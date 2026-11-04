import 'package:flutter/material.dart';

/// A reusable widget for displaying key-value pairs with consistent alignment
class DetailItem extends StatelessWidget {
  final String label;
  final Widget value;
  final EdgeInsetsGeometry? padding;
  final double? labelFontSize;
  final double? valueFontSize;
  final Color? labelColor;
  final Color? valueColor;

  const DetailItem({
    super.key,
    required this.label,
    required this.value,
    this.padding,
    this.labelFontSize,
    this.valueFontSize,
    this.labelColor,
    this.valueColor,
  });

  /// Factory constructor for text-only values
  factory DetailItem.text({
    Key? key,
    required String label,
    required String value,
    EdgeInsetsGeometry? padding,
    double? labelFontSize,
    double? valueFontSize,
    Color? labelColor,
    Color? valueColor,
  }) {
    return DetailItem(
      key: key,
      label: label,
      value: Text(
        value,
        style: TextStyle(
          fontSize: valueFontSize ?? 13,
          color: valueColor ?? Colors.black87,
        ),
        softWrap: true,
        overflow: TextOverflow.visible,
      ),
      padding: padding,
      labelFontSize: labelFontSize,
      labelColor: labelColor,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: labelFontSize ?? 11,
              color: labelColor ?? Colors.black54,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 3),
          // Wrap value in Align to ensure consistent baseline alignment
          Align(alignment: Alignment.centerLeft, child: value),
        ],
      ),
    );
  }
}
