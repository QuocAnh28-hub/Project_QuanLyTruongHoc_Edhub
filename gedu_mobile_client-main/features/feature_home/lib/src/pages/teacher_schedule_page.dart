import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Lịch Giảng dạy & Kế hoạch Bài dạy dành cho Giáo viên
class TeacherSchedulePage extends StatefulWidget {
  final String? teacherName;

  const TeacherSchedulePage({
    super.key,
    this.teacherName,
  });

  @override
  State<TeacherSchedulePage> createState() => _TeacherSchedulePageState();
}

class _TeacherSchedulePageState extends State<TeacherSchedulePage> {
  int _selectedDayIndex = 0; // 0: Thứ Hai -> 5: Thứ Bảy

  final List<String> _days = [
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];

  final Map<int, List<Map<String, dynamic>>> _schedulesByDay = {
    // Thứ Hai
    0: [
      {
        'period': 'Tiết 1',
        'time': '07:15 - 08:00',
        'subject': 'Sinh hoạt dưới cờ',
        'className': '10A1',
        'room': 'Sân trường Trung học',
        'topic': 'Chào cờ đầu tuần & Phổ biến phong trào thi đua 20/11',
        'status': 'finished',
        'notes': 'Có mặt trước 7:10 để ổn định hàng lối lớp 10A1.',
      },
      {
        'period': 'Tiết 2',
        'time': '08:05 - 08:50',
        'subject': 'Toán học (Đại số 10)',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Bài 12: Hàm số bậc hai và đồ thị (Tiết 1: Định nghĩa & Khảo sát)',
        'status': 'in_progress',
        'notes': 'Yêu cầu học sinh chuẩn bị thước kẻ parabol và máy tính Casio.',
        'lessonPlanId': 'KHBD-TOAN-10A1-P12',
      },
      {
        'period': 'Tiết 4',
        'time': '09:55 - 10:40',
        'subject': 'Toán học (Đại số 10)',
        'className': '10A3',
        'room': 'Phòng 203 - Dãy A',
        'topic': 'Luyện tập: Dấu của tam thức bậc hai & Bất phương trình bậc hai',
        'status': 'upcoming',
        'notes': 'Chấm bài kiểm tra 15 phút đầu giờ.',
        'lessonPlanId': 'KHBD-TOAN-10A3-LT02',
      },
      {
        'period': 'Tiết 6 (Chiều)',
        'time': '14:00 - 15:30',
        'subject': 'Bồi dưỡng Đội tuyển HSG Toán',
        'className': 'Khối 10',
        'room': 'Phòng Hội đồng 102',
        'topic': 'Chuyên đề: Bất đẳng thức Cauchy-Schwarz và ứng dụng tìm Cực trị',
        'status': 'upcoming',
        'notes': '15 học sinh xuất sắc lớp 10A1, 10A2, 10A3.',
        'lessonPlanId': 'KHBD-HSG-CHUYEN-DE-01',
      },
    ],
    // Thứ Ba
    1: [
      {
        'period': 'Tiết 2',
        'time': '08:05 - 08:50',
        'subject': 'Toán học (Hình học 10)',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Bài 7: Các hệ thức lượng trong tam giác và giải tam giác',
        'status': 'upcoming',
        'notes': 'Sử dụng phần mềm Geogebra trình chiếu.',
      },
      {
        'period': 'Tiết 3',
        'time': '08:55 - 09:40',
        'subject': 'Toán học (Hình học 10)',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Bài 7: Các hệ thức lượng trong tam giác (Luyện tập tính bán kính R, r)',
        'status': 'upcoming',
        'notes': 'Làm bài tập sách bài tập trang 45.',
      },
      {
        'period': 'Tiết 5',
        'time': '10:45 - 11:30',
        'subject': 'Toán học',
        'className': '10A3',
        'room': 'Phòng 203 - Dãy A',
        'topic': 'Hàm số bậc hai và đồ thị',
        'status': 'upcoming',
        'notes': '',
      },
    ],
    // Thứ Tư
    2: [
      {
        'period': 'Tiết 1',
        'time': '07:15 - 08:00',
        'subject': 'Toán học',
        'className': '10A3',
        'room': 'Phòng 203 - Dãy A',
        'topic': 'Bài tập tổng hợp chương Hàm số',
        'status': 'upcoming',
        'notes': '',
      },
      {
        'period': 'Tiết 3 & 4',
        'time': '08:55 - 10:40',
        'subject': 'Sinh hoạt Chuyên môn',
        'className': 'Tổ Toán - Tin',
        'room': 'Phòng Hội đồng Trường',
        'topic': 'Họp Tổ bộ môn: Thống nhất ma trận đề kiểm tra Cuối học kỳ 1',
        'status': 'upcoming',
        'notes': 'Mang theo tài liệu ma trận đề và đặc tả câu hỏi.',
      },
    ],
    // Thứ Năm
    3: [
      {
        'period': 'Tiết 2',
        'time': '08:05 - 08:50',
        'subject': 'Toán học (Đại số 10)',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Phương trình quy về phương trình bậc hai',
        'status': 'upcoming',
        'notes': '',
      },
      {
        'period': 'Tiết 4',
        'time': '09:55 - 10:40',
        'subject': 'Toán học',
        'className': '10A3',
        'room': 'Phòng 203 - Dãy A',
        'topic': 'Giải toán bằng máy tính cầm tay',
        'status': 'upcoming',
        'notes': '',
      },
    ],
    // Thứ Sáu
    4: [
      {
        'period': 'Tiết 1',
        'time': '07:15 - 08:00',
        'subject': 'Toán học',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Kiểm tra 45 phút định kỳ môn Toán',
        'status': 'upcoming',
        'notes': 'Nhận đề niêm phong tại phòng Khảo thí.',
      },
      {
        'period': 'Tiết 3',
        'time': '08:55 - 09:40',
        'subject': 'Toán học',
        'className': '10A3',
        'room': 'Phòng 203 - Dãy A',
        'topic': 'Hình học: Tích vô hướng của hai vectơ',
        'status': 'upcoming',
        'notes': '',
      },
    ],
    // Thứ Bảy
    5: [
      {
        'period': 'Tiết 2',
        'time': '08:05 - 08:50',
        'subject': 'Toán học',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Chữa bài kiểm tra định kỳ & Đánh giá mức độ nhận thức',
        'status': 'upcoming',
        'notes': 'Cập nhật điểm vào Sổ điểm điện tử.',
      },
      {
        'period': 'Tiết 5',
        'time': '10:45 - 11:30',
        'subject': 'Sinh hoạt Lớp Cuối tuần',
        'className': '10A1',
        'room': 'Phòng 201 - Dãy A',
        'topic': 'Tổng kết nền nếp tuần & Khen thưởng các cá nhân tiêu biểu',
        'status': 'upcoming',
        'notes': 'Công bố xếp loại thi đua của trường.',
      },
    ],
  };

