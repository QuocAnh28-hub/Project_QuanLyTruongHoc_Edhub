import 'dart:async';
import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';

/// Categories of EduHub Notifications
enum NotificationCategory {
  attendance,
  leave,
  grade,
  tuition,
  announcement,
  chat,
}

extension NotificationCategoryExtension on NotificationCategory {
  String get displayName {
    switch (this) {
      case NotificationCategory.attendance:
        return 'Điểm danh & Chuyên cần';
      case NotificationCategory.leave:
        return 'Nghỉ phép học sinh';
      case NotificationCategory.grade:
        return 'Học tập & Sổ điểm';
      case NotificationCategory.tuition:
        return 'Tài chính & Học phí';
      case NotificationCategory.announcement:
        return 'Thông báo Nhà trường';
      case NotificationCategory.chat:
        return 'Tin nhắn & Trao đổi';
    }
  }

  Color get color {
    switch (this) {
      case NotificationCategory.attendance:
        return const Color(0xFF137333); // Green
      case NotificationCategory.leave:
        return const Color(0xFFE37400); // Orange
      case NotificationCategory.grade:
        return const Color(0xFF1A73E8); // Blue
      case NotificationCategory.tuition:
        return const Color(0xFFD93025); // Red
      case NotificationCategory.announcement:
        return const Color(0xFF9333EA); // Purple
      case NotificationCategory.chat:
        return const Color(0xFF00897B); // Teal
    }
  }

  IconData get icon {
    switch (this) {
      case NotificationCategory.attendance:
        return Icons.verified_user_outlined;
      case NotificationCategory.leave:
        return Icons.event_available_outlined;
      case NotificationCategory.grade:
        return Icons.menu_book_outlined;
      case NotificationCategory.tuition:
        return Icons.account_balance_wallet_outlined;
      case NotificationCategory.announcement:
        return Icons.campaign_outlined;
      case NotificationCategory.chat:
        return Icons.chat_bubble_outline;
    }
  }
}

/// Notification Entity
class EduNotification {
  final String id;
  final String title;
  final String body;
  final NotificationCategory category;
  final DateTime timestamp;
  bool isRead;
  final String? targetRole; // 'all', 'parent', 'teacher', 'student'
  final String? actionRoute;
  final Map<String, dynamic>? extraData;

  EduNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.category,
    required this.timestamp,
    this.isRead = false,
    this.targetRole = 'all',
    this.actionRoute,
    this.extraData,
  });

  String get timeAgo {
    final diff = DateTime.now().difference(timestamp);
    if (diff.inMinutes < 1) return 'Vừa xong';
    if (diff.inMinutes < 60) return '${diff.inMinutes} phút trước';
    if (diff.inHours < 24) return '${diff.inHours} giờ trước';
    return '${diff.inDays} ngày trước';
  }
}

/// Central Notification Service for EduHub Mobile Client
class NotificationService {
  NotificationService._internal() {
    _initDefaultNotifications();
  }

  static final NotificationService instance = NotificationService._internal();

  final List<EduNotification> _notifications = [];
  final StreamController<EduNotification> _notificationStreamController =
      StreamController<EduNotification>.broadcast();

  final ValueNotifier<int> unreadCountNotifier = ValueNotifier<int>(0);

  Stream<EduNotification> get onNotificationReceived =>
      _notificationStreamController.stream;

  List<EduNotification> get notifications => List.unmodifiable(_notifications);

  void _initDefaultNotifications() {
    _notifications.addAll([
      EduNotification(
        id: 'notif_001',
        title: 'Thông báo điểm danh buổi sáng',
        body: 'Học sinh Trần Mỹ An (Lớp 10A1) đã có mặt tại trường lúc 07:25 qua cổng soát thẻ NFC.',
        category: NotificationCategory.attendance,
        timestamp: DateTime.now().subtract(const Duration(minutes: 25)),
        isRead: false,
        targetRole: 'parent',
        actionRoute: '/attendance-history',
      ),
      EduNotification(
        id: 'notif_002',
        title: 'Cô Nguyễn Kiều Oanh đã duyệt đơn nghỉ phép',
        body: 'Đơn xin nghỉ phép ngày 06/11 - 07/11/2026 của học sinh Trần Mỹ An đã được GVCN phê duyệt. Lời dặn: Chúc em mau khỏe, gia đình hỗ trợ theo dõi sức khỏe và tự ôn bài.',
        category: NotificationCategory.leave,
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
        isRead: false,
        targetRole: 'parent',
        actionRoute: '/leave-request',
      ),
      EduNotification(
        id: 'notif_003',
        title: 'Cập nhật điểm kiểm tra thường xuyên Môn Toán',
        body: 'Điểm kiểm tra TX4 môn Toán học - Lớp 10A1 đã được giáo viên bộ môn ghi nhận: 9.0 điểm. ĐTB môn đạt 8.7 (Xếp loại Giỏi).',
        category: NotificationCategory.grade,
        timestamp: DateTime.now().subtract(const Duration(hours: 5)),
        isRead: true,
        targetRole: 'all',
        actionRoute: '/student-grades',
      ),
      EduNotification(
        id: 'notif_004',
        title: 'Thông báo nộp tiền học phí & BHYT Tháng 11/2026',
        body: 'Kính gửi Quý phụ huynh, Nhà trường đã phát hành phiếu thu học phí & phí dịch vụ bán trú Tháng 11/2026. Hạn đóng: trước ngày 15/11/2026.',
        category: NotificationCategory.tuition,
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
        isRead: true,
        targetRole: 'parent',
        actionRoute: '/notifications',
        extraData: {'amount': '1.850.000 đ'},
      ),
      EduNotification(
        id: 'notif_005',
        title: 'Thông báo Lễ mít-tinh Kỷ niệm Ngày Nhà giáo Việt Nam 20/11',
        body: 'Trường THPT Nguyễn Siêu tổ chức Hội diễn văn nghệ và Lễ tri ân các thầy cô giáo vào sáng Thứ Năm ngày 20/11/2026.',
        category: NotificationCategory.announcement,
        timestamp: DateTime.now().subtract(const Duration(days: 2)),
        isRead: true,
        targetRole: 'all',
        actionRoute: '/news-feed',
      ),
    ]);

    _updateUnreadCount();
  }

