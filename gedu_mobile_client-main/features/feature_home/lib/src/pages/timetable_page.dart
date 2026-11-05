import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Thời khóa biểu Tuần dành cho Phụ huynh & Học sinh
class TimetablePage extends StatefulWidget {
  final String? studentName;
  final String? className;

  const TimetablePage({
    super.key,
    this.studentName,
    this.className,
  });

  @override
  State<TimetablePage> createState() => _TimetablePageState();
}

class _TimetablePageState extends State<TimetablePage> {
  int _selectedDayIndex = 0; // 0: Thứ 2, ..., 5: Thứ 7

  final List<String> _daysOfWeek = [
    'Thứ 2\n03/11',
    'Thứ 3\n04/11',
    'Thứ 4\n05/11',
    'Thứ 5\n06/11',
    'Thứ 6\n07/11',
    'Thứ 7\n08/11',
  ];

  // Schedule map by day
  final Map<int, List<Map<String, dynamic>>> _scheduleByDay = {
    0: [
      {
        'period': 'Tiết 1',
        'time': '07:30 - 08:15',
        'subject': 'Chào cờ & Sinh hoạt đầu tuần',
        'teacher': 'GVCN Nguyễn Kiều Oanh',
        'room': 'Sân trường',
        'color': Colors.redAccent,
        'status': 'finished',
      },
      {
        'period': 'Tiết 2',
        'time': '08:20 - 09:05',
        'subject': 'Toán học (Đại số & Giải tích)',
        'teacher': 'Cô Nguyễn Kiều Oanh',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.blue,
        'status': 'finished',
      },
      {
        'period': 'Tiết 3',
        'time': '09:15 - 10:00',
        'subject': 'Ngữ văn (Văn học hiện đại)',
        'teacher': 'Cô Lê Thị Thu',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.purple,
        'status': 'ongoing',
      },
      {
        'period': 'Tiết 4',
        'time': '10:10 - 10:55',
        'subject': 'Tiếng Anh (Unit 4: Learning Systems)',
        'teacher': 'Thầy Ngô Vĩnh Hy',
        'room': 'Phòng Ngoại ngữ Lab 1',
        'color': Colors.teal,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 5',
        'time': '11:00 - 11:45',
        'subject': 'Vật lí (Cơ học chất điểm)',
        'teacher': 'Thầy Nguyễn Văn Hùng',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.indigo,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 6 (Chiều)',
        'time': '14:00 - 14:45',
        'subject': 'Giáo dục thể chất (Bóng chuyền)',
        'teacher': 'Thầy Trịnh Mạnh Ninh',
        'room': 'Nhà đa năng',
        'color': Colors.orange,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 7 (Chiều)',
        'time': '15:00 - 15:45',
        'subject': 'Tin học thực hành (Lập trình Python)',
        'teacher': 'Thầy Lê Quang Minh',
        'room': 'Phòng máy tính 2',
        'color': Colors.cyan,
        'status': 'upcoming',
      },
    ],
    1: [
      {
        'period': 'Tiết 1',
        'time': '07:30 - 08:15',
        'subject': 'Hóa học (Bảng tuần hoàn các nguyên tố)',
        'teacher': 'Cô Vũ Hải Yến',
        'room': 'Phòng Thí nghiệm Hóa',
        'color': Colors.orange,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 2',
        'time': '08:20 - 09:05',
        'subject': 'Sinh học (Di truyền & Biến dị)',
        'teacher': 'Cô Nguyễn Thị Mai',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.green,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 3',
        'time': '09:15 - 10:00',
        'subject': 'Toán học (Hình học không gian)',
        'teacher': 'Cô Nguyễn Kiều Oanh',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.blue,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 4',
        'time': '10:10 - 10:55',
        'subject': 'Lịch sử (Kháng chiến chống ngoại xâm)',
        'teacher': 'Thầy Phạm Hải Đăng',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.deepOrange,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 5',
        'time': '11:00 - 11:45',
        'subject': 'Địa lí (Địa lí kinh tế - xã hội)',
        'teacher': 'Thầy Đỗ Quốc Cường',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.brown,
        'status': 'upcoming',
      },
    ],
    2: [
      {
        'period': 'Tiết 1',
        'time': '07:30 - 08:15',
        'subject': 'Tiếng Anh (Kỹ năng Speaking & Listening)',
        'teacher': 'Thầy Ngô Vĩnh Hy',
        'room': 'Phòng Ngoại ngữ Lab 1',
        'color': Colors.teal,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 2',
        'time': '08:20 - 09:05',
        'subject': 'Ngữ văn (Tập làm văn & Nghị luận xã hội)',
        'teacher': 'Cô Lê Thị Thu',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.purple,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 3',
        'time': '09:15 - 10:00',
        'subject': 'Vật lí (Nhiệt học & Thí nghiệm)',
        'teacher': 'Thầy Nguyễn Văn Hùng',
        'room': 'Phòng Thí nghiệm Vật lí',
        'color': Colors.indigo,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 4',
        'time': '10:10 - 10:55',
        'subject': 'Toán học (Luyện tập chuyên đề)',
        'teacher': 'Cô Nguyễn Kiều Oanh',
        'room': 'Phòng 201 - Dãy A',
        'color': Colors.blue,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 5',
        'time': '11:00 - 11:45',
        'subject': 'GDQP & An ninh',
        'teacher': 'Thầy Đặng Văn Nam',
        'room': 'Sân tập quân sự',
        'color': Colors.blueGrey,
        'status': 'upcoming',
      },
    ],
    3: [
      {
        'period': 'Tiết 1',
        'time': '07:30 - 08:15',
        'subject': 'Toán học',
        'teacher': 'Cô Nguyễn Kiều Oanh',
        'room': 'Phòng 201',
        'color': Colors.blue,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 2',
        'time': '08:20 - 09:05',
        'subject': 'Ngữ văn',
        'teacher': 'Cô Lê Thị Thu',
        'room': 'Phòng 201',
        'color': Colors.purple,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 3',
        'time': '09:15 - 10:00',
        'subject': 'Hóa học',
        'teacher': 'Cô Vũ Hải Yến',
        'room': 'Phòng 201',
        'color': Colors.orange,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 4',
        'time': '10:10 - 10:55',
        'subject': 'Sinh học',
        'teacher': 'Cô Nguyễn Thị Mai',
        'room': 'Phòng 201',
        'color': Colors.green,
        'status': 'upcoming',
      },
    ],
    4: [
      {
        'period': 'Tiết 1',
        'time': '07:30 - 08:15',
        'subject': 'Tiếng Anh',
        'teacher': 'Thầy Ngô Vĩnh Hy',
        'room': 'Lab 1',
        'color': Colors.teal,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 2',
        'time': '08:20 - 09:05',
        'subject': 'Vật lí',
        'teacher': 'Thầy Nguyễn Văn Hùng',
        'room': 'Phòng 201',
        'color': Colors.indigo,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 3',
        'time': '09:15 - 10:00',
        'subject': 'Lịch sử',
        'teacher': 'Thầy Phạm Hải Đăng',
        'room': 'Phòng 201',
        'color': Colors.deepOrange,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 4',
        'time': '10:10 - 10:55',
        'subject': 'Giáo dục công dân',
        'teacher': 'Cô Trần Thị Hồng',
        'room': 'Phòng 201',
        'color': Colors.pink,
        'status': 'upcoming',
      },
    ],
    5: [
      {
        'period': 'Tiết 1',
        'time': '07:30 - 08:15',
        'subject': 'Hoạt động trải nghiệm & STEM',
        'teacher': 'Ban Cố vấn Học tập',
        'room': 'Hội trường B',
        'color': Colors.purple,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 2',
        'time': '08:20 - 09:05',
        'subject': 'CLB Tiếng Anh & Hùng biện',
        'teacher': 'Thầy Ngô Vĩnh Hy',
        'room': 'Thư viện trường',
        'color': Colors.teal,
        'status': 'upcoming',
      },
      {
        'period': 'Tiết 3',
        'time': '09:15 - 10:00',
        'subject': 'Sinh hoạt lớp & Đánh giá tuần',
        'teacher': 'GVCN Nguyễn Kiều Oanh',
        'room': 'Phòng 201',
        'color': Colors.blue,
        'status': 'upcoming',
      },
    ],
  };

