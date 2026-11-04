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
                              _buildAttendanceSection(context),
                              const SizedBox(height: AppSpacing.space4x),
                              _buildTodayScheduleSection(context),
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
        // Student information and action section
        Padding(
          padding: const EdgeInsets.only(left: AppSpacing.space10x),
          child: Row(
            children: [
              // Student avatar with notification badge
              Stack(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                    child: state is HomeSuccess && state.currentStudent != null
                        ? Text(
                            state.currentStudent!.firstName.isNotEmpty
                                ? state.currentStudent!.firstName[0]
                                      .toUpperCase()
                                : '?',
                            style: AppTypography.headlineMedium.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          )
                        : Icon(Icons.school, color: Colors.white, size: 32),
                  ),
                ],
              ),
              const SizedBox(width: AppSpacing.space3x),
              // Student details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      state is HomeSuccess && state.currentStudent != null
                          ? state.currentStudent!.displayName
                          : (AppLocalizations.of(
                                  context,
                                )?.dashboardStudentNamePlaceholder ??
                                'Student Name'),
                      style: AppTypography.titleSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.space1x),
                    Text(
                      state is HomeSuccess && state.currentStudent != null
                          ? (state.currentStudent!.currentClassName != null
                                ? (AppLocalizations.of(
                                        context,
                                      )?.dashboardClassPrefix(
                                        state.currentStudent!.currentClassName!,
                                      ) ??
                                      'Lớp ${state.currentStudent!.currentClassName}')
                                : (AppLocalizations.of(
                                        context,
                                      )?.dashboardNoClassYet ??
                                      'No class yet'))
                          : (AppLocalizations.of(
                                  context,
                                )?.dashboardClassPlaceholder ??
                                'Class'),
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.space2x),
              // Switch profile button
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  GestureDetector(
                    onTap: () {
                      print('🎯 Switch profile tapped!');
                      _showStudentSelectionBottomSheet(context);
                    },
                    child: Assets.images.switchProfile.designSystemSvg(
                      width: AppSpacing.space6x,
                      height: AppSpacing.space6x,
                      color: AppColors.selectionBlue,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space2x),
                  Container(
                    height: 18,
                    decoration: ShapeDecoration(
                      shape: RoundedRectangleBorder(
                        side: BorderSide(
                          width: 1,
                          strokeAlign: BorderSide.strokeAlignCenter,
                          color: Colors.black.withValues(alpha: 0.10),
                        ),
                      ),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      // Navigate to student profile and refresh on return
                      _pushAndRefresh(context, '/student-profile');
                    },
                    style:
                        AppButtonStyles.custom(
                          backgroundColor: AppColors.transparent,
                          foregroundColor: AppColors.selectionBlue,
                          elevation: 0,
                        ).copyWith(
                          padding: WidgetStateProperty.all(
                            AppSpacing.all(AppSpacing.space2x),
                          ),
                        ),
                    child: Text(
                      AppLocalizations.of(context)?.dashboardViewProfile ??
                          'View Profile',
                      style: AppTypography.bodyLarge.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        // Confirmation prompt if confirmedById is null
        if (state is HomeSuccess &&
            state.currentStudent != null &&
            state.currentStudent?.confirmedById == null) ...[
          const SizedBox(height: AppSpacing.space4x),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.space4x,
              vertical: AppSpacing.space2x,
            ),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF7E7),
              borderRadius: BorderRadius.circular(AppSpacing.borderRadius12px),
              border: Border.all(
                color: AppColors.warning.withValues(alpha: 0.3),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Alert icon, message, and button in one row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Alert icon - aligned to top
                    _buildAlertIcon(),
                    const SizedBox(width: AppSpacing.space3x),
                    // Message and button
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Single title with highlight text
                          RichText(
                            text: TextSpan(
                              style: AppTypography.bodyMedium.copyWith(
                                color: AppColors.textPrimary,
                              ),
                              children: [
                                TextSpan(
                                  text:
                                      AppLocalizations.of(
                                        context,
                                      )?.dashboardConfirmStudentInfoPrefix ??
                                      'Please check and confirm the information of ',
                                ),
                                TextSpan(
                                  text:
                                      ' ${state.currentStudent!.displayName} ',
                                  style: AppTypography.bodyMedium.copyWith(
                                    color: AppColors.textPrimary,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                TextSpan(
                                  text:
                                      AppLocalizations.of(
                                        context,
                                      )?.dashboardConfirmStudentInfoSuffix ??
                                      ' so Gedu can provide the most accurate information.',
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: AppSpacing.space2x),
                          // Action button
                          GestureDetector(
                            onTap: () {
                              _pushAndRefresh(context, '/student-profile');
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  AppLocalizations.of(
                                        context,
                                      )?.dashboardCheckAndConfirm ??
                                      'Check and confirm',
                                  style: AppTypography.bodyMedium.copyWith(
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.space2x),
                                const Icon(
                                  Icons.arrow_forward_ios,
                                  color: AppColors.primary,
                                  size: 16,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
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
              AppLocalizations.of(context)?.dashboardNotificationsTitle ??
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
        Container(
          padding: AppSpacing.all(AppSpacing.space4x),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.pink.withValues(alpha: 0.2),
              width: 1,
            ),
          ),
          child: Row(
            children: [
              // Notification icon (pink circular with document)
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.pink.shade50,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: Icon(Icons.receipt_long, color: Colors.pink, size: 24),
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
                            color: Colors.pink,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'Đọt thu mới',
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
                      'Đọt thu tiền tháng 9/2025\ncủa học sinh Trần Mỹ An',
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
