import 'package:flutter/material.dart';

import 'package:lib_design_system/lib_design_system.dart';
import 'package:core_localization/core_localization.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:feature_home/feature_home.dart';
import 'package:core_storage/core_storage.dart';
import 'package:lib_base/lib_base.dart';

/// Home Tab - Main dashboard content
class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  @override
  void initState() {
    super.initState();
    // Check if this is the first login and show welcome dialog
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAndShowWelcomeDialog();
    });
  }

  void _checkAndShowWelcomeDialog() async {
    final isFirstLogin = !AuthStorage.getFirstLoginCompleted();
    Log.d('HomeTab: Is first login: $isFirstLogin');

    if (isFirstLogin) {
      // Get user's full name for the welcome dialog
      final userFullName = AuthStorage.getUserFullName() ?? 'User';
      final l10n = AppLocalizations.of(context);

      if (l10n != null) {
        await showWelcomeDialog(
          context: context,
          title: l10n.welcomeDialogTitle(userFullName),
          message: l10n.welcomeDialogMessage,
          buttonText: l10n.welcomeDialogButtonText,
          onDismiss: () async {
            // Mark first login as completed
            await AuthStorage.saveFirstLoginCompleted(true);
            Log.d('HomeTab: First login marked as completed');
          },
        );

        // Also mark first login as completed if dialog was dismissed by tapping outside
        await AuthStorage.saveFirstLoginCompleted(true);
        Log.d('HomeTab: First login marked as completed (dialog dismissed)');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
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
                              _buildFeatureGrid(context),
                              const SizedBox(height: AppSpacing.space6x),
                              _buildNewNotificationSection(context),
                              const SizedBox(height: AppSpacing.space4x),
                              _buildTodayTasksSection(context),
                              const SizedBox(height: AppSpacing.space4x),
                              _buildNewMessagesSection(context),
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // User profile section
        Row(
          children: [
            // User profile picture
            CircleAvatar(
              radius: 24,
              backgroundColor: Colors.white.withValues(alpha: 0.2),
              child: state is HomeSuccess && state.accountInfo != null
                  ? Text(
                      state.accountInfo!.firstName.isNotEmpty
                          ? state.accountInfo!.firstName[0].toUpperCase()
                          : '?',
                      style: AppTypography.headlineMedium.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : const Icon(Icons.person, color: Colors.white, size: 28),
            ),
            const SizedBox(width: AppSpacing.space2x),
            // Greeting text
            Expanded(
              child: state is HomeSuccess && state.accountInfo != null
                  ? RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'Chào ngày mới,\n',
                            style: AppTypography.bodyLarge.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.normal,
                            ),
                          ),
                          TextSpan(
                            text:
                                '${state.accountInfo!.lastName} ${state.accountInfo!.firstName}',
                            style: AppTypography.bodyLarge.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    )
                  : Text(
                      AppLocalizations.of(context)?.dashboardGreeting ??
                          'Chào ngày mới',
                      style: AppTypography.bodyLarge.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space2x),
        // Class information section
        Padding(
          padding: const EdgeInsets.only(left: AppSpacing.space10x),
          child: Row(
            children: [
              // Class icon
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Assets.images.classIcon.designSystemSvg(
                  width: 28,
                  height: 28,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Class details
              Expanded(
                child: Row(
                  children: [
                    // "Số lớp đang dạy" text
                    Text(
                      AppLocalizations.of(context)?.dashboardTeachingClasses ??
                          'Số lớp đang dạy',
                      style: AppTypography.titleSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.space2x),
                    // Class names
                    Text(
                      '6A1, 7C4, 8B3',
                      style: AppTypography.titleSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureGrid(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      padding: AppSpacing.all(AppSpacing.space4x),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: _buildFeatureCard(
              icon: Assets.images.home.homeCheckIn,
              title:
                  AppLocalizations.of(context)?.dashboardFeatureMessage ??
                  'Gửi tin nhắn',
            ),
          ),
          SizedBox(width: AppSpacing.space2x),
          Expanded(
            child: _buildFeatureCard(
              icon: Assets.images.home.homeScore,
              title:
                  AppLocalizations.of(context)?.dashboardFeatureLeaveRequest ??
                  'Xin nghỉ phép',
            ),
          ),
          SizedBox(width: AppSpacing.space2x),
          Expanded(
            child: _buildFeatureCard(
              icon: Assets.images.home.homeCalendar,
              title:
                  AppLocalizations.of(context)?.dashboardFeatureViewSchedule ??
                  'Xem lịch học',
            ),
          ),
          SizedBox(width: AppSpacing.space2x),
          Expanded(
            child: _buildFeatureCard(
              icon: Assets.images.home.homeFoodMenu,
              title:
                  AppLocalizations.of(context)?.dashboardFeatureViewMenu ??
                  'Xem thực đơn',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNewNotificationSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Thông báo mới',
              style: AppTypography.titleMedium.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
            GestureDetector(
              onTap: () {
                // Navigate to notifications
              },
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Xem tất cả',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space1x),
                  Icon(
                    Icons.arrow_forward_ios,
                    color: AppColors.primary,
                    size: 16,
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space3x),
        // Notification card
        Container(
          padding: AppSpacing.all(AppSpacing.space4x),
          decoration: BoxDecoration(
            color: Colors.purple.shade50,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              // School icon with notification badge
              Stack(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: Icon(Icons.school, color: Colors.blue, size: 24),
                  ),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Notification content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: AppSpacing.space2x,
                        vertical: AppSpacing.space0_5x,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Thông báo từ Ban Giám Hiệu',
                        style: AppTypography.bodySmall.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    Text(
                      'Nhắc nhở nộp báo cáo tổng kết cuối tháng, hạn chót vào ngày 1/8/2025',
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
      ],
    );
  }

  Widget _buildTodayTasksSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Text(
          'Việc cần làm hôm nay',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.space2x),
        // Context info
        Row(
          children: [
            Icon(Icons.person, color: AppColors.textSecondary, size: 16),
            const SizedBox(width: AppSpacing.space1x),
            Text(
              'Lớp chủ nhiệm',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const Spacer(),
            Text(
              '6A1',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space3x),
        // Task cards
        Row(
          children: [
            // Attendance card
            Expanded(
              child: Container(
                padding: AppSpacing.all(AppSpacing.space4x),
                decoration: BoxDecoration(
                  color: Colors.purple.shade50,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Đã điểm danh',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    Row(
                      children: [
                        Icon(Icons.people, color: Colors.blue, size: 32),
                        const SizedBox(width: AppSpacing.space2x),
                        Text(
                          '6/25',
                          style: AppTypography.headlineMedium.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    Text(
                      'Hoàn thành điểm danh 6 trên tổng 25 học sinh',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    // Student avatars
                    Row(
                      children: List.generate(
                        6,
                        (index) => Container(
                          width: 24,
                          height: 24,
                          margin: const EdgeInsets.only(right: 4),
                          decoration: BoxDecoration(
                            color: Colors
                                .primaries[index % Colors.primaries.length],
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.person,
                            color: Colors.white,
                            size: 12,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.space2x),
            // Leave requests card
            Expanded(
              child: Container(
                padding: AppSpacing.all(AppSpacing.space4x),
                decoration: BoxDecoration(
                  color: Colors.pink.shade50,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Đơn xin nghỉ cần duyệt',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    Row(
                      children: [
                        Icon(Icons.checklist, color: Colors.pink, size: 32),
                        const SizedBox(width: AppSpacing.space2x),
                        Text(
                          '2/5',
                          style: AppTypography.headlineMedium.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    Text(
                      'Hoàn thành duyệt 2 đơn nghỉ phép trên tổng 5 đơn',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space2x),
                    // Student avatars
                    Row(
                      children: List.generate(
                        2,
                        (index) => Container(
                          width: 24,
                          height: 24,
                          margin: const EdgeInsets.only(right: 4),
                          decoration: BoxDecoration(
                            color: Colors
                                .primaries[index % Colors.primaries.length],
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.person,
                            color: Colors.white,
                            size: 12,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildNewMessagesSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Text(
          'Tin nhắn mới',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.space3x),
        // Message count and summary
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  '12',
                  style: AppTypography.bodyMedium.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.space2x),
            Text(
              '12',
              style: AppTypography.headlineMedium.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(width: AppSpacing.space2x),
            Expanded(
              child: Text(
                'Bố của Trần Quốc Tuấn, Mẹ của Lê Mỹ Trâm, +10',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.space3x),
        // Message card
        Container(
          padding: AppSpacing.all(AppSpacing.space4x),
          decoration: BoxDecoration(
            color: Colors.green.shade50,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  // Sender avatar
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.grey.shade300,
                    child: Icon(Icons.person, color: Colors.grey.shade600),
                  ),
                  const SizedBox(width: AppSpacing.space2x),
                  // Sender name and message
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Bố của Trần Quốc Tuấn',
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.space1x),
                        Text(
                          'Nhờ cô giáo để ý bé kỹ hơn do hôm nay con hơi mệt mỏi 😊',
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.space2x),
              // Reply button
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Trả lời',
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAttendanceSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              AppLocalizations.of(context)?.dashboardAttendanceTitle ??
                  'Trạng thái chuyên cần',
              style: AppTypography.titleMedium.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
            GestureDetector(
              onTap: () {
                // Navigate to attendance
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
        Container(
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
                  AppLocalizations.of(context)?.dashboardAttendancePresent ??
                      'Có mặt',
                  style: AppTypography.bodySmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Bus icon
              Container(
                width: 60,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.orange.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.directions_bus,
                  color: Colors.orange.shade600,
                  size: 28,
                ),
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Attendance text
              Expanded(
                child: Text(
                  'Trần Mỹ An đã có mặt tại trường\nlúc 7:30 sáng.',
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTodayScheduleSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header
        Text(
          AppLocalizations.of(context)?.dashboardScheduleTitle ??
              'Lịch học hôm nay',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.space2x),
        // Schedule description
        Text(
          AppLocalizations.of(context)?.dashboardScheduleEmpty ??
              'Hôm nay Mỹ An có 5 tiết học sáng và chiều.',
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
            // Navigate to full schedule
          },
          child: Text(
            'Xem tất cả lịch học',
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
  }) {
    return Stack(
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
    );
  }

  /// Build class badge widget
  Widget _buildClassBadge(String className) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space2x,
        vertical: AppSpacing.space1x,
      ),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: Text(
        className,
        style: AppTypography.bodySmall.copyWith(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
