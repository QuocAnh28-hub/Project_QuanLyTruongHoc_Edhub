import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Nhật ký Chuyên cần & Điểm danh dành cho Phụ huynh & Học sinh
class AttendanceHistoryPage extends StatefulWidget {
  final String? studentName;
  final String? className;

  const AttendanceHistoryPage({
    super.key,
    this.studentName,
    this.className,
  });

  @override
  State<AttendanceHistoryPage> createState() => _AttendanceHistoryPageState();
}

class _AttendanceHistoryPageState extends State<AttendanceHistoryPage> {
  int _selectedMonthIndex = 0; // 0: Tháng 11/2026, 1: Tháng 10/2026, 2: Tháng 9/2026

  final List<String> _months = ['Tháng 11/2026', 'Tháng 10/2026', 'Tháng 09/2026'];

  final List<Map<String, dynamic>> _attendanceRecords = [
    {
      'date': 'Hôm nay - Thứ Ba, 04/11/2026',
      'timeIn': '07:25',
      'timeOut': 'Đang trong giờ học',
      'status': 'PRESENT',
      'statusLabel': 'Có mặt đúng giờ',
      'method': 'Điểm danh thẻ NFC tại Cổng trường',
      'vehicle': 'Xe buýt trường tuyến số 08',
      'note': 'Học sinh tham gia đầy đủ các tiết học buổi sáng.',
    },
    {
      'date': 'Thứ Hai, 03/11/2026',
      'timeIn': '07:22',
      'timeOut': '16:45',
      'status': 'PRESENT',
      'statusLabel': 'Có mặt đúng giờ',
      'method': 'Điểm danh thẻ NFC tại Cổng trường',
      'vehicle': 'Phụ huynh tự đưa đón',
      'note': 'Hoàn thành ngày học đầy đủ.',
    },
    {
      'date': 'Thứ Sáu, 31/10/2026',
      'timeIn': '07:28',
      'timeOut': '16:40',
      'status': 'PRESENT',
      'statusLabel': 'Có mặt đúng giờ',
      'method': 'Điểm danh thẻ NFC tại Cổng trường',
      'vehicle': 'Xe buýt trường tuyến số 08',
      'note': '',
    },
    {
      'date': 'Thứ Năm, 30/10/2026',
      'timeIn': '07:42',
      'timeOut': '16:45',
      'status': 'LATE',
      'statusLabel': 'Đến muộn (12 phút)',
      'method': 'Điểm danh giáo viên tại lớp',
      'vehicle': 'Phụ huynh tự đưa đón',
      'note': 'Đoạn đường Nguyễn Trãi tắc nghẽn giao thông.',
    },
    {
      'date': 'Thứ Tư, 29/10/2026',
      'timeIn': '07:20',
      'timeOut': '16:35',
      'status': 'PRESENT',
      'statusLabel': 'Có mặt đúng giờ',
      'method': 'Điểm danh thẻ NFC tại Cổng trường',
      'vehicle': 'Xe buýt trường tuyến số 08',
      'note': '',
    },
    {
      'date': 'Thứ Ba, 28/10/2026',
      'timeIn': '-',
      'timeOut': '-',
      'status': 'EXCUSED_ABSENCE',
      'statusLabel': 'Nghỉ có phép',
      'method': 'Đơn xin nghỉ phép trực tuyến #NP-20261028-02',
      'vehicle': '-',
      'note': 'Lý do: Cảm sốt điều trị tại nhà (Đã được GVCN duyệt).',
    },
    {
      'date': 'Thứ Hai, 27/10/2026',
      'timeIn': '07:24',
      'timeOut': '16:40',
      'status': 'PRESENT',
      'statusLabel': 'Có mặt đúng giờ',
      'method': 'Điểm danh thẻ NFC tại Cổng trường',
      'vehicle': 'Phụ huynh tự đưa đón',
      'note': '',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final sName = widget.studentName ?? 'Trần Mỹ An';
    final cName = widget.className ?? '10A1';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Chuyên cần & Điểm danh',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          color: AppColors.textPrimary,
          onPressed: () => context.pop(),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4x),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student Overview Card
            Container(
              padding: const EdgeInsets.all(AppSpacing.space4x),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFF137333).withValues(alpha: 0.1),
                    child: const Icon(Icons.check_circle_outline, color: Color(0xFF137333)),
                  ),
                  const SizedBox(width: AppSpacing.space3x),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$sName • Lớp $cName',
                          style: AppTypography.titleSmall.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Trường THPT Nguyễn Siêu • Năm học 2026 - 2027',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.space4x),

            // 4 KPI Summary
            Row(
              children: [
                Expanded(
                  child: _buildMetricTile('Tỷ lệ chuyên cần', '98.2%', const Color(0xFF137333), Icons.pie_chart),
                ),
                const SizedBox(width: AppSpacing.space2x),
                Expanded(
                  child: _buildMetricTile('Có mặt đúng giờ', '42 ngày', const Color(0xFF1A73E8), Icons.verified),
                ),
                const SizedBox(width: AppSpacing.space2x),
                Expanded(
                  child: _buildMetricTile('Nghỉ có phép', '1 ngày', const Color(0xFFF2994A), Icons.assignment_turned_in),
                ),
                const SizedBox(width: AppSpacing.space2x),
                Expanded(
                  child: _buildMetricTile('Đi muộn', '1 lần', const Color(0xFFEA4335), Icons.alarm),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space4x),

            // Month Selector
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    'Nhật ký chi tiết',
                    style: AppTypography.titleSmall.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                DropdownButton<int>(
                  value: _selectedMonthIndex,
                  underline: const SizedBox(),
                  icon: const Icon(Icons.keyboard_arrow_down, size: 20),
                  items: List.generate(_months.length, (idx) {
                    return DropdownMenuItem(
                      value: idx,
                      child: Text(
                        _months[idx],
                        style: AppTypography.bodySmall.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    );
                  }),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedMonthIndex = val);
                  },
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space3x),

            // Attendance list
            ..._attendanceRecords.map((item) => _buildRecordCard(item)),

            const SizedBox(height: AppSpacing.space6x),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricTile(String title, String value, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(height: 4),
          Text(
            value,
            style: AppTypography.titleSmall.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              fontSize: 10,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildRecordCard(Map<String, dynamic> record) {
    final status = record['status'];
    Color badgeColor;
    if (status == 'PRESENT') {
      badgeColor = const Color(0xFF137333);
    } else if (status == 'LATE') {
      badgeColor = const Color(0xFFEA4335);
    } else {
      badgeColor = const Color(0xFF1A73E8);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.space3x),
      padding: const EdgeInsets.all(AppSpacing.space4x),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  record['date'],
                  style: AppTypography.bodyMedium.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: badgeColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  record['statusLabel'],
                  style: AppTypography.bodySmall.copyWith(
                    color: badgeColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: 16),
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    Icon(Icons.login_rounded, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        'Vào lớp: ${record['timeIn']}',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Row(
                  children: [
                    Icon(Icons.logout_rounded, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        'Tan học: ${record['timeOut']}',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Phương thức: ${record['method']}',
            style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
          ),
          if (record['vehicle'] != '-' && record['vehicle'] != '') ...[
            const SizedBox(height: 2),
            Text(
              'Phương tiện: ${record['vehicle']}',
              style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
            ),
          ],
          if (record['note'] != '') ...[
            const SizedBox(height: 4),
            Text(
              'Ghi chú: ${record['note']}',
              style: AppTypography.bodySmall.copyWith(
                color: const Color(0xFF8B4500),
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

