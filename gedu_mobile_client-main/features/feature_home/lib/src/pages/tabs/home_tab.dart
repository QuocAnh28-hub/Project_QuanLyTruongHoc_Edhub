import 'package:flutter/material.dart';

import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_localization/core_localization.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:feature_home/feature_home.dart';
import 'package:core_students/core_students.dart';

import 'package:go_router/go_router.dart';
import '../student_selection_sheet.dart';

/// Home Tab - Main dashboard content
class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  String _getUserRole(HomeState state) {
    if (state is HomeSuccess && state.accountInfo != null) {
      final email = state.accountInfo!.email.toLowerCase();
      final phone = state.accountInfo!.phone ?? '';
      if (email.contains('hocsinh') || phone == '0901234567') {
        return 'student';
      }
      if (email.contains('giaovien') || phone == '0988888888') {
        return 'teacher';
      }
    }
    return 'parent';
  }

  Future<void> _pushAndRefresh(
    BuildContext context,
    String route, {
    Object? extra,
  }) async {
    await context.push(route, extra: extra);
    if (!mounted) return;
    try {
      context.read<HomeBloc>().add(LoadHomeDataEvent());
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        final role = _getUserRole(state);
        return Scaffold(
          backgroundColor: AppColors.background,
          body: Stack(
            children: [
              // Background layer
              Positioned.fill(
                child: Column(
                  children: [
                    // PNG image covers its natural dimensions
                    Assets.images.home.gradientBg.designSystemImage(
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                    // Rest fills with AppColors.background
                    Expanded(child: Container(color: AppColors.background)),
                  ],
                ),
              ),
              // Main content layer
              Positioned.fill(
                child: Column(
                  children: [
                    // Header section with top padding for status bar
                    Padding(
                      padding: EdgeInsets.only(
                        top: MediaQuery.of(context).padding.top,
                        left: AppSpacing.space4x,
                        right: AppSpacing.space4x,
                        bottom: AppSpacing.space4x,
                      ),
                      child: _buildHeader(context, state),
                    ),
                    // Content area
                    Expanded(
                      child: RefreshIndicator(
                        onRefresh: () async {
                          // Trigger refresh by dispatching a refresh event
                          context.read<HomeBloc>().add(LoadHomeDataEvent());
                        },
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.only(
                            left: AppSpacing.space4x,
                            right: AppSpacing.space4x,
                            bottom: AppSpacing.space6x,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _buildFeatureGrid(context, role),
                              const SizedBox(height: AppSpacing.space6x),
                              _buildNewNotificationSection(context, role),
                              const SizedBox(height: AppSpacing.space4x),
                              _buildAttendanceSection(context, role),
                              const SizedBox(height: AppSpacing.space4x),
                              _buildTodayScheduleSection(context, role),
                              const SizedBox(height: AppSpacing.space6x),
                            ],
                          ),
                        ),
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

  Widget _buildHeader(BuildContext context, HomeState state) {
    final role = _getUserRole(state);
    final account = state is HomeSuccess ? state.accountInfo : null;

    String greetingRole = 'phụ huynh';
    String roleBadge = 'Phụ huynh học sinh';
    Color badgeColor = Colors.orange;

    if (role == 'student') {
      greetingRole = 'học sinh';
      roleBadge = 'Học sinh';
      badgeColor = Colors.blue;
    } else if (role == 'teacher') {
      greetingRole = 'cô giáo';
      roleBadge = 'Giáo viên';
      badgeColor = Colors.purple;
    }

    final userName = account != null ? '${account.lastName} ${account.firstName}' : 'Người dùng';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // User profile section
        Row(
          children: [
            // User profile picture with role color
            CircleAvatar(
              radius: 24,
              backgroundColor: badgeColor.withValues(alpha: 0.2),
              child: Text(
                account != null && account.firstName.isNotEmpty
                    ? account.firstName[0].toUpperCase()
                    : 'G',
                style: AppTypography.headlineMedium.copyWith(
                  color: badgeColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.space2x),
            // Greeting text
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          'Chào $greetingRole, ',
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: badgeColor.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: badgeColor.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          roleBadge,
                          style: TextStyle(
                            color: badgeColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    userName,
                    style: AppTypography.titleMedium.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space2x),
        // Sub-info: Student / Class context
        Padding(
          padding: const EdgeInsets.only(left: AppSpacing.space10x),
          child: role == 'student'
              ? Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.blue.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.blue.withValues(alpha: 0.25)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.school, size: 20, color: Colors.blue),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Lớp 10A1 • THPT Nguyễn Siêu • Mã HS: HS000601636',
                          style: AppTypography.bodySmall.copyWith(
                            color: Colors.blue.shade900,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : role == 'teacher'
                  ? Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.purple.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.purple.withValues(alpha: 0.25)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.assignment_ind, size: 20, color: Colors.purple),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'GVCN Lớp 10A1 • Môn Toán học • Sĩ số: 38 học sinh',
                              style: AppTypography.bodySmall.copyWith(
                                color: Colors.purple.shade900,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )
                  : Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: Colors.white.withValues(alpha: 0.3),
                          child: const Icon(Icons.child_care, color: Colors.orange, size: 22),
                        ),
                        const SizedBox(width: AppSpacing.space2x),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                state is HomeSuccess && state.currentStudent != null
                                    ? 'Học sinh: ${state.currentStudent!.displayName}'
                                    : 'Học sinh: Trần Mỹ An',
                                style: AppTypography.bodyMedium.copyWith(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                state is HomeSuccess && state.currentStudent != null
                                    ? 'Lớp ${state.currentStudent!.className ?? "10A1"} • ${state.currentStudent!.schoolName ?? "THPT Nguyễn Siêu"}'
                                    : 'Lớp 10A1 • THPT Nguyễn Siêu',
                                style: AppTypography.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Switch profile button
                        GestureDetector(
                          onTap: () => _showStudentSelectionBottomSheet(context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.selectionBlue.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Assets.images.switchProfile.designSystemSvg(
                                  width: 18,
                                  height: 18,
                                  color: AppColors.selectionBlue,
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  'Đổi con',
                                  style: TextStyle(
                                    color: AppColors.selectionBlue,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
        ),
      ],
    );
  }

  Widget _buildFeatureGrid(BuildContext context, String role) {
    List<Widget> cards = [];

    if (role == 'student') {
      cards = [
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeCalendar,
            title: 'Thời khóa biểu',
            onTap: () => context.push('/timetable'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeScore,
            title: 'Bảng điểm',
            onTap: () => context.push('/student-grades'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeCheckIn,
            title: 'Hỏi bài GVCN',
            onTap: () => context.push('/chat-detail'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeFoodMenu,
            title: 'Thông báo',
            onTap: () => context.push('/notifications'),
          ),
        ),
      ];
    } else if (role == 'teacher') {
      cards = [
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeCheckIn,
            title: 'Sĩ số điểm danh',
            onTap: () => context.push('/teacher-attendance'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeScore,
            title: 'Duyệt đơn nghỉ',
            onTap: () => context.push('/teacher-leave-approval'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeScore,
            title: 'Sổ điểm điện tử',
            onTap: () => context.push('/teacher-gradebook'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeCalendar,
            title: 'Lịch giảng dạy',
            onTap: () => context.push('/teacher-schedule'),
          ),
        ),
      ];
    } else {
      // Parent
      cards = [
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeCheckIn,
            title:
                AppLocalizations.of(context)?.dashboardFeatureMessage ??
                'Gửi tin nhắn',
            onTap: () => context.push('/chat-detail'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeScore,
            title:
                AppLocalizations.of(context)?.dashboardFeatureLeaveRequest ??
                'Xin nghỉ phép',
            onTap: () => context.push('/leave-request'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeCalendar,
            title:
                AppLocalizations.of(context)?.dashboardFeatureViewSchedule ??
                'Xem lịch học',
            onTap: () => context.push('/timetable'),
          ),
        ),
        const SizedBox(width: AppSpacing.space2x),
        Expanded(
          child: _buildFeatureCard(
            icon: Assets.images.home.homeFoodMenu,
            title: 'Xem điểm số',
            onTap: () => context.push('/student-grades'),
          ),
        ),
      ];
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      padding: AppSpacing.all(AppSpacing.space4x),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: cards,
      ),
    );
  }

  Widget _buildNewNotificationSection(BuildContext context, String role) {
    String sectionTitle = 'Thông báo mới';
    String cardTitle = 'Đợt thu tiền tháng 11/2026\ncủa học sinh Trần Mỹ An';
    String badgeText = 'Đợt thu mới';
    Color badgeColor = Colors.pink;
    Color iconBgColor = Colors.pink.shade50;
    IconData iconData = Icons.receipt_long;

    if (role == 'student') {
      sectionTitle = 'Nhiệm vụ & Bài tập học sinh';
      cardTitle = 'Kiểm tra 15 phút môn Toán (Sáng mai)\nNội dung: Hệ phương trình bậc nhất';
      badgeText = 'Bài tập & KT';
      badgeColor = Colors.blue;
      iconBgColor = Colors.blue.shade50;
      iconData = Icons.assignment;
    } else if (role == 'teacher') {
      sectionTitle = 'Công việc cần xử lý ngay';
      cardTitle = '01 Đơn xin nghỉ phép cần xét duyệt\nTừ phụ huynh em Trần Mỹ An (10A1)';
      badgeText = 'Cần xét duyệt';
      badgeColor = Colors.orange;
      iconBgColor = Colors.orange.shade50;
      iconData = Icons.pending_actions;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                sectionTitle,
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () {
                context.push(role == 'teacher' ? '/teacher-leave-approval' : '/notifications');
              },
              child: Text(
                AppLocalizations.of(context)?.dashboardSeeAll ?? 'Xem tất cả',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space3x),
        // Notification card
        GestureDetector(
          onTap: () => context.push(role == 'teacher' ? '/teacher-leave-approval' : '/notifications'),
          child: Container(
            padding: AppSpacing.all(AppSpacing.space4x),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: badgeColor.withValues(alpha: 0.2),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                // Notification icon
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(25),
                  ),
                  child: Icon(iconData, color: badgeColor, size: 24),
                ),
                const SizedBox(width: AppSpacing.space3x),
                // Notification content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: AppSpacing.space2x,
                              vertical: AppSpacing.space0_5x,
                            ),
                            decoration: BoxDecoration(
                              color: badgeColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              badgeText,
                              style: AppTypography.bodySmall.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.space2x),
                      Text(
                        cardTitle,
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                // Arrow icon
                Icon(
                  Icons.chevron_right,
                  color: AppColors.textSecondary,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAttendanceSection(BuildContext context, String role) {
    String headerTitle = 'Trạng thái chuyên cần';
    String badgeTitle = 'Có mặt';
    String attendanceText = 'Trần Mỹ An đã có mặt tại trường\nlúc 7:30 sáng.';
    IconData icon = Icons.directions_bus;
    Color iconColor = Colors.orange.shade600;
    Color iconBg = Colors.orange.shade100;

    if (role == 'student') {
      headerTitle = 'Trạng thái điểm danh của bạn';
      badgeTitle = 'Đúng giờ';
      attendanceText = 'Bạn đã quét thẻ NFC lúc 7:25 sáng tại Cổng trường.\nTham gia đầy đủ các tiết học.';
      icon = Icons.qr_code_scanner;
      iconColor = Colors.blue.shade600;
      iconBg = Colors.blue.shade100;
    } else if (role == 'teacher') {
      headerTitle = 'Báo cáo điểm danh Lớp 10A1';
      badgeTitle = '38/38 Có mặt';
      attendanceText = 'Sĩ số: 38/38 học sinh có mặt đúng giờ.\n0 vắng, 0 đi muộn. Lớp học đúng lịch.';
      icon = Icons.groups;
      iconColor = Colors.purple.shade600;
      iconBg = Colors.purple.shade100;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                headerTitle,
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () {
                context.push(role == 'teacher' ? '/teacher-attendance' : '/attendance-history');
              },
              child: Text(
                AppLocalizations.of(context)?.dashboardSeeAll ?? 'Xem tất cả',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space3x),
        // Attendance card
        GestureDetector(
          onTap: () => context.push(role == 'teacher' ? '/teacher-attendance' : '/attendance-history'),
          child: Container(
            padding: AppSpacing.all(AppSpacing.space4x),
            decoration: BoxDecoration(
            color: AppColors.success.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              // Status badge
              Container(
                padding: EdgeInsets.symmetric(
                  horizontal: AppSpacing.space2x,
                  vertical: AppSpacing.space1x,
                ),
                decoration: BoxDecoration(
                  color: AppColors.success,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  badgeTitle,
                  style: AppTypography.bodySmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Icon
              Container(
                width: 60,
                height: 40,
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  icon,
                  color: iconColor,
                  size: 28,
                ),
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Attendance text
              Expanded(
                child: Text(
                  attendanceText,
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );
}

  Widget _buildTodayScheduleSection(BuildContext context, String role) {
    String headerTitle = 'Lịch học hôm nay';
    String description = 'Hôm nay Mỹ An có 5 tiết học sáng và chiều.';

    if (role == 'student') {
      headerTitle = 'Thời khóa biểu hôm nay';
      description = 'Hôm nay bạn có 5 tiết học (Phòng 201 - Dãy A).';
    } else if (role == 'teacher') {
      headerTitle = 'Lịch giảng dạy & Sinh hoạt hôm nay';
      description = 'Cô có 3 tiết dạy môn Toán (Tiết 2, 4 tại 10A1; Tiết 5 tại 10A3).';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Text(
          headerTitle,
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.space2x),
        // Schedule description
        Text(
          description,
          style: AppTypography.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: AppSpacing.space4x),
        // Schedule items
        _buildScheduleItem(
          '8:00 - 9:00',
          'Môn Toán Nâng cao',
          'Cô Nguyễn Kiều Oanh',
          Colors.blue,
          Icons.person,
        ),
        const SizedBox(height: AppSpacing.space3x),
        _buildScheduleItem(
          '9:30 - 10:45',
          'Môn Ngoại Ngữ 1 - Anh Văn',
          'Thầy Ngô Vĩnh Hy',
          Colors.pink,
          Icons.person,
        ),
        const SizedBox(height: AppSpacing.space3x),
        _buildScheduleItem(
          '13:30 - 14:45',
          'Hoạt động ngoại khóa',
          'GVCN Trần Phương Mỹ Chi',
          Colors.orange,
          Icons.person,
        ),
        const SizedBox(height: AppSpacing.space3x),
        _buildScheduleItem(
          '15:00 - 16:15',
          'Môn Lịch sử',
          'Cô Lê Thị Mỹ Anh',
          Colors.green,
          Icons.person,
        ),
        const SizedBox(height: AppSpacing.space3x),
        _buildScheduleItem(
          '16:30 - 17:45',
          'Môn Thể dục',
          'Thầy Trịnh Mạnh Ninh',
          Colors.purple,
          Icons.person,
        ),
        const SizedBox(height: AppSpacing.space4x),
        // View all schedule link
        GestureDetector(
          onTap: () {
            context.push(role == 'teacher' ? '/teacher-schedule' : '/timetable');
          },
          child: Text(
            role == 'teacher' ? 'Xem toàn bộ lịch giảng dạy tuần' : 'Xem tất cả lịch học',
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildScheduleItem(
    String time,
    String subject,
    String teacher,
    Color dotColor,
    IconData teacherIcon,
  ) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Colored dot indicator
        Container(
          margin: const EdgeInsets.only(top: 6),
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
        ),
        const SizedBox(width: AppSpacing.space3x),
        // Time text
        SizedBox(
          width: 80,
          child: Text(
            time,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        const SizedBox(width: AppSpacing.space3x),
        // Subject and teacher info
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                subject,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: AppSpacing.space1x),
              Row(
                children: [
                  CircleAvatar(
                    radius: 8,
                    backgroundColor: AppColors.gray200,
                    child: Icon(
                      Icons.person,
                      size: 10,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space1x),
                  Expanded(
                    child: Text(
                      teacher,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureCard({
    required SvgGenImage icon,
    required String title,
    bool hasNotification = false,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                icon.designSystemSvg(width: 74, height: 74), // Reduced from 74x74
                SizedBox(height: AppSpacing.space1x),
                Text(
                  title,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2, // Allow text to wrap to 2 lines
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
            if (hasNotification)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: AppColors.error,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _showStudentSelectionBottomSheet(BuildContext context) {
    print('🎯 _showStudentSelectionBottomSheet called');

    // Get the current state and bloc from the parent context
    final homeBloc = context.read<HomeBloc>();
    final currentState = homeBloc.state;
    print('🎯 Current state: ${currentState.runtimeType}');

    if (currentState is! HomeSuccess || currentState.students == null) {
      print('🎯 No student data available - returning early');
      // No student data available
      return;
    }

    print('🎯 Students available: ${currentState.students!.length}');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      isDismissible: true,
      enableDrag: false,
      builder: (context) => SizedBox(
        height: MediaQuery.of(context).size.height * 0.85,
        child: StudentSelectionSheet(
          students: currentState.students!,
          currentStudent: currentState.currentStudent,
          onStudentSelected: (student) =>
              _handleStudentSelected(context, student, homeBloc),
        ),
      ),
    );
  }

  void _handleStudentSelected(
    BuildContext context,
    StudentModel student,
    HomeBloc homeBloc,
  ) {
    // Just dispatch the event - let the BLoC handle everything
    homeBloc.add(SwitchStudentEvent(student: student));
  }

  /// Build alert icon with smart container sizing
  Widget _buildAlertIcon() {
    const iconSize = 24.0;
    const padding = AppSpacing.space2x;
    const containerSize = iconSize + (padding * 2);

    return Container(
      width: containerSize,
      height: containerSize,
      decoration: BoxDecoration(
        color: const Color(0xFFFFE7B3),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Assets.images.home.homeShield.designSystemSvg(
          width: iconSize,
          height: iconSize,
        ),
      ),
    );
  }
}
