import 'package:flutter_test/flutter_test.dart';

/// Test suite for TT22/2021/TT-BGDĐT grade calculation and classification logic
void main() {
  group('Thông tư 22/2021/TT-BGDĐT Grade Calculation Tests', () {
    /// Helper function implementing TT22 weighted average calculation
    double calculateSubjectAverage({
      required double tx1,
      required double tx2,
      required double tx3,
      required double tx4,
      required double mid,
      required double fin,
    }) {
      assert(tx1 >= 0 && tx1 <= 10, 'TX1 must be between 0 and 10');
      assert(tx2 >= 0 && tx2 <= 10, 'TX2 must be between 0 and 10');
      assert(tx3 >= 0 && tx3 <= 10, 'TX3 must be between 0 and 10');
      assert(tx4 >= 0 && tx4 <= 10, 'TX4 must be between 0 and 10');
      assert(mid >= 0 && mid <= 10, 'Midterm must be between 0 and 10');
      assert(fin >= 0 && fin <= 10, 'Final must be between 0 and 10');

      final sum = tx1 + tx2 + tx3 + tx4 + (mid * 2) + (fin * 3);
      final avg = sum / 9.0;
      return double.parse(avg.toStringAsFixed(1));
    }

    /// Helper function for academic performance classification
    String classifyAcademicPerformance(double avg) {
      if (avg >= 8.0) return 'Giỏi';
      if (avg >= 6.5) return 'Khá';
      if (avg >= 5.0) return 'Đạt';
      return 'Chưa đạt';
    }

    test('Case 1: Excellent student - Trần Mỹ An (Toán 10A1)', () {
      final avg = calculateSubjectAverage(
        tx1: 8.5,
        tx2: 8.0,
        tx3: 8.8,
        tx4: 9.0,
        mid: 8.5,
        fin: 9.0,
      );

      // (8.5 + 8.0 + 8.8 + 9.0 + 17.0 + 27.0) / 9 = 78.3 / 9 = 8.7
      expect(avg, equals(8.7));
      expect(classifyAcademicPerformance(avg), equals('Giỏi'));
    });

    test('Case 2: Good student - Khá', () {
      final avg = calculateSubjectAverage(
        tx1: 6.5,
        tx2: 7.0,
        tx3: 6.0,
        tx4: 7.5,
        mid: 6.5,
        fin: 7.0,
      );

      // (6.5 + 7.0 + 6.0 + 7.5 + 13.0 + 21.0) / 9 = 61.0 / 9 = 6.8
      expect(avg, equals(6.8));
      expect(classifyAcademicPerformance(avg), equals('Khá'));
    });

    test('Case 3: Average student - Đạt', () {
      final avg = calculateSubjectAverage(
        tx1: 5.0,
        tx2: 5.5,
        tx3: 5.0,
        tx4: 5.5,
        mid: 5.0,
        fin: 5.5,
      );

      // (5.0 + 5.5 + 5.0 + 5.5 + 10.0 + 16.5) / 9 = 47.5 / 9 = 5.3
      expect(avg, equals(5.3));
      expect(classifyAcademicPerformance(avg), equals('Đạt'));
    });

    test('Case 4: Below average student - Chưa đạt', () {
      final avg = calculateSubjectAverage(
        tx1: 4.0,
        tx2: 4.5,
        tx3: 3.5,
        tx4: 4.0,
        mid: 4.0,
        fin: 4.5,
      );

      // (4.0 + 4.5 + 3.5 + 4.0 + 8.0 + 13.5) / 9 = 37.5 / 9 = 4.2
      expect(avg, equals(4.2));
      expect(classifyAcademicPerformance(avg), equals('Chưa đạt'));
    });

    test('Boundary test: Exactly 8.0 is Giỏi, 7.9 is Khá', () {
      expect(classifyAcademicPerformance(8.0), equals('Giỏi'));
      expect(classifyAcademicPerformance(7.9), equals('Khá'));
      expect(classifyAcademicPerformance(6.5), equals('Khá'));
      expect(classifyAcademicPerformance(6.4), equals('Đạt'));
      expect(classifyAcademicPerformance(5.0), equals('Đạt'));
      expect(classifyAcademicPerformance(4.9), equals('Chưa đạt'));
    });

    test('Validation test: Out of bounds scores should trigger assertion error', () {
      expect(
        () => calculateSubjectAverage(
          tx1: 11.0,
          tx2: 8.0,
          tx3: 8.0,
          tx4: 8.0,
          mid: 8.0,
          fin: 8.0,
        ),
        throwsA(isA<AssertionError>()),
      );

      expect(
        () => calculateSubjectAverage(
          tx1: -1.0,
          tx2: 8.0,
          tx3: 8.0,
          tx4: 8.0,
          mid: 8.0,
          fin: 8.0,
        ),
        throwsA(isA<AssertionError>()),
      );
    });
  });
}

