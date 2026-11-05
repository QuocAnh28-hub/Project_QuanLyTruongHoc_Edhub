import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';
import '../services/notification_service.dart';

/// Màn hình Điểm danh & Quản lý Sĩ số Lớp học dành cho Giáo viên chủ nhiệm & Bộ môn
class TeacherAttendancePage extends StatefulWidget {
  final String? className;
  final String? schoolName;

  const TeacherAttendancePage({
    super.key,
    this.className,
    this.schoolName,
  });

  @override
  State<TeacherAttendancePage> createState() => _TeacherAttendancePageState();
}

class _TeacherAttendancePageState extends State<TeacherAttendancePage> {
  DateTime _selectedDate = DateTime.now();
  String _selectedSession = 'Sáng'; // 'Sáng' | 'Chiều'
  String _filterStatus = 'all'; // 'all' | 'present' | 'absent_excused' | 'absent_unexcused' | 'late'
  final TextEditingController _searchController = TextEditingController();

  // Danh sách học sinh mẫu chuẩn thực tế Lớp 10A1 - THPT Nguyễn Siêu
  final List<Map<String, dynamic>> _students = [
    {
      'id': 'HS000601636',
      'name': 'Trần Mỹ An',
      'gender': 'Nữ',
      'status': 'absent_excused', // Có đơn xin phép
      'note': 'Nghỉ ốm sốt theo đơn phụ huynh đã duyệt',
      'checkInTime': null,
    },
    {
      'id': 'HS000601720',
      'name': 'Dương Phương Oanh',
      'gender': 'Nữ',
      'status': 'late',
      'note': 'Đến lớp lúc 7:40 (hỏng xe trên đường)',
      'checkInTime': '07:40',
    },
    {
      'id': 'HS000601723',
      'name': 'Trịnh Hoàng Long',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:15',
    },
    {
      'id': 'HS000601726',
      'name': 'Ngô Phương Cúc',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:22',
    },
    {
      'id': 'HS000601729',
      'name': 'Đặng Quốc Thành',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:20',
    },
    {
      'id': 'HS000601732',
      'name': 'Phan Gia Huy',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:18',
    },
    {
      'id': 'HS000601735',
      'name': 'Nguyễn Đức Dũng',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:25',
    },
    {
      'id': 'HS000601738',
      'name': 'Vũ Thanh Uyên',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:10',
    },
    {
      'id': 'HS000601741',
      'name': 'Hoàng Mai Oanh',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:28',
    },
    {
      'id': 'HS000601744',
      'name': 'Bùi Xuân Trung',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:29',
    },
    {
      'id': 'HS000601747',
      'name': 'Đinh Thu Hà',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:12',
    },
    {
      'id': 'HS000601750',
      'name': 'Lê Minh Khang',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:14',
    },
    {
      'id': 'HS000601753',
      'name': 'Phạm Bảo Ngọc',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:26',
    },
    {
      'id': 'HS000601756',
      'name': 'Trương Tuấn Kiệt',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:19',
    },
    {
      'id': 'HS000601759',
      'name': 'Võ Khánh Linh',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:23',
    },
    {
      'id': 'HS000601762',
      'name': 'Lý Hải Đăng',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:21',
    },
    {
      'id': 'HS000601765',
      'name': 'Nguyễn Hà My',
      'gender': 'Nữ',
      'status': 'present',
      'note': '',
      'checkInTime': '07:16',
    },
    {
      'id': 'HS000601768',
      'name': 'Đỗ Quốc Việt',
      'gender': 'Nam',
      'status': 'present',
      'note': '',
      'checkInTime': '07:24',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  int get _presentCount => _students.where((s) => s['status'] == 'present').length;
  int get _excusedCount => _students.where((s) => s['status'] == 'absent_excused').length;
  int get _unexcusedCount => _students.where((s) => s['status'] == 'absent_unexcused').length;
  int get _lateCount => _students.where((s) => s['status'] == 'late').length;

  List<Map<String, dynamic>> get _filteredStudents {
    final query = _searchController.text.trim().toLowerCase();
    return _students.where((student) {
      final name = (student['name'] as String).toLowerCase();
      final id = (student['id'] as String).toLowerCase();
      final matchesSearch = query.isEmpty || name.contains(query) || id.contains(query);

      if (!matchesSearch) return false;

      if (_filterStatus == 'all') return true;
      return student['status'] == _filterStatus;
    }).toList();
  }

  void _markAllPresent() {
    setState(() {
      for (var s in _students) {
        s['status'] = 'present';
        s['checkInTime'] ??= '07:30';
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã đánh dấu tất cả học sinh có mặt!'),
        backgroundColor: AppColors.success,
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showNoteDialog(Map<String, dynamic> student) {
    final textController = TextEditingController(text: student['note'] as String? ?? '');
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Ghi chú điểm danh: ${student['name']}'),
        content: TextField(
          controller: textController,
          maxLines: 3,
          decoration: const InputDecoration(
            hintText: 'Nhập lý do vắng, đi muộn hoặc dặn dò...',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                student['note'] = textController.text.trim();
              });
              Navigator.pop(ctx);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Lưu ghi chú', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _saveAndSyncAttendance() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.cloud_upload, color: AppColors.primary),
            SizedBox(width: 8),
            Expanded(child: Text('Đồng bộ Dữ liệu')),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Bạn có chắc chắn muốn lưu và đồng bộ kết quả điểm danh Lớp ${widget.className ?? "10A1"} ngày ${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year} buổi $_selectedSession lên CSDL Sở GD&ĐT?'),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('• Tổng số: ${_students.length} học sinh', style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text('• Có mặt: $_presentCount | Đi muộn: $_lateCount'),
                  Text('• Vắng có phép: $_excusedCount | Không phép: $_unexcusedCount'),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Kiểm tra lại'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              NotificationService.instance.notifyAttendance(
                studentName: 'Trần Mỹ An',
                className: '10A1',
                status: 'Có mặt đúng giờ',
                time: '07:25',
                context: context,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Đã đồng bộ dữ liệu điểm danh thành công về Sở GD&ĐT!'),
                  backgroundColor: AppColors.success,
                  duration: Duration(seconds: 3),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Xác nhận & Đồng bộ', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final className = widget.className ?? '10A1';
    final schoolName = widget.schoolName ?? 'THPT Nguyễn Siêu';

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
              'Điểm danh Sĩ số Lớp $className',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              '$schoolName • Năm học 2026-2027',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            tooltip: 'Đánh dấu tất cả có mặt',
            icon: const Icon(Icons.done_all, color: AppColors.success),
            onPressed: _markAllPresent,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Bar & Date Selector
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              children: [
                Row(
                  children: [
                    // Date picker button
                    Expanded(
                      flex: 3,
                      child: InkWell(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _selectedDate,
                            firstDate: DateTime(2026, 1, 1),
                            lastDate: DateTime(2027, 12, 31),
                          );
                          if (picked != null) {
                            setState(() => _selectedDate = picked);
                          }
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey.shade300),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.calendar_today, size: 16, color: AppColors.primary),
                              const SizedBox(width: 8),
                              Text(
                                '${_selectedDate.day.toString().padLeft(2, '0')}/${_selectedDate.month.toString().padLeft(2, '0')}/${_selectedDate.year}',
                                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Session selector
                    Expanded(
                      flex: 2,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedSession,
                            isExpanded: true,
                            items: const [
                              DropdownMenuItem(value: 'Sáng', child: Text('Buổi Sáng', style: TextStyle(fontSize: 13))),
                              DropdownMenuItem(value: 'Chiều', child: Text('Buổi Chiều', style: TextStyle(fontSize: 13))),
                            ],
                            onChanged: (val) {
                              if (val != null) setState(() => _selectedSession = val);
                            },
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                // Quick stats counters
                Row(
                  children: [
                    _buildStatCard('Sĩ số', '${_students.length}', Colors.blueGrey, 'all'),
                    const SizedBox(width: 6),
                    _buildStatCard('Có mặt', '$_presentCount', AppColors.success, 'present'),
                    const SizedBox(width: 6),
                    _buildStatCard('Có phép', '$_excusedCount', Colors.orange, 'absent_excused'),
                    const SizedBox(width: 6),
                    _buildStatCard('KP', '$_unexcusedCount', Colors.red, 'absent_unexcused'),
                    const SizedBox(width: 6),
                    _buildStatCard('Muộn', '$_lateCount', Colors.purple, 'late'),
                  ],
                ),
                const SizedBox(height: 10),
                // Search box
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Tìm theo họ tên hoặc mã học sinh...',
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

          // Students List
          Expanded(
            child: _filteredStudents.isEmpty
                ? const Center(
                    child: Text('Không tìm thấy học sinh phù hợp', style: TextStyle(color: Colors.grey)),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: _filteredStudents.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final student = _filteredStudents[index];
                      return _buildStudentRollCard(student, index + 1);
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
                  onPressed: _markAllPresent,
                  icon: const Icon(Icons.checklist, size: 18, color: AppColors.success),
                  label: const Text('Cả lớp Có mặt', style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.success),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton.icon(
                  onPressed: _saveAndSyncAttendance,
                  icon: const Icon(Icons.cloud_upload_outlined, size: 20, color: Colors.white),
                  label: const Text('Lưu & Đồng bộ về Sở', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color, String statusKey) {
    final isSelected = _filterStatus == statusKey;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _filterStatus = isSelected ? 'all' : statusKey;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? color.withValues(alpha: 0.2) : color.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? color : color.withValues(alpha: 0.3),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: color.withValues(alpha: 0.8),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStudentRollCard(Map<String, dynamic> student, int order) {
    final status = student['status'] as String;
    final isFemale = student['gender'] == 'Nữ';
    final hasNote = (student['note'] as String? ?? '').isNotEmpty;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: status == 'absent_unexcused'
              ? Colors.red.shade200
              : status == 'absent_excused'
                  ? Colors.orange.shade200
                  : status == 'late'
                      ? Colors.purple.shade200
                      : Colors.grey.shade200,
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
          Row(
            children: [
              // STT
              CircleAvatar(
                radius: 12,
                backgroundColor: Colors.grey.shade200,
                child: Text(
                  '$order',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                ),
              ),
              const SizedBox(width: 8),
              // Student Avatar
              CircleAvatar(
                radius: 18,
                backgroundColor: isFemale ? Colors.pink.shade50 : Colors.blue.shade50,
                child: Icon(
                  isFemale ? Icons.face_3 : Icons.face,
                  color: isFemale ? Colors.pink : Colors.blue,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              // Student Info
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
              // Note trigger button
              IconButton(
                icon: Icon(
                  hasNote ? Icons.chat_bubble : Icons.chat_bubble_outline,
                  color: hasNote ? AppColors.primary : Colors.grey,
                  size: 20,
                ),
                tooltip: 'Ghi chú',
                onPressed: () => _showNoteDialog(student),
              ),
            ],
          ),
          const SizedBox(height: 10),
          // Roll call segmented status buttons
          Row(
            children: [
              _buildStatusButton(student, 'Có mặt', 'present', AppColors.success, Icons.check),
              const SizedBox(width: 6),
              _buildStatusButton(student, 'Có phép', 'absent_excused', Colors.orange, Icons.mail_outline),
              const SizedBox(width: 6),
              _buildStatusButton(student, 'Không phép', 'absent_unexcused', Colors.red, Icons.close),
              const SizedBox(width: 6),
              _buildStatusButton(student, 'Muộn', 'late', Colors.purple, Icons.access_time),
            ],
          ),
          if (hasNote) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.amber.shade50,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: Colors.amber.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, size: 14, color: Colors.orange),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      student['note'] as String,
                      style: TextStyle(fontSize: 11, color: Colors.amber.shade900),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatusButton(
    Map<String, dynamic> student,
    String label,
    String targetStatus,
    Color color,
    IconData icon,
  ) {
    final isSelected = student['status'] == targetStatus;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            student['status'] = targetStatus;
            if (targetStatus == 'present' && student['checkInTime'] == null) {
              student['checkInTime'] = '07:30';
            }
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? color : color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: isSelected ? color : color.withValues(alpha: 0.3)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 12,
                color: isSelected ? Colors.white : color,
              ),
              const SizedBox(width: 3),
              Flexible(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.bold,
                    color: isSelected ? Colors.white : color,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

