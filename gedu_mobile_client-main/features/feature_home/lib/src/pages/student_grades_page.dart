import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Tra cứu Bảng điểm & Kết quả Học tập dành cho Phụ huynh & Học sinh
class StudentGradesPage extends StatefulWidget {
  final String? studentName;
  final String? className;

  const StudentGradesPage({
    super.key,
    this.studentName,
    this.className,
  });

  @override
  State<StudentGradesPage> createState() => _StudentGradesPageState();
}

class _StudentGradesPageState extends State<StudentGradesPage> {
  int _selectedSemesterIndex = 0; // 0: Học kỳ 1, 1: Học kỳ 2, 2: Cả năm

  final List<Map<String, dynamic>> _subjects = [
    {
      'name': 'Toán học',
      'teacher': 'Cô Nguyễn Kiều Oanh',
      'avg': 8.7,
      'tx1': 8.5,
      'tx2': 8.0,
      'tx3': 8.8,
      'tx4': 9.0,
      'mid': 8.5,
      'final': 9.0,
      'color': Colors.blue,
      'gradeType': 'scored',
    },
    {
      'name': 'Ngữ văn',
      'teacher': 'Cô Lê Thị Thu',
      'avg': 8.0,
      'tx1': 7.5,
      'tx2': 7.8,
      'tx3': 8.0,
      'tx4': 8.2,
      'mid': 8.0,
      'final': 8.3,
      'color': Colors.purple,
      'gradeType': 'scored',
    },
    {
      'name': 'Tiếng Anh (Ngoại ngữ 1)',
      'teacher': 'Thầy Ngô Vĩnh Hy',
      'avg': 9.2,
      'tx1': 9.0,
      'tx2': 9.5,
      'tx3': 9.0,
      'tx4': 9.2,
      'mid': 9.0,
      'final': 9.4,
      'color': Colors.teal,
      'gradeType': 'scored',
    },
    {
      'name': 'Vật lí',
      'teacher': 'Thầy Nguyễn Văn Hùng',
      'avg': 8.7,
      'tx1': 8.5,
      'tx2': 8.0,
      'tx3': 8.7,
      'tx4': 8.5,
      'mid': 8.8,
      'final': 9.0,
      'color': Colors.indigo,
      'gradeType': 'scored',
    },
    {
      'name': 'Hóa học',
      'teacher': 'Cô Vũ Hải Yến',
      'avg': 8.4,
      'tx1': 8.0,
      'tx2': 8.3,
      'tx3': 8.2,
      'tx4': 8.5,
      'mid': 8.5,
      'final': 8.6,
      'color': Colors.orange,
      'gradeType': 'scored',
    },
    {
      'name': 'Sinh học',
      'teacher': 'Cô Nguyễn Thị Mai',
      'avg': 8.7,
      'tx1': 8.5,
      'tx2': 8.5,
      'tx3': 8.8,
      'tx4': 8.7,
      'mid': 8.5,
      'final': 8.8,
      'color': Colors.green,
      'gradeType': 'scored',
    },
    {
      'name': 'Lịch sử',
      'teacher': 'Thầy Phạm Hải Đăng',
      'avg': 8.3,
      'tx1': 8.0,
      'tx2': 8.2,
      'tx3': 8.5,
      'tx4': 8.0,
      'mid': 8.3,
      'final': 8.5,
      'color': Colors.deepOrange,
      'gradeType': 'scored',
    },
    {
      'name': 'Địa lí',
      'teacher': 'Thầy Đỗ Quốc Cường',
      'avg': 8.5,
      'tx1': 8.2,
      'tx2': 8.5,
      'tx3': 8.0,
      'tx4': 8.5,
      'mid': 8.5,
      'final': 8.7,
      'color': Colors.brown,
      'gradeType': 'scored',
    },
    {
      'name': 'Tin học',
      'teacher': 'Thầy Lê Quang Minh',
      'avg': 9.5,
      'tx1': 9.5,
      'tx2': 9.0,
      'tx3': 9.5,
      'tx4': 9.2,
      'mid': 9.5,
      'final': 9.6,
      'color': Colors.cyan,
      'gradeType': 'scored',
    },
    {
      'name': 'GDQP & An ninh',
      'teacher': 'Thầy Đặng Văn Nam',
      'avg': 'Đạt',
      'tx1': 'Đ',
      'tx2': 'Đ',
      'tx3': 'Đ',
      'tx4': 'Đ',
      'mid': 'Đ',
      'final': 'Đ',
      'color': Colors.blueGrey,
      'gradeType': 'evaluated',
    },
    {
      'name': 'Giáo dục thể chất',
      'teacher': 'Thầy Trịnh Mạnh Ninh',
      'avg': 'Đạt',
      'tx1': 'Đ',
      'tx2': 'Đ',
      'tx3': 'Đ',
      'tx4': 'Đ',
      'mid': 'Đ',
      'final': 'Đ',
      'color': Colors.redAccent,
      'gradeType': 'evaluated',
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
          'Bảng điểm & Kết quả',
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
            icon: const Icon(Icons.share_outlined, color: AppColors.primary),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Đã xuất file bảng điểm PDF có chữ ký số điện tử!'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4x),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student Overview Card
            _buildStudentBanner(sName, cName),
            const SizedBox(height: AppSpacing.space4x),

            // 4 KPI Summary Cards
            _buildKpiMetrics(),
            const SizedBox(height: AppSpacing.space4x),

            // Semester Switcher
            _buildSemesterSwitcher(),
            const SizedBox(height: AppSpacing.space4x),

            // Section Title
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    'Chi tiết môn học (${_subjects.length} môn)',
                    style: AppTypography.titleMedium.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'Chuẩn GDPT 2018',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.space3x),

            // Subject Cards List
            ..._subjects.map((sub) => _buildSubjectCard(sub)),
            const SizedBox(height: AppSpacing.space4x),

            // Teacher Evaluation Card
            _buildTeacherRemarkCard(),
            const SizedBox(height: AppSpacing.space6x),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentBanner(String name, String className) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.space4x),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A73E8), Color(0xFF0D47A1)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1A73E8).withValues(alpha: 0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.white.withValues(alpha: 0.25),
            child: Text(
              name.isNotEmpty ? name[0] : 'A',
              style: AppTypography.headlineMedium.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.space4x),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTypography.titleLarge.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Lớp: $className • Năm học 2026 - 2027',
                  style: AppTypography.bodyMedium.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Mã học sinh: HS20260012 • THPT Nguyễn Siêu',
                  style: AppTypography.bodySmall.copyWith(
                    color: Colors.white.withValues(alpha: 0.75),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKpiMetrics() {
    return Row(
      children: [
        Expanded(
          child: _buildMetricTile(
            title: 'ĐTB Chung',
            value: '8.5',
            color: const Color(0xFF137333),
            icon: Icons.auto_graph,
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildMetricTile(
            title: 'Học lực',
            value: 'Giỏi',
            color: const Color(0xFF1A73E8),
            icon: Icons.military_tech,
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildMetricTile(
            title: 'Hạnh kiểm',
            value: 'Tốt',
            color: const Color(0xFFF2994A),
            icon: Icons.thumb_up_alt_outlined,
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildMetricTile(
            title: 'Xếp hạng',
            value: '3/35',
            color: const Color(0xFF9333EA),
            icon: Icons.emoji_events_outlined,
          ),
        ),
      ],
    );
  }

  Widget _buildMetricTile({
    required String title,
    required String value,
    required Color color,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 6),
          Text(
            value,
            style: AppTypography.titleMedium.copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              fontSize: 11,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSemesterSwitcher() {
    final tabs = ['Học kỳ 1', 'Học kỳ 2', 'Cả năm'];

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F3F4),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: List.generate(tabs.length, (index) {
          final isSelected = _selectedSemesterIndex == index;
          return Expanded(
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedSemesterIndex = index;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? Colors.white : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.08),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ]
                      : null,
                ),
                child: Text(
                  tabs[index],
                  textAlign: TextAlign.center,
                  style: AppTypography.bodyMedium.copyWith(
                    color: isSelected ? AppColors.primary : AppColors.textSecondary,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  ),
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget _buildSubjectCard(Map<String, dynamic> subject) {
    final avg = subject['avg'];
    final isEvaluated = subject['gradeType'] == 'evaluated';

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.space3x),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ExpansionTile(
        shape: Border.all(color: Colors.transparent),
        collapsedShape: Border.all(color: Colors.transparent),
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: (subject['color'] as Color).withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            Icons.menu_book,
            color: subject['color'] as Color,
            size: 22,
          ),
        ),
        title: Text(
          subject['name'],
          style: AppTypography.titleSmall.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          subject['teacher'],
          style: AppTypography.bodySmall.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: isEvaluated
                ? const Color(0xFFE6F4EA)
                : (avg >= 8.0
                    ? const Color(0xFFE6F4EA)
                    : const Color(0xFFFEF7E0)),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isEvaluated
                  ? const Color(0xFF137333).withValues(alpha: 0.3)
                  : (avg >= 8.0
                      ? const Color(0xFF137333).withValues(alpha: 0.3)
                      : const Color(0xFFF2994A).withValues(alpha: 0.3)),
            ),
          ),
          child: Text(
            isEvaluated ? '$avg' : 'ĐTB $avg',
            style: AppTypography.titleSmall.copyWith(
              color: isEvaluated
                  ? const Color(0xFF137333)
                  : (avg >= 8.0
                      ? const Color(0xFF137333)
                      : const Color(0xFFB06000)),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Divider(height: 1),
                const SizedBox(height: 12),
                Text(
                  'Chi tiết điểm thành phần:',
                  style: AppTypography.bodySmall.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: _buildScorePill('TX 1', '${subject['tx1']}')),
                    const SizedBox(width: 4),
                    Expanded(child: _buildScorePill('TX 2', '${subject['tx2']}')),
                    const SizedBox(width: 4),
                    Expanded(child: _buildScorePill('TX 3', '${subject['tx3']}')),
                    const SizedBox(width: 4),
                    Expanded(child: _buildScorePill('TX 4', '${subject['tx4']}')),
                    const SizedBox(width: 4),
                    Expanded(child: _buildScorePill('Giữa kỳ', '${subject['mid']}', isHighlight: true)),
                    const SizedBox(width: 4),
                    Expanded(child: _buildScorePill('Cuối kỳ', '${subject['final']}', isHighlight: true)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScorePill(String label, String value, {bool isHighlight = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
      decoration: BoxDecoration(
        color: isHighlight
            ? const Color(0xFFE8F0FE)
            : const Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isHighlight
              ? const Color(0xFF1A73E8).withValues(alpha: 0.3)
              : Colors.black.withValues(alpha: 0.06),
        ),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: AppTypography.bodySmall.copyWith(
              fontSize: 10,
              color: isHighlight ? AppColors.primary : AppColors.textSecondary,
              fontWeight: isHighlight ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: AppTypography.titleSmall.copyWith(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: isHighlight ? AppColors.primary : AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeacherRemarkCard() {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.space4x),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7E7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF2994A).withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.mode_comment_outlined, color: Color(0xFFF2994A), size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Nhận xét của Giáo viên Chủ nhiệm (Cô Nguyễn Kiều Oanh)',
                  style: AppTypography.titleSmall.copyWith(
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF8B4500),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Học sinh Trần Mỹ An có ý thức học tập rất tốt, chú ý nghe giảng và hăng hái phát biểu xây dựng bài. Hoàn thành xuất sắc các bài tập được giao, hòa đồng thân thiện với bạn bè. Gia đình tiếp tục duy trì và động viên em phát huy tinh thần tự học.',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              'Cập nhật ngày: 04/11/2026',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

