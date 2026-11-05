import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Sổ điểm Điện tử & Nhập điểm Bộ môn dành cho Giáo viên
class TeacherGradebookPage extends StatefulWidget {
  final String? className;
  final String? subjectName;

  const TeacherGradebookPage({
    super.key,
    this.className,
    this.subjectName,
  });

  @override
  State<TeacherGradebookPage> createState() => _TeacherGradebookPageState();
}

class _TeacherGradebookPageState extends State<TeacherGradebookPage> {
  int _selectedSemesterIndex = 0; // 0: Học kỳ 1, 1: Học kỳ 2
  bool _isLocked = false;
  final TextEditingController _searchController = TextEditingController();

  // Danh sách điểm số học sinh môn Toán lớp 10A1
  final List<Map<String, dynamic>> _gradeRows = [
    {
      'id': 'HS000601636',
      'name': 'Trần Mỹ An',
      'gender': 'Nữ',
      'tx1': 8.5,
      'tx2': 8.0,
      'tx3': 8.8,
      'tx4': 9.0,
      'mid': 8.5,
      'final': 9.0,
    },
    {
      'id': 'HS000601720',
      'name': 'Dương Phương Oanh',
      'gender': 'Nữ',
      'tx1': 7.5,
      'tx2': 8.0,
      'tx3': 7.8,
      'tx4': 8.2,
      'mid': 7.5,
      'final': 8.0,
    },
    {
      'id': 'HS000601723',
      'name': 'Trịnh Hoàng Long',
      'gender': 'Nam',
      'tx1': 8.0,
      'tx2': 8.5,
      'tx3': 8.0,
      'tx4': 8.2,
      'mid': 8.0,
      'final': 8.5,
    },
    {
      'id': 'HS000601726',
      'name': 'Ngô Phương Cúc',
      'gender': 'Nữ',
      'tx1': 8.0,
      'tx2': 8.2,
      'tx3': 8.0,
      'tx4': 8.5,
      'mid': 8.2,
      'final': 8.5,
    },
    {
      'id': 'HS000601729',
      'name': 'Đặng Quốc Thành',
      'gender': 'Nam',
      'tx1': 8.2,
      'tx2': 8.5,
      'tx3': 8.0,
      'tx4': 8.6,
      'mid': 8.5,
      'final': 8.5,
    },
    {
      'id': 'HS000601732',
      'name': 'Phan Gia Huy',
      'gender': 'Nam',
      'tx1': 8.0,
      'tx2': 8.5,
      'tx3': 8.2,
      'tx4': 8.4,
      'mid': 8.5,
      'final': 8.5,
    },
    {
      'id': 'HS000601735',
      'name': 'Nguyễn Đức Dũng',
      'gender': 'Nam',
      'tx1': 8.5,
      'tx2': 8.8,
      'tx3': 8.5,
      'tx4': 8.6,
      'mid': 8.5,
      'final': 8.8,
    },
    {
      'id': 'HS000601738',
      'name': 'Vũ Thanh Uyên',
      'gender': 'Nữ',
      'tx1': 8.5,
      'tx2': 9.0,
      'tx3': 8.8,
      'tx4': 8.6,
      'mid': 8.8,
      'final': 9.0,
    },
    {
      'id': 'HS000601741',
      'name': 'Hoàng Mai Oanh',
      'gender': 'Nữ',
      'tx1': 8.2,
      'tx2': 8.0,
      'tx3': 8.5,
      'tx4': 8.6,
      'mid': 8.4,
      'final': 8.5,
    },
    {
      'id': 'HS000601744',
      'name': 'Bùi Xuân Trung',
      'gender': 'Nam',
      'tx1': 7.8,
      'tx2': 8.2,
      'tx3': 8.0,
      'tx4': 8.2,
      'mid': 8.0,
      'final': 8.2,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // Tính điểm trung bình theo Thông tư 22/BGDĐT:
  // ĐTB = (TX1 + TX2 + TX3 + TX4 + GK*2 + CK*3) / 9
  double _calculateAvg(Map<String, dynamic> row) {
    final tx1 = (row['tx1'] as num?)?.toDouble() ?? 0.0;
    final tx2 = (row['tx2'] as num?)?.toDouble() ?? 0.0;
    final tx3 = (row['tx3'] as num?)?.toDouble() ?? 0.0;
    final tx4 = (row['tx4'] as num?)?.toDouble() ?? 0.0;
    final mid = (row['mid'] as num?)?.toDouble() ?? 0.0;
    final finalExam = (row['final'] as num?)?.toDouble() ?? 0.0;

    final sum = tx1 + tx2 + tx3 + tx4 + (mid * 2) + (finalExam * 3);
    final avg = sum / 9.0;
    return double.parse(avg.toStringAsFixed(1));
  }

  String _getRank(double avg) {
    if (avg >= 8.0) return 'Giỏi';
    if (avg >= 6.5) return 'Khá';
    if (avg >= 5.0) return 'Đạt';
    return 'Chưa đạt';
  }

  Color _getRankColor(String rank) {
    switch (rank) {
      case 'Giỏi':
        return AppColors.success;
      case 'Khá':
        return Colors.blue;
      case 'Đạt':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  List<Map<String, dynamic>> get _filteredRows {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) return _gradeRows;
    return _gradeRows.where((r) {
      final name = (r['name'] as String).toLowerCase();
      final id = (r['id'] as String).toLowerCase();
      return name.contains(query) || id.contains(query);
    }).toList();
  }

  void _showEditScoreDialog(Map<String, dynamic> student, String scoreKey, String scoreLabel) {
    if (_isLocked) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sổ điểm đã được khóa và ký số CA. Không thể chỉnh sửa!'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    final currentScore = (student[scoreKey] as num?)?.toDouble() ?? 0.0;
    final controller = TextEditingController(text: currentScore.toString());

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Nhập điểm: $scoreLabel'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Học sinh: ${student['name']} (${student['id']})'),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              autofocus: true,
              decoration: const InputDecoration(
                labelText: 'Điểm số (0.0 - 10.0)',
                border: OutlineInputBorder(),
                suffixText: 'điểm',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () {
              final newScore = double.tryParse(controller.text.trim());
              if (newScore == null || newScore < 0 || newScore > 10) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Điểm số phải từ 0.0 đến 10.0!'),
                    backgroundColor: Colors.red,
                  ),
                );
                return;
              }
              setState(() {
                student[scoreKey] = double.parse(newScore.toStringAsFixed(1));
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Đã cập nhật $scoreLabel của ${student['name']}: $newScore'),
                  backgroundColor: AppColors.success,
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Lưu điểm', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _lockAndSignGradebook() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.verified_user, color: AppColors.primary),
            SizedBox(width: 8),
            Expanded(child: Text('Ký số CA & Khóa sổ điểm')),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Thực hiện ký số điện tử và đóng băng bảng điểm môn Toán - Lớp 10A1 Học kỳ 1?',
              style: TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.purple.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.purple.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('• Người ký: Cô Nguyễn Kiều Oanh', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  Text('• Chức danh: Giáo viên Bộ môn Toán', style: TextStyle(fontSize: 12)),
                  Text('• Đơn vị: Trường THPT Nguyễn Siêu', style: TextStyle(fontSize: 12)),
                  Text('• Chứng thư số: Ban Cơ yếu Chính phủ', style: TextStyle(fontSize: 12)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Để sau'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _isLocked = true;
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Ký số CA thành công! Sổ điểm đã được khóa và lưu trữ bất biến.'),
                  backgroundColor: AppColors.success,
                  duration: Duration(seconds: 3),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Ký số & Khóa sổ', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final className = widget.className ?? '10A1';
    final subjectName = widget.subjectName ?? 'Toán học';

    double totalAvg = 0;
    for (var r in _gradeRows) {
      totalAvg += _calculateAvg(r);
    }
    final classAvg = double.parse((totalAvg / _gradeRows.length).toStringAsFixed(1));

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
            Text(
              'Sổ điểm: Môn $subjectName',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              'Lớp $className • THPT Nguyễn Siêu',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            tooltip: _isLocked ? 'Sổ điểm đã khóa' : 'Ký số CA & Khóa sổ',
            icon: Icon(
              _isLocked ? Icons.lock : Icons.lock_open,
              color: _isLocked ? AppColors.success : Colors.grey.shade700,
            ),
            onPressed: _isLocked
                ? () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Sổ điểm đã được ký số CA an toàn.')),
                    );
                  }
                : _lockAndSignGradebook,
          ),
        ],
      ),
      body: Column(
        children: [
          // Header summary bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              children: [
                // Semester Switcher
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: () => setState(() => _selectedSemesterIndex = 0),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: _selectedSemesterIndex == 0 ? AppColors.primary : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Học kỳ 1',
                            style: TextStyle(
                              color: _selectedSemesterIndex == 0 ? Colors.white : Colors.black87,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: InkWell(
                        onTap: () => setState(() => _selectedSemesterIndex = 1),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: _selectedSemesterIndex == 1 ? AppColors.primary : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Học kỳ 2',
                            style: TextStyle(
                              color: _selectedSemesterIndex == 1 ? Colors.white : Colors.black87,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Metrics summary
                Row(
                  children: [
                    _buildMetricCard('ĐTB Cả lớp', '$classAvg', Colors.blue),
                    const SizedBox(width: 8),
                    _buildMetricCard('Sĩ số môn', '${_gradeRows.length} HS', Colors.purple),
                    const SizedBox(width: 8),
                    _buildMetricCard('Tỷ lệ Giỏi', '70%', AppColors.success),
                    const SizedBox(width: 8),
                    _buildMetricCard('Trạng thái', _isLocked ? 'Đã ký số' : 'Mở nhập', _isLocked ? AppColors.success : Colors.orange),
                  ],
                ),
                const SizedBox(height: 10),

                // Search student
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Tìm học sinh theo tên hoặc mã số...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    filled: true,
                    fillColor: Colors.grey.shade100,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Grade Table
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _filteredRows.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final student = _filteredRows[index];
                return _buildStudentGradeCard(student, index + 1);
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Đang xuất bảng điểm Môn Toán ra file Excel/PDF...'),
                        backgroundColor: Colors.blue,
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  icon: const Icon(Icons.download, size: 18, color: Colors.blue),
                  label: const Text('Xuất Excel', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.blue),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton.icon(
                  onPressed: _isLocked ? null : _lockAndSignGradebook,
                  icon: Icon(_isLocked ? Icons.verified : Icons.verified_user_outlined, size: 20, color: Colors.white),
                  label: Text(
                    _isLocked ? 'Đã ký số CA' : 'Ký số & Đóng sổ điểm',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isLocked ? Colors.grey : AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                color: color.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentGradeCard(Map<String, dynamic> student, int order) {
    final avg = _calculateAvg(student);
    final rank = _getRank(avg);
    final rankColor = _getRankColor(rank);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
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
          // Top Row: Info & Avg
          Row(
            children: [
              CircleAvatar(
                radius: 12,
                backgroundColor: Colors.blue.shade50,
                child: Text('$order', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blue)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      student['name'] as String,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    Text(
                      '${student['id']} • Giới tính: ${student['gender']}',
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                    ),
                  ],
                ),
              ),
              // ĐTB Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: rankColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: rankColor.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    Text('ĐTB: ', style: TextStyle(fontSize: 11, color: rankColor, fontWeight: FontWeight.w600)),
                    Text(
                      '$avg',
                      style: TextStyle(fontSize: 14, color: rankColor, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                      decoration: BoxDecoration(
                        color: rankColor,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        rank,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Scores Row (TX1, TX2, TX3, TX4, GK, CK)
          Row(
            children: [
              _buildScoreBox(student, 'TX1', 'tx1'),
              const SizedBox(width: 4),
              _buildScoreBox(student, 'TX2', 'tx2'),
              const SizedBox(width: 4),
              _buildScoreBox(student, 'TX3', 'tx3'),
              const SizedBox(width: 4),
              _buildScoreBox(student, 'TX4', 'tx4'),
              const SizedBox(width: 4),
              _buildScoreBox(student, 'GK', 'mid', isKey: true),
              const SizedBox(width: 4),
              _buildScoreBox(student, 'CK', 'final', isKey: true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildScoreBox(
    Map<String, dynamic> student,
    String label,
    String key, {
    bool isKey = false,
  }) {
    final val = student[key] as num?;
    final scoreStr = val != null ? val.toString() : '-';

    return Expanded(
      child: InkWell(
        onTap: () => _showEditScoreDialog(student, key, label),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
          decoration: BoxDecoration(
            color: isKey ? Colors.purple.shade50 : Colors.grey.shade50,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
              color: isKey ? Colors.purple.shade200 : Colors.grey.shade300,
            ),
          ),
          child: Column(
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 9,
                  color: isKey ? Colors.purple.shade800 : Colors.grey.shade700,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                scoreStr,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: isKey ? Colors.purple.shade900 : Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

