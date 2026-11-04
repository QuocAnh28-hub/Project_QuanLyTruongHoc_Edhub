import 'package:core_localization/core_localization.dart';
import 'package:core_storage/core_storage.dart' hide getIt;

import 'package:feature_home/feature_home.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:lib_base/lib_base.dart';
import 'package:lib_design_system/lib_design_system.dart';

import 'widgets/profile_header.dart';
import 'widgets/profile_menu_item.dart';
import 'widgets/profile_menu_section.dart';

/// Profile Tab
class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  /// Show logout confirmation dialog
  void _showLogoutConfirmation(BuildContext context) {
    showLogoutDialog(
      context: context,
      title: 'Đăng xuất?',
      message:
          AppLocalizations.of(context)?.dashboardLogoutConfirmation ??
          'Bạn có muốn thoát khỏi tài khoản không?',
      cancelText: AppLocalizations.of(context)?.dashboardCancel ?? 'Huỷ',
      logoutText: AppLocalizations.of(context)?.dashboardLogout ?? 'Đăng xuất',
      onCancel: () => Navigator.of(context).pop(false),
      onLogout: () {
        Navigator.of(context).pop(true);
        _performLogout(context);
      },
    );
  }

  /// Perform the actual logout
  Future<void> _performLogout(BuildContext context) async {
    try {
      final appPreferences = getIt<AppPreferences>();
      await appPreferences.logout();
      if (context.mounted) {
        context.go('/login'); // Navigate to login screen
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error during logout'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          getIt<ProfileBloc>()..add(const LoadProfileDataEvent()),
      child: BlocBuilder<ProfileBloc, ProfileState>(
        builder: (context, state) {
          return Scaffold(
            backgroundColor: AppColors.background,
            body: CustomScrollView(
              slivers: [
                // Header with gradient background
                SliverToBoxAdapter(child: ProfileHeader(state: state)),
                // Menu sections
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.space6x,
                  ),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      const SizedBox(height: AppSpacing.space5x),
                      ProfileMenuSection(
                        title:
                            AppLocalizations.of(
                              context,
                            )?.dashboardAccountManagementTitle ??
                            'Account Management',
                        items: [
                          ProfileMenuItem(
                            icon: Assets.images.profile.security
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(
                                  context,
                                )?.dashboardChangePassword ??
                                'Change Password',
                            onTap: () {
                              // Use push to maintain navigation stack
                              context.push(
                                '/auth/change-password',
                                extra: {'isFirstTimeLogin': false},
                              );
                            },
                          ),
                          ProfileMenuItem(
                            icon: Assets.images.profile.studentProfile
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(
                                  context,
                                )?.profileStudentProfile ??
                                'Student Profile',
                            onTap: () {
                              // Navigate to student profile
                              context.push('/student-profile');
                            },
                          ),
                          ProfileMenuItem(
                            icon: Assets.images.profile.notification
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(
                                  context,
                                )?.dashboardNotificationSettings ??
                                'Notification Settings',
                            onTap: () {
                              // TODO: Navigate to notification settings
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.space6x),
                      ProfileMenuSection(
                        title:
                            AppLocalizations.of(
                              context,
                            )?.dashboardSupportTitle ??
                            'Support',
                        items: [
                          ProfileMenuItem(
                            icon: Assets.images.profile.documentGuide
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(
                                  context,
                                )?.dashboardUserGuide ??
                                'User Guide',
                            onTap: () {
                              // TODO: Navigate to user guide
                            },
                          ),
                          ProfileMenuItem(
                            icon: Assets.images.profile.videoGuide
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(
                                  context,
                                )?.dashboardVideoGuide ??
                                'Video Guide',
                            onTap: () {
                              // TODO: Navigate to video guide
                            },
                          ),
                          ProfileMenuItem(
                            icon: Assets.images.profile.usualQuestion
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(context)?.dashboardFAQ ??
                                'FAQ',
                            onTap: () {
                              // TODO: Navigate to FAQ
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.space6x),
                      ProfileMenuSection(
                        items: [
                          ProfileMenuItem(
                            icon: Assets.images.profile.signOut
                                .designSystemSvg(),
                            title:
                                AppLocalizations.of(context)?.dashboardLogout ??
                                'Logout',
                            onTap: () => _showLogoutConfirmation(context),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.space8x),
                    ]),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
