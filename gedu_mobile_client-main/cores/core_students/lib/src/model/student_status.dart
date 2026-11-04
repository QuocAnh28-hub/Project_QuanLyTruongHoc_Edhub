/// Enum for student status states
enum StudentStatus {
  /// Chờ nhập học - Waiting for enrollment
  waitingForEnrollment(1),
  
  /// Đang học - Currently studying
  currentlyStudying(2),
  
  /// Bảo lưu - On hold/Reserved
  onHold(3),
  
  /// Đã tốt nghiệp - Graduated
  graduated(4),
  
  /// Đã thôi học - Dropped out
  droppedOut(5);

  const StudentStatus(this.value);

  /// Numeric value of the status
  final int value;

  /// Get StudentStatus from numeric value
  static StudentStatus fromValue(int value) {
    return StudentStatus.values.firstWhere(
      (status) => status.value == value,
      orElse: () => StudentStatus.waitingForEnrollment,
    );
  }

  /// Check if student is active (currently studying or on hold)
  bool get isActive => this == StudentStatus.currentlyStudying || this == StudentStatus.onHold;

  /// Check if student has completed their studies
  bool get isCompleted => this == StudentStatus.graduated;

  /// Check if student has left the school
  bool get hasLeft => this == StudentStatus.droppedOut;

  /// Check if student is waiting to start
  bool get isWaiting => this == StudentStatus.waitingForEnrollment;
} 