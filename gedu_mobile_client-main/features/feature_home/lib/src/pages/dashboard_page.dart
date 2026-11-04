import 'package:flutter/material.dart';
import 'package:lib_design_system/lib_design_system.dart';
import 'tabs/tabs.dart';

/// Dashboard page with bottom navigation tabs
/// This is the main container after onboarding flow is completed
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int _currentTabIndex = 0;

  // Tab pages
  final List<Widget> _tabPages = [
    const HomeTab(),
    const MessageTab(),
    const NewsFeedTab(),
    const NotificationTab(),
    const ProfileTab(),
  ];

  // Tab labels
  final List<String> _tabLabels = [
    'Trang chủ',
    'Tin nhắn',
    'Bảng tin',
    'Thông báo',
    'Tài khoản',
  ];

  // Tab icons
  final List<Widget> _tabIcons = [
    Assets.images.tabbar.home.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.message.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.newFeeds.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.notifications.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.profile.designSystemSvg(width: 24, height: 24),
  ];

  // Selected tab icons
  final List<Widget> _selectedTabIcons = [
    Assets.images.tabbar.homeSelected.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.message.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.newFeeds.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.notifications.designSystemSvg(width: 24, height: 24),
    Assets.images.tabbar.profileSelected.designSystemSvg(width: 24, height: 24),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: _tabPages[_currentTabIndex],
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: _currentTabIndex,
        onTap: (index) {
          setState(() {
            _currentTabIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.selectionBlue,
        unselectedItemColor: AppColors.textSecondary,
        selectedLabelStyle: AppTypography.bodySmall.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: AppTypography.bodySmall,
        elevation: 0, // Remove default elevation since we have custom shadow
        items: List.generate(
          _tabLabels.length,
          (index) => BottomNavigationBarItem(
            icon: _tabIcons[index],
            activeIcon: _selectedTabIcons[index],
            label: _tabLabels[index],
          ),
        ),
      ),
    );
  }
}