  void _updateUnreadCount() {
    unreadCountNotifier.value =
        _notifications.where((n) => !n.isRead).length;
  }

  /// Dispatch a new notification
  void dispatchNotification(EduNotification notif, {BuildContext? context}) {
    _notifications.insert(0, notif);
    _updateUnreadCount();
    _notificationStreamController.add(notif);

    if (context != null) {
      showInAppBanner(context, notif);
    }
  }

  /// Mark specific notification as read
  void markAsRead(String id) {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1 && !_notifications[index].isRead) {
      _notifications[index].isRead = true;
      _updateUnreadCount();
    }
  }

  /// Mark all notifications as read
  void markAllAsRead() {
    for (var n in _notifications) {
      n.isRead = true;
    }
    _updateUnreadCount();
  }

  /// Delete notification
  void deleteNotification(String id) {
    _notifications.removeWhere((n) => n.id == id);
    _updateUnreadCount();
  }

  /// Helper to trigger Attendance notification
  void notifyAttendance({
    required String studentName,
    required String className,
    required String status,
    required String time,
    BuildContext? context,
  }) {
    final notif = EduNotification(
      id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Điểm danh: $studentName - $className',
      body: 'Học sinh $studentName đã được ghi nhận: $status lúc $time.',
      category: NotificationCategory.attendance,
      timestamp: DateTime.now(),
      targetRole: 'parent',
      actionRoute: '/attendance-history',
    );
    dispatchNotification(notif, context: context);
  }

  /// Helper to trigger Leave Approval notification
  void notifyLeaveStatus({
    required String studentName,
    required bool isApproved,
    required String teacherName,
    required String note,
    BuildContext? context,
  }) {
    final action = isApproved ? 'đã phê duyệt' : 'từ chối';
    final notif = EduNotification(
      id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Đơn xin nghỉ phép: $action',
      body: 'Giáo viên $teacherName $action đơn nghỉ của em $studentName. Lời dặn: $note',
      category: NotificationCategory.leave,
      timestamp: DateTime.now(),
      targetRole: 'parent',
      actionRoute: '/leave-request',
    );
    dispatchNotification(notif, context: context);
  }

  /// Helper to trigger Grade notification
  void notifyGradeEntered({
    required String studentName,
    required String subjectName,
    required String scoreLabel,
    required num score,
    BuildContext? context,
  }) {
    final notif = EduNotification(
      id: 'notif_${DateTime.now().millisecondsSinceEpoch}',
      title: 'Điểm số mới: Môn $subjectName',
      body: 'Học sinh $studentName vừa có điểm $scoreLabel môn $subjectName: $score điểm.',
      category: NotificationCategory.grade,
      timestamp: DateTime.now(),
      targetRole: 'all',
      actionRoute: '/student-grades',
    );
    dispatchNotification(notif, context: context);
  }

  /// Show beautiful in-app Heads-up banner notification
  void showInAppBanner(BuildContext context, EduNotification notif) {
    final overlay = Overlay.of(context);
    late OverlayEntry overlayEntry;

    overlayEntry = OverlayEntry(
      builder: (context) => _InAppNotificationWidget(
        notification: notif,
        onDismiss: () => overlayEntry.remove(),
      ),
    );

    overlay.insert(overlayEntry);

    // Auto dismiss after 4 seconds
    Future.delayed(const Duration(seconds: 4), () {
      if (overlayEntry.mounted) {
        overlayEntry.remove();
      }
    });
  }

  void dispose() {
    _notificationStreamController.close();
    unreadCountNotifier.dispose();
  }
}

/// Floating Heads-up Banner Widget
class _InAppNotificationWidget extends StatefulWidget {
  final EduNotification notification;
  final VoidCallback onDismiss;

  const _InAppNotificationWidget({
    required this.notification,
    required this.onDismiss,
  });

  @override
  State<_InAppNotificationWidget> createState() =>
      _InAppNotificationWidgetState();
}

class _InAppNotificationWidgetState extends State<_InAppNotificationWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _offsetAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 350),
      vsync: this,
    );

    _offsetAnimation = Tween<Offset>(
      begin: const Offset(0.0, -1.0),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutBack,
    ));

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _dismissWithAnimation() {
    _controller.reverse().then((_) => widget.onDismiss());
  }

  @override
  Widget build(BuildContext context) {
    final safeTop = MediaQuery.of(context).padding.top;
    final cat = widget.notification.category;

    return Positioned(
      top: safeTop + 10,
      left: 16,
      right: 16,
      child: SlideTransition(
        position: _offsetAnimation,
        child: Material(
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cat.color.withValues(alpha: 0.3), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.12),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category icon badge
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: cat.color.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(cat.icon, color: cat.color, size: 20),
                ),
                const SizedBox(width: 12),
                // Text details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              cat.displayName,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: cat.color,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'Vừa xong',
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.notification.title,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.notification.body,
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey.shade700,
                          height: 1.3,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                // Close button
                GestureDetector(
                  onTap: _dismissWithAnimation,
                  child: Icon(
                    Icons.close,
                    size: 18,
                    color: Colors.grey.shade400,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
