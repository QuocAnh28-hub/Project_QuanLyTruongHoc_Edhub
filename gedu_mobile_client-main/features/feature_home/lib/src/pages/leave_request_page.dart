import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Màn hình Đơn xin nghỉ phép trực tuyến dành cho Phụ huynh
class LeaveRequestPage extends StatefulWidget {
  final String? studentName;
  final String? className;

  const LeaveRequestPage({
    super.key,
    this.studentName,
    this.className,
  });

  @override
  State<LeaveRequestPage> createState() => _LeaveRequestPageState();
}

class _LeaveRequestPageState extends State<LeaveRequestPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Form states
  String _selectedReasonType = 'Bị ốm / Khám sức khỏe';
  String _selectedDuration = 'Nghỉ cả ngày (01 ngày)';
  final TextEditingController _reasonDetailController = TextEditingController();
  final TextEditingController _contactPhoneController =
      TextEditingController(text: '0912.345.678 (Mẹ)');

  // Request history state
  final List<Map<String, dynamic>> _historyRequests = [
    {
      'id': 'NP-20261104-01',
      'createdDate': '04/11/2026 07:15',
      'leaveDate': 'Hôm nay (04/11/2026)',
      'duration': 'Nghỉ cả ngày (01 ngày)',
      'reason': 'Cháu bị cảm sốt và đau họng từ tối qua, gia đình xin phép cho cháu nghỉ để theo dõi và uống thuốc.',
      'status': 'PENDING',
      'approver': 'Cô Nguyễn Kiều Oanh (GVCN)',
      'reply': 'Đang chờ giáo viên chủ nhiệm xem xét.',
    },
    {
      'id': 'NP-20261028-02',
      'createdDate': '28/10/2026 06:45',
      'leaveDate': '28/10/2026',
      'duration': 'Nghỉ cả ngày (01 ngày)',
      'reason': 'Cháu bị đau dạ dày đi nội soi tại Bệnh viện Nhi Trung ương.',
      'status': 'APPROVED',
      'approver': 'Cô Nguyễn Kiều Oanh (GVCN)',
      'reply': 'Cô đã nhận đơn và báo các giáo viên bộ môn. Chúc con mau khỏe!',
    },
    {
      'id': 'NP-20260915-03',
      'createdDate': '15/09/2026 07:00',
      'leaveDate': '15/09/2026',
      'duration': 'Nghỉ buổi sáng (Tiết 1 - Tiết 3)',
      'reason': 'Gia đình đưa cháu đi khám răng định kỳ theo chỉ định của nha sĩ.',
      'status': 'APPROVED',
      'approver': 'Cô Nguyễn Kiều Oanh (GVCN)',
      'reply': 'Đã duyệt. Sau buổi khám phụ huynh cho con vào lớp học tiếp nhé.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _reasonDetailController.dispose();
    _contactPhoneController.dispose();
    super.dispose();
  }

  void _submitLeaveRequest() {
    if (_reasonDetailController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập lý do xin nghỉ phép cụ thể!'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() {
      _historyRequests.insert(0, {
        'id': 'NP-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
        'createdDate': 'Vừa xong',
        'leaveDate': '05/11/2026 - 06/11/2026',
        'duration': _selectedDuration,
        'reason': _reasonDetailController.text.trim(),
        'status': 'PENDING',
        'approver': 'Cô Nguyễn Kiều Oanh (GVCN)',
        'reply': 'Đã chuyển đơn tới Giáo viên chủ nhiệm.',
      });
      _reasonDetailController.clear();
    });

    // Switch to history tab
    _tabController.animateTo(1);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã gửi đơn xin nghỉ phép thành công tới GVCN!'),
        backgroundColor: AppColors.success,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Đơn xin nghỉ phép',
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
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelStyle: AppTypography.bodyMedium.copyWith(fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'Tạo đơn mới'),
            Tab(text: 'Lịch sử đơn đã gửi'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildCreateRequestTab(),
          _buildHistoryTab(),
        ],
      ),
    );
  }

  Widget _buildCreateRequestTab() {
    final sName = widget.studentName ?? 'Trần Mỹ An';
    final cName = widget.className ?? '10A1';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.space4x),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Student Info Card
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
                  radius: 24,
                  backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                  child: const Icon(Icons.school, color: AppColors.primary),
                ),
                const SizedBox(width: AppSpacing.space3x),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Học sinh: $sName',
                        style: AppTypography.titleSmall.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Lớp: $cName • GVCN: Cô Nguyễn Kiều Oanh',
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

          // Reason Type Picker
          Text(
            'Lý do xin nghỉ học *',
            style: AppTypography.bodyMedium.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.black.withValues(alpha: 0.15)),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedReasonType,
                isExpanded: true,
                items: [
                  'Bị ốm / Khám sức khỏe',
                  'Việc bận gia đình đột xuất',
                  'Tham gia kỳ thi / Hoạt động ngoài trường',
                  'Lý do cá nhân khác',
                ].map((val) {
                  return DropdownMenuItem(
                    value: val,
                    child: Text(val, style: AppTypography.bodyMedium),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedReasonType = val);
                },
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space4x),

          // Duration Picker
          Text(
            'Thời gian xin nghỉ *',
            style: AppTypography.bodyMedium.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.black.withValues(alpha: 0.15)),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedDuration,
                isExpanded: true,
                items: [
                  'Nghỉ cả ngày (01 ngày)',
                  'Nghỉ buổi sáng (Tiết 1 - Tiết 5)',
                  'Nghỉ buổi chiều (Tiết 6 - Tiết 8)',
                  'Nghỉ nhiều ngày (02 - 03 ngày)',
                ].map((val) {
                  return DropdownMenuItem(
                    value: val,
                    child: Text(val, style: AppTypography.bodyMedium),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedDuration = val);
                },
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space4x),

          // Reason detail
          Text(
            'Chi tiết lý do và lời nhắn gửi giáo viên *',
            style: AppTypography.bodyMedium.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),
          TextField(
            controller: _reasonDetailController,
            maxLines: 4,
            decoration: InputDecoration(
              hintText: 'Nhập chi tiết tình trạng sức khỏe hoặc lý do xin nghỉ của học sinh...',
              hintStyle: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.15)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.15)),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space4x),

          // Contact phone
          Text(
            'Số điện thoại phụ huynh liên hệ',
            style: AppTypography.bodyMedium.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: AppSpacing.space2x),
          TextField(
            controller: _contactPhoneController,
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.white,
              prefixIcon: const Icon(Icons.phone, size: 20, color: AppColors.primary),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.15)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.black.withValues(alpha: 0.15)),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space6x),

          // Submit Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              onPressed: _submitLeaveRequest,
              icon: const Icon(Icons.send_rounded, color: Colors.white),
              label: Text(
                'Gửi đơn cho Giáo viên Chủ nhiệm',
                style: AppTypography.titleSmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 1,
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.space6x),
        ],
      ),
    );
  }

  Widget _buildHistoryTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.space4x),
      itemCount: _historyRequests.length,
      itemBuilder: (context, index) {
        final req = _historyRequests[index];
        final isApproved = req['status'] == 'APPROVED';
        final statusColor = isApproved ? const Color(0xFF137333) : const Color(0xFFE37400);
        final statusText = isApproved ? 'Đã duyệt' : 'Chờ duyệt';

        return Container(
          margin: const EdgeInsets.only(bottom: AppSpacing.space4x),
          padding: const EdgeInsets.all(AppSpacing.space4x),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.black.withValues(alpha: 0.08)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.02),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top row: ID and Status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Mã đơn: ${req['id']}',
                      style: AppTypography.bodySmall.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      statusText,
                      style: AppTypography.bodySmall.copyWith(
                        color: statusColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
              const Divider(height: 16),

              // Date & Duration
              Row(
                children: [
                  const Icon(Icons.event_outlined, size: 16, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Thời gian: ${req['leaveDate']} (${req['duration']})',
                      style: AppTypography.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              // Reason
              Text(
                'Lý do: ${req['reason']}',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textPrimary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 10),

              // Teacher Feedback Box
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8F9FA),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      isApproved ? Icons.check_circle : Icons.hourglass_top,
                      size: 16,
                      color: statusColor,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            req['approver'],
                            style: AppTypography.bodySmall.copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            req['reply'],
                            style: AppTypography.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