  void _showLessonPlanModal(Map<String, dynamic> item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.75,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.menu_book, color: AppColors.primary, size: 24),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Kế hoạch Bài dạy (Giáo án Điện tử)',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const Divider(),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Chủ đề: ${item['topic']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    const SizedBox(height: 6),
                    Text('Lớp: ${item['className']} • Môn: ${item['subject']}', style: TextStyle(color: Colors.grey.shade700, fontSize: 13)),
                    const SizedBox(height: 12),
                    _buildLessonSection('1. Mục tiêu bài học:', '• Nắm vững dạng tổng quát hàm số bậc hai y = ax² + bx + c (a ≠ 0).\n• Xác định được tọa độ đỉnh, trục đối xứng, khoảng đồng biến và nghịch biến.\n• Rèn luyện kỹ năng vẽ đồ thị Parabol và ứng dụng giải bài toán thực tế.'),
                    const SizedBox(height: 10),
                    _buildLessonSection('2. Thiết bị dạy học & Học liệu số:', '• Máy chiếu thông minh, giáo án điện tử PowerPoint.\n• Phần mềm mô phỏng đồ thị Geogebra 6.0.\n• Phiếu học tập số 1 và số 2 giao về ứng dụng EduHub.'),
                    const SizedBox(height: 10),
                    _buildLessonSection('3. Tiến trình dạy học:', '• Hoạt động 1: Khởi động - Bài toán quỹ đạo ném bóng rổ (7 phút).\n• Hoạt động 2: Hình thành kiến thức mới về bảng biến thiên (18 phút).\n• Hoạt động 3: Luyện tập vẽ đồ thị theo nhóm 4 em (15 phút).\n• Hoạt động 4: Vận dụng & giao nhiệm vụ về nhà (5 phút).'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Đã tải xuống file Kế hoạch bài dạy PDF chuẩn CV 5512/BGDĐT!'),
                      backgroundColor: AppColors.success,
                    ),
                  );
                },
                icon: const Icon(Icons.download, color: Colors.white, size: 18),
                label: const Text('Tải xuống Kế hoạch bài dạy (PDF)', style: TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLessonSection(String title, String content) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.primary)),
          const SizedBox(height: 4),
          Text(content, style: const TextStyle(fontSize: 12, height: 1.4)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentSchedule = _schedulesByDay[_selectedDayIndex] ?? [];
    final teacher = widget.teacherName ?? 'Cô Nguyễn Kiều Oanh';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Lịch Giảng dạy & Kế hoạch Bài dạy',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              '$teacher • Tổ Toán - Tin',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: Column(
        children: [
          // Day Selector Tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: List.generate(_days.length, (index) {
                  final isSelected = _selectedDayIndex == index;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: InkWell(
                      onTap: () => setState(() => _selectedDayIndex = index),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSelected ? AppColors.primary : Colors.grey.shade300,
                          ),
                        ),
                        child: Text(
                          _days[index],
                          style: TextStyle(
                            color: isSelected ? Colors.white : Colors.black87,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),

          // Daily summary banner
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.purple.shade700, Colors.deepPurple.shade900],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.school, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Kế hoạch giảng dạy ${_days[_selectedDayIndex]}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tổng số: ${currentSchedule.length} tiết giảng dạy • Sĩ số: 38 học sinh/lớp',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Schedule list
          Expanded(
            child: currentSchedule.isEmpty
                ? const Center(
                    child: Text('Không có tiết dạy vào ngày này', style: TextStyle(color: Colors.grey)),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    itemCount: currentSchedule.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = currentSchedule[index];
                      return _buildScheduleSlotCard(item);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleSlotCard(Map<String, dynamic> item) {
    final status = item['status'] as String;
    final isFinished = status == 'finished';
    final isInProgress = status == 'in_progress';

    Color statusColor;
    String statusText;
    if (isFinished) {
      statusColor = Colors.grey;
      statusText = 'Đã hoàn thành';
    } else if (isInProgress) {
      statusColor = AppColors.success;
      statusText = 'Đang diễn ra';
    } else {
      statusColor = AppColors.primary;
      statusText = 'Sắp tới';
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isInProgress ? AppColors.success : Colors.grey.shade200,
          width: isInProgress ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Period, Time & Status
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  item['period'] as String,
                  style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
              const SizedBox(width: 8),
              Icon(Icons.access_time, size: 14, color: Colors.grey.shade600),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  item['time'] as String,
                  style: TextStyle(color: Colors.grey.shade700, fontSize: 12, fontWeight: FontWeight.w500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  statusText,
                  style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Subject & Class
          Row(
            children: [
              Expanded(
                child: Text(
                  item['subject'] as String,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.purple.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.purple.shade200),
                ),
                child: Text(
                  'Lớp ${item['className']}',
                  style: TextStyle(color: Colors.purple.shade800, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Room
          Row(
            children: [
              const Icon(Icons.location_on_outlined, size: 15, color: Colors.grey),
              const SizedBox(width: 4),
              Text(
                item['room'] as String,
                style: TextStyle(color: Colors.grey.shade700, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Topic / Lesson
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Nội dung bài dạy:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blueGrey)),
                const SizedBox(height: 3),
                Text(
                  item['topic'] as String,
                  style: const TextStyle(fontSize: 12, height: 1.3, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),

          // Action buttons
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _showLessonPlanModal(item),
                  icon: const Icon(Icons.article_outlined, size: 16, color: AppColors.primary),
                  label: const Text('Xem Giáo án', style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    context.push('/teacher-attendance');
                  },
                  icon: const Icon(Icons.how_to_reg, size: 16, color: Colors.white),
                  label: const Text('Điểm danh tiết', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

