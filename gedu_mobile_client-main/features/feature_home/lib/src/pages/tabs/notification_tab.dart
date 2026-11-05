import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Notification Tab - Trung tâm thông báo nhà trường đa năng
class NotificationTab extends StatefulWidget {
  const NotificationTab({super.key});

  @override
  State<NotificationTab> createState() => _NotificationTabState();
}

class _NotificationTabState extends State<NotificationTab> {
  int _selectedFilter = 0; // 0: Tất cả, 1: Học vụ, 2: Học phí, 3: Hoạt động

  final List<String> _filters = [
    'Tất cả',
    'Học vụ & Lịch thi',
    'Học phí & Thu chi',
    'Hoạt động ngoại khóa',
  ];

  final List<Map<String, dynamic>> _notifications = [
    {
      'id': 'NOTIF-01',
      'category': 'FINANCE',
      'categoryLabel': 'Học phí & Thu chi',
      'title': 'Thông báo Đợt thu Học phí & Dịch vụ bán trú Tháng 11/2026',
      'desc': 'Kính gửi Quý Phụ huynh học sinh Trần Mỹ An (Lớp 10A1), nhà trường kính gửi thông báo số tiền cần thanh toán cho kỳ học Tháng 11/2026. Số tiền: 1.850.000 VNĐ. Thời hạn thanh toán: Trước ngày 15/11/2026.',
      'time': '10 phút trước',
      'isRead': false,
      'color': Colors.pink,
      'icon': Icons.receipt_long,
      'amount': '1.850.000 VNĐ',
      'dueDate': '15/11/2026',
    },
    {
      'id': 'NOTIF-02',
      'category': 'ACADEMIC',
      'categoryLabel': 'Học vụ & Lịch thi',
      'title': 'Kế hoạch Kiểm tra Đánh giá Định kỳ Giữa Học kỳ I (2026 - 2027)',
      'desc': 'Lịch kiểm tra tập trung giữa học kỳ I cho toàn bộ học sinh Khối 10 sẽ bắt đầu từ Thứ Hai (10/11/2026) đến Thứ Bảy (15/11/2026). Phụ huynh vui lòng theo dõi và nhắc nhở học sinh ôn tập đúng đề cương.',
      'time': 'Hôm qua, 14:30',
      'isRead': false,
      'color': Colors.blue,
      'icon': Icons.assignment,
      'amount': null,
      'dueDate': '10/11 - 15/11/2026',
    },
    {
      'id': 'NOTIF-03',
      'category': 'ACADEMIC',
      'categoryLabel': 'Học vụ & Lịch thi',
      'title': 'Mời họp Phụ huynh Học sinh Học kỳ I Năm học 2026 - 2027',
      'desc': 'Trân trọng kính mời Quý Phụ huynh tới tham dự buổi họp Ban đại diện cha mẹ học sinh và Họp phụ huynh toàn trường vào hồi 08:30 Chủ nhật ngày 09/11/2026 tại Phòng học 201.',
      'time': '02/11/2026',
      'isRead': true,
      'color': Colors.orange,
      'icon': Icons.groups_outlined,
      'amount': null,
      'dueDate': '09/11/2026',
    },
    {
      'id': 'NOTIF-04',
      'category': 'ACTIVITY',
      'categoryLabel': 'Hoạt động ngoại khóa',
      'title': 'Kế hoạch Hoạt động Trải nghiệm Thực tế & Giáo dục STEM Khối 10',
      'desc': 'Đoàn trường tổ chức chương trình học tập trải nghiệm thực tế tại Bảo tàng Lịch sử Quốc gia và Khu Công nghệ cao Hòa Lạc vào Thứ Sáu (20/11/2026). Đề nghị phụ huynh gửi phiếu đăng ký tham gia.',
      'time': '28/10/2026',
      'isRead': true,
      'color': Colors.purple,
      'icon': Icons.science_outlined,
      'amount': null,
      'dueDate': '20/11/2026',
    },
    {
      'id': 'NOTIF-05',
      'category': 'FINANCE',
      'categoryLabel': 'Học phí & Thu chi',
      'title': 'Biên lai Điện tử Xác nhận đã Thanh toán Tiền ăn & Bán trú Tháng 10',
      'desc': 'Nhà trường đã ghi nhận giao dịch thanh toán thành công số tiền 1.650.000 VNĐ qua cổng thanh toán QR-Code MoMo/VNPay. Mã biên lai điện tử: BL-202610-10928.',
      'time': '10/10/2026',
      'isRead': true,
      'color': Colors.green,
      'icon': Icons.check_circle_outline,
      'amount': '1.650.000 VNĐ',
      'dueDate': 'Đã hoàn thành',
    },
  ];

