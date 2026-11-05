import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Attendance & Leave Management Tests', () {
    test('Attendance rate calculation', () {
      const totalDays = 43;
      const onTimeDays = 42;
      const excusedAbsenceDays = 1;
      const unexcusedDays = 0;

      // Rate considers present on-time and excused absence according to policy
      final rate = ((onTimeDays + excusedAbsenceDays) / totalDays) * 100.0;
      expect(rate, equals(100.0));

      final strictOnTimeRate = (onTimeDays / totalDays) * 100.0;
      expect(strictOnTimeRate.toStringAsFixed(1), equals('97.7'));
    });

    test('Leave request workflow: Pending -> Approved', () {
      final request = {
        'id': 'LR-2026-001',
        'studentName': 'Trần Mỹ An',
        'status': 'pending',
        'startDate': '06/11/2026',
        'endDate': '07/11/2026',
        'daysCount': 2,
        'reason': 'Cháu bị sốt siêu vi từ tối qua, bác sĩ yêu cầu theo dõi tại nhà 2 ngày.',
        'teacherNote': '',
        'reviewedAt': null,
      };

      expect(request['status'], equals('pending'));
      expect(request['teacherNote'], isEmpty);

      // GVCN reviews and approves
      const teacherRemarks = 'Cô đồng ý cho em nghỉ. Nhớ theo dõi sức khỏe và ôn bài đầy đủ nhé!';
      request['status'] = 'approved';
      request['teacherNote'] = teacherRemarks;
      request['reviewedAt'] = '05/11/2026 14:00';

      expect(request['status'], equals('approved'));
      expect(request['teacherNote'], equals(teacherRemarks));
      expect(request['reviewedAt'], isNotNull);
    });

    test('Leave request workflow: Pending -> Rejected', () {
      final request = {
        'id': 'LR-2026-002',
        'studentName': 'Lê Hoàng Nam',
        'status': 'pending',
        'reason': 'Gia đình đi du lịch cá nhân.',
        'teacherNote': '',
      };

      const rejectReason = 'Trùng đợt thi kiểm tra giữa kỳ tập trung của nhà trường.';
      request['status'] = 'rejected';
      request['teacherNote'] = rejectReason;

      expect(request['status'], equals('rejected'));
      expect(request['teacherNote'], equals(rejectReason));
    });

    test('Calculate duration between two dates', () {
      final start = DateTime(2026, 11, 6);
      final end = DateTime(2026, 11, 7);

      final diffInDays = end.difference(start).inDays + 1; // inclusive
      expect(diffInDays, equals(2));
    });
  });
}