  @override
  Widget build(BuildContext context) {
    final currentLessons = _scheduleByDay[_selectedDayIndex] ?? [];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Thời khóa biểu',
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
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_month, color: AppColors.primary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Thời khóa biểu Học kỳ I - Năm học 2026-2027 đã cập nhật mới nhất!'),
                  backgroundColor: AppColors.primary,
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Header Day Picker
          _buildDaySelector(),

          // Schedule List
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(AppSpacing.space4x),
              children: [
                // Info summary row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Lịch học Lớp 10A1 • ${currentLessons.length} tiết',
                        style: AppTypography.titleSmall.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE8F0FE),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'Tuần 10 (03/11 - 08/11)',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.space3x),

                // Lessons cards
                if (currentLessons.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(32),
                    alignment: Alignment.center,
                    child: Column(
                      children: [
                        const Icon(Icons.beach_access, size: 48, color: Colors.amber),
                        const SizedBox(height: 12),
                        Text(
                          'Hôm nay không có tiết học. Học sinh tự học tại nhà.',
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  ...currentLessons.map((item) => _buildLessonItem(item)),

                const SizedBox(height: AppSpacing.space6x),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDaySelector() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(_daysOfWeek.length, (index) {
          final isSelected = _selectedDayIndex == index;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedDayIndex = index;
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? AppColors.primary
                      : Colors.black.withValues(alpha: 0.08),
                ),
              ),
              child: Text(
                _daysOfWeek[index],
                textAlign: TextAlign.center,
                style: AppTypography.bodySmall.copyWith(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  height: 1.3,
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildLessonItem(Map<String, dynamic> lesson) {
    final status = lesson['status'];
    Color badgeColor;
    String badgeText;

    if (status == 'ongoing') {
      badgeColor = const Color(0xFF1A73E8);
      badgeText = 'Đang diễn ra';
    } else if (status == 'finished') {
      badgeColor = const Color(0xFF137333);
      badgeText = 'Đã hoàn thành';
    } else {
      badgeColor = const Color(0xFF5F6368);
      badgeText = 'Sắp diễn ra';
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.space3x),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: status == 'ongoing'
              ? const Color(0xFF1A73E8).withValues(alpha: 0.5)
              : Colors.black.withValues(alpha: 0.06),
          width: status == 'ongoing' ? 1.5 : 1.0,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Left color bar
            Container(
              width: 5,
              decoration: BoxDecoration(
                color: lesson['color'] as Color,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14),
                  bottomLeft: Radius.circular(14),
                ),
              ),
            ),
            // Main content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.space4x),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            '${lesson['period']} • ${lesson['time']}',
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: badgeColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            badgeText,
                            style: AppTypography.bodySmall.copyWith(
                              color: badgeColor,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      lesson['subject'],
                      style: AppTypography.titleSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 12,
                      runSpacing: 4,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.person_outline, size: 16, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Text(
                              lesson['teacher'],
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.meeting_room_outlined, size: 16, color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Text(
                              lesson['room'],
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