  void _markAllAsRead() {
    setState(() {
      for (final n in _notifications) {
        n['isRead'] = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã đánh dấu tất cả thông báo là đã đọc!'),
        backgroundColor: AppColors.success,
      ),
    );
  }

  void _showNotificationDetail(Map<String, dynamic> notif) {
    setState(() {
      notif['isRead'] = true;
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(AppSpacing.space6x),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.space4x),

              // Category tag
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: (notif['color'] as Color).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  notif['categoryLabel'],
                  style: AppTypography.bodySmall.copyWith(
                    color: notif['color'] as Color,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Title
              Text(
                notif['title'],
                style: AppTypography.titleMedium.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),

              // Time
              Row(
                children: [
                  const Icon(Icons.access_time, size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: 4),
                  Text(
                    notif['time'],
                    style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
                  ),
                ],
              ),
              const Divider(height: 24),

              // Description
              Text(
                notif['desc'],
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textPrimary,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 16),

              if (notif['amount'] != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7E7),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.orange.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Số tiền thanh toán:',
                          style: AppTypography.bodyMedium,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        notif['amount'],
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFFD93025),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Close / Action Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Đã hiểu & Đóng', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Filter notifications
    final filtered = _notifications.where((n) {
      if (_selectedFilter == 0) return true;
      if (_selectedFilter == 1) return n['category'] == 'ACADEMIC';
      if (_selectedFilter == 2) return n['category'] == 'FINANCE';
      if (_selectedFilter == 3) return n['category'] == 'ACTIVITY';
      return true;
    }).toList();

    final unreadCount = _notifications.where((n) => !n['isRead']).length;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Thông báo ($unreadCount chưa đọc)',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all, color: AppColors.primary),
            tooltip: 'Đánh dấu tất cả đã đọc',
            onPressed: _markAllAsRead,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter horizontal list
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: List.generate(_filters.length, (index) {
                  final isSelected = _selectedFilter == index;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      selected: isSelected,
                      label: Text(
                        _filters[index],
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 12,
                        ),
                      ),
                      backgroundColor: const Color(0xFFF1F3F4),
                      selectedColor: AppColors.primary,
                      checkmarkColor: Colors.white,
                      onSelected: (_) {
                        setState(() => _selectedFilter = index);
                      },
                    ),
                  );
                }),
              ),
            ),
          ),

          // Notifications list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(AppSpacing.space4x),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final notif = filtered[index];
                final isRead = notif['isRead'] as bool;

                return GestureDetector(
                  onTap: () => _showNotificationDetail(notif),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: AppSpacing.space3x),
                    padding: const EdgeInsets.all(AppSpacing.space4x),
                    decoration: BoxDecoration(
                      color: isRead ? Colors.white : const Color(0xFFF4F8FE),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: isRead
                            ? Colors.black.withValues(alpha: 0.06)
                            : AppColors.primary.withValues(alpha: 0.3),
                        width: isRead ? 1 : 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Notification icon
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: (notif['color'] as Color).withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(22),
                          ),
                          child: Icon(
                            notif['icon'] as IconData,
                            color: notif['color'] as Color,
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.space3x),

                        // Notification details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      notif['categoryLabel'],
                                      style: AppTypography.bodySmall.copyWith(
                                        color: notif['color'] as Color,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 11,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Row(
                                    children: [
                                      Text(
                                        notif['time'],
                                        style: AppTypography.bodySmall.copyWith(
                                          color: AppColors.textSecondary,
                                          fontSize: 10,
                                        ),
                                      ),
                                      if (!isRead) ...[
                                        const SizedBox(width: 6),
                                        Container(
                                          width: 8,
                                          height: 8,
                                          decoration: const BoxDecoration(
                                            color: AppColors.primary,
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                notif['title'],
                                style: AppTypography.bodyMedium.copyWith(
                                  fontWeight: isRead ? FontWeight.w600 : FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                notif['desc'],
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                  height: 1.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
