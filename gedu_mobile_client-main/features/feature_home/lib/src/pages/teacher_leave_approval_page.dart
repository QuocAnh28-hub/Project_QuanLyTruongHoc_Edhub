import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';
import '../services/notification_service.dart';

/// Màn hình Xét duyệt Đơn xin Nghỉ phép dành cho Giáo viên chủ nhiệm
class TeacherLeaveApprovalPage extends StatefulWidget {
  final String? className;

  const TeacherLeaveApprovalPage({
    super.key,
    this.className,
  });

  @override
  State<TeacherLeaveApprovalPage> createState() => _TeacherLeaveApprovalPageState();
}

class _TeacherLeaveApprovalPageState extends State<TeacherLeaveApprovalPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Dữ liệu mẫu đơn xin nghỉ phép gửi đến GVCN Lớp 10A1
  final List<Map<String, dynamic>> _leaveRequests = [
    {
      'id': 'LR-2026-001',
      'studentName': 'Trần Mỹ An',
      'studentId': 'HS000601636',
      'className': '10A1',
      'parentName': 'Nguyễn Thị Lan (Mẹ)',
      'parentPhone': '0912345678',
      'leaveType': 'Nghỉ ốm sốt',
      'startDate': '06/11/2026',
      'endDate': '07/11/2026',
      'daysCount': 2,
      'createdAt': '05/11/2026 07:15',
      'reason': 'Cháu Mỹ An bị sốt siêu vi từ tối qua, bác sĩ phòng khám yêu cầu nghỉ ngơi và theo dõi tại nhà 2 ngày. Gia đình xin phép Cô cho cháu nghỉ học và sẽ hướng dẫn cháu tự ôn bài.',
      'status': 'pending', // 'pending' | 'approved' | 'rejected'
      'teacherNote': '',
      'reviewedAt': null,
    },
    {
      'id': 'LR-2026-002',
      'studentName': 'Hoàng Mai Oanh',
      'studentId': 'HS000601741',
      'className': '10A1',
      'parentName': 'Hoàng Văn Minh (Bố)',
      'parentPhone': '0987654321',
      'leaveType': 'Việc gia đình',
      'startDate': '02/11/2026',
      'endDate': '02/11/2026',
      'daysCount': 1,
      'createdAt': '01/11/2026 20:30',
      'reason': 'Gia đình có việc hiếu ở quê, xin phép Cô cho em Oanh nghỉ học ngày thứ Hai. Em cam kết chép bài và làm bài tập đầy đủ.',
      'status': 'approved',
      'teacherNote': 'Cô đồng ý cho em Oanh nghỉ việc riêng. Nhớ xem lại bài học tam thức bậc hai môn Toán.',
      'reviewedAt': '02/11/2026 06:40',
    },
    {
      'id': 'LR-2026-003',
      'studentName': 'Trịnh Hoàng Long',
      'studentId': 'HS000601723',
      'className': '10A1',
      'parentName': 'Trịnh Quốc Bảo (Bố)',
      'parentPhone': '0978112233',
      'leaveType': 'Khám sức khỏe chuyên khoa',
      'startDate': '28/10/2026',
      'endDate': '28/10/2026',
      'daysCount': 1,
      'createdAt': '27/10/2026 18:00',
      'reason': 'Cháu có lịch hẹn khám định kỳ mắt tại Bệnh viện Mắt Trung ương. Xin phép GVCN cho cháu nghỉ học 1 ngày.',
      'status': 'approved',
      'teacherNote': 'Đã duyệt. Chúc em đi khám kết quả tốt.',
      'reviewedAt': '27/10/2026 19:15',
    },
    {
      'id': 'LR-2026-004',
      'studentName': 'Đặng Quốc Thành',
      'studentId': 'HS000601729',
      'className': '10A1',
      'parentName': 'Đặng Văn Dũng (Bố)',
      'parentPhone': '0934556677',
      'leaveType': 'Đi du lịch gia đình',
      'startDate': '25/10/2026',
      'endDate': '25/10/2026',
      'daysCount': 1,
      'createdAt': '24/10/2026 21:00',
      'reason': 'Gia đình đi nghỉ dưỡng cuối tuần kéo dài sang sáng thứ Hai, xin phép cho cháu Thành nghỉ 1 buổi.',
      'status': 'rejected',
      'teacherNote': 'Thứ Hai có bài kiểm tra tập trung giữa kỳ môn Toán và Ngữ văn của Khối 10, đề nghị phụ huynh cho em đi thi đầy đủ.',
      'reviewedAt': '25/10/2026 06:30',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _getRequestsByStatus(String status) {
    return _leaveRequests.where((req) => req['status'] == status).toList();
  }

  void _showApproveDialog(Map<String, dynamic> request) {
    final noteController = TextEditingController(
      text: 'Cô đồng ý cho em nghỉ. Nhớ theo dõi sức khỏe và ôn bài đầy đủ nhé!',
    );

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.check_circle_outline, color: AppColors.success),
            SizedBox(width: 8),
            Expanded(child: Text('Phê duyệt đơn nghỉ')),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Duyệt đơn nghỉ phép cho học sinh: ${request['studentName']}'),
            const SizedBox(height: 6),
            Text(
              'Thời gian: ${request['startDate']} - ${request['endDate']} (${request['daysCount']} ngày)',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 12),
            const Text('Lời nhắn / Dặn dò của Giáo viên:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            TextField(
              controller: noteController,
              maxLines: 2,
              decoration: const InputDecoration(
                hintText: 'Nhập dặn dò cho học sinh & phụ huynh...',
                border: OutlineInputBorder(),
                isDense: true,
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
              setState(() {
                request['status'] = 'approved';
                request['teacherNote'] = noteController.text.trim();
                request['reviewedAt'] = '05/11/2026 14:00';
              });
              Navigator.pop(ctx);
              NotificationService.instance.notifyLeaveStatus(
                studentName: request['studentName'] as String,
                isApproved: true,
                teacherName: 'Cô Nguyễn Kiều Oanh',
                note: request['teacherNote'] as String,
                context: context,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Đã phê duyệt đơn nghỉ phép của em ${request['studentName']}'),
                  backgroundColor: AppColors.success,
                  duration: const Duration(seconds: 3),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
            child: const Text('Xác nhận Duyệt', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showRejectDialog(Map<String, dynamic> request) {
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.cancel_outlined, color: Colors.red),
            SizedBox(width: 8),
            Expanded(child: Text('Từ chối đơn xin phép')),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Từ chối đơn của học sinh: ${request['studentName']}'),
            const SizedBox(height: 12),
            const Text('Lý do từ chối (bắt buộc):', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            TextField(
              controller: reasonController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'Nhập lý do từ chối để phụ huynh nắm rõ...',
                border: OutlineInputBorder(),
                isDense: true,
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
              final reason = reasonController.text.trim();
              if (reason.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Vui lòng nhập lý do từ chối!'), backgroundColor: Colors.red),
                );
                return;
              }
              setState(() {
                request['status'] = 'rejected';
                request['teacherNote'] = reason;
                request['reviewedAt'] = '05/11/2026 14:00';
              });
              Navigator.pop(ctx);
              NotificationService.instance.notifyLeaveStatus(
                studentName: request['studentName'] as String,
                isApproved: true,
                teacherName: 'Cô Nguyễn Kiều Oanh',
                note: request['teacherNote'] as String,
                context: context,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Đã từ chối đơn nghỉ phép của em ${request['studentName']}'),
                  backgroundColor: Colors.red,
                  duration: const Duration(seconds: 3),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Từ chối đơn', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pendingList = _getRequestsByStatus('pending');
    final approvedList = _getRequestsByStatus('approved');
    final rejectedList = _getRequestsByStatus('rejected');

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
            const FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                'Xét duyệt Đơn xin Nghỉ phép',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
              ),
            ),
            Text(
              'Lớp ${widget.className ?? "10A1"} • Cô Nguyễn Kiều Oanh',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: Colors.grey.shade600,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelPadding: const EdgeInsets.symmetric(horizontal: 4),
          tabs: [
            Tab(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Chờ duyệt'),
                    if (pendingList.isNotEmpty) ...[
                      const SizedBox(width: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '${pendingList.length}',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            Tab(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Đã duyệt'),
                    const SizedBox(width: 3),
                    Text('(${approvedList.length})', style: const TextStyle(fontSize: 11)),
                  ],
                ),
              ),
            ),
            Tab(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Từ chối'),
                    const SizedBox(width: 3),
                    Text('(${rejectedList.length})', style: const TextStyle(fontSize: 11)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildRequestList(pendingList, 'pending'),
          _buildRequestList(approvedList, 'approved'),
          _buildRequestList(rejectedList, 'rejected'),
        ],
      ),
    );
  }

  Widget _buildRequestList(List<Map<String, dynamic>> requests, String status) {
    if (requests.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              status == 'pending'
                  ? Icons.mark_email_read_outlined
                  : status == 'approved'
                      ? Icons.check_circle_outline
                      : Icons.cancel_outlined,
              size: 56,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 12),
            Text(
              status == 'pending'
                  ? 'Hiện không có đơn nào đang chờ duyệt'
                  : status == 'approved'
                      ? 'Chưa có đơn nào đã duyệt'
                      : 'Không có đơn nào bị từ chối',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: requests.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final req = requests[index];
        return _buildLeaveRequestCard(req);
      },
    );
  }

  Widget _buildLeaveRequestCard(Map<String, dynamic> req) {
    final status = req['status'] as String;
    final isPending = status == 'pending';
    final isApproved = status == 'approved';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isPending
              ? Colors.orange.shade200
              : isApproved
                  ? Colors.green.shade200
                  : Colors.red.shade200,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Student Name & Badge
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                child: const Icon(Icons.school, color: AppColors.primary, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      req['studentName'] as String,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    Text(
                      'Lớp ${req['className']} • Mã: ${req['studentId']}',
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                    ),
                  ],
                ),
              ),
              _buildStatusBadge(status),
            ],
          ),
          const Divider(height: 20),

          // Submitter & Dates info
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 16, color: Colors.blueGrey),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Người gửi: ${req['parentName']}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                    // Contact parent button
                    InkWell(
                      onTap: () {
                        context.push('/chat-detail', extra: {
                          'teacherName': req['studentName'],
                          'role': 'teacher',
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.chat_outlined, size: 12, color: AppColors.primary),
                            SizedBox(width: 4),
                            Text('Nhắn tin', style: TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.date_range, size: 16, color: Colors.blueGrey),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Thời gian nghỉ: ${req['startDate']} - ${req['endDate']} (${req['daysCount']} ngày)',
                        style: const TextStyle(fontSize: 12, color: Colors.black87),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.category_outlined, size: 16, color: Colors.blueGrey),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Loại phép: ${req['leaveType']}',
                        style: const TextStyle(fontSize: 12, color: Colors.black87),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Reason
          const Text('Lý do xin nghỉ:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(
            req['reason'] as String,
            style: const TextStyle(fontSize: 13, height: 1.4),
          ),

          // Teacher Note if reviewed
          if (!isPending && (req['teacherNote'] as String).isNotEmpty) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isApproved ? Colors.green.shade50 : Colors.red.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: isApproved ? Colors.green.shade200 : Colors.red.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        isApproved ? Icons.check_circle : Icons.error_outline,
                        size: 14,
                        color: isApproved ? Colors.green.shade700 : Colors.red.shade700,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        isApproved ? 'Ý kiến GVCN:' : 'Lý do từ chối:',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isApproved ? Colors.green.shade900 : Colors.red.shade900,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    req['teacherNote'] as String,
                    style: TextStyle(
                      fontSize: 12,
                      color: isApproved ? Colors.green.shade900 : Colors.red.shade900,
                    ),
                  ),
                  if (req['reviewedAt'] != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Duyệt lúc: ${req['reviewedAt']}',
                      style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
                    ),
                  ],
                ],
              ),
            ),
          ],

          // Action buttons for Pending
          if (isPending) ...[
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _showRejectDialog(req),
                    icon: const Icon(Icons.close, size: 16, color: Colors.red),
                    label: const Text('Từ chối', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () => _showApproveDialog(req),
                    icon: const Icon(Icons.check, size: 18, color: Colors.white),
                    label: const Text('Phê duyệt đơn', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bg;
    Color text;
    String label;

    switch (status) {
      case 'pending':
        bg = Colors.orange.shade50;
        text = Colors.orange.shade800;
        label = 'Chờ duyệt';
        break;
      case 'approved':
        bg = Colors.green.shade50;
        text = Colors.green.shade800;
        label = 'Đã duyệt';
        break;
      case 'rejected':
      default:
        bg = Colors.red.shade50;
        text = Colors.red.shade800;
        label = 'Từ chối';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: text.withValues(alpha: 0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(color: text, fontSize: 11, fontWeight: FontWeight.bold),
      ),
    );
  }
}

