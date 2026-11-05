import 'package:flutter_test/flutter_test.dart';
import 'package:feature_home/feature_home.dart';

void main() {
  group('NotificationService Tests', () {
    late NotificationService service;

    setUp(() {
      service = NotificationService.instance;
    });

    test('Initial notifications are preloaded correctly', () {
      final notifs = service.notifications;
      expect(notifs.isNotEmpty, isTrue);
      expect(notifs.length, greaterThanOrEqualTo(5));
    });

    test('Unread count calculation works correctly', () {
      final unreadCount = service.notifications.where((n) => !n.isRead).length;
      expect(service.unreadCountNotifier.value, equals(unreadCount));
    });

    test('Dispatching a new notification adds to top of list and updates unread count', () {
      final initialUnread = service.unreadCountNotifier.value;
      final initialTotal = service.notifications.length;

      final newNotif = EduNotification(
        id: 'test_notif_${DateTime.now().millisecondsSinceEpoch}',
        title: 'Kiểm thử thông báo tự động',
        body: 'Nội dung kiểm thử hệ thống thông báo Giai đoạn 7.',
        category: NotificationCategory.announcement,
        timestamp: DateTime.now(),
        isRead: false,
      );

      service.dispatchNotification(newNotif);

      expect(service.notifications.length, equals(initialTotal + 1));
      expect(service.notifications.first.id, equals(newNotif.id));
      expect(service.unreadCountNotifier.value, equals(initialUnread + 1));
    });

    test('Mark as read updates notification status and unread count', () {
      final unreadNotif = service.notifications.firstWhere((n) => !n.isRead);
      final initialUnread = service.unreadCountNotifier.value;

      service.markAsRead(unreadNotif.id);

      expect(unreadNotif.isRead, isTrue);
      expect(service.unreadCountNotifier.value, equals(initialUnread - 1));
    });

    test('Mark all as read sets unread count to 0', () {
      service.markAllAsRead();

      expect(service.unreadCountNotifier.value, equals(0));
      for (final n in service.notifications) {
        expect(n.isRead, isTrue);
      }
    });

    test('Category display names and colors are configured properly', () {
      expect(NotificationCategory.attendance.displayName, equals('Điểm danh & Chuyên cần'));
      expect(NotificationCategory.leave.displayName, equals('Nghỉ phép học sinh'));
      expect(NotificationCategory.grade.displayName, equals('Học tập & Sổ điểm'));
      expect(NotificationCategory.tuition.displayName, equals('Tài chính & Học phí'));
      expect(NotificationCategory.announcement.displayName, equals('Thông báo Nhà trường'));
    });
  });
}

