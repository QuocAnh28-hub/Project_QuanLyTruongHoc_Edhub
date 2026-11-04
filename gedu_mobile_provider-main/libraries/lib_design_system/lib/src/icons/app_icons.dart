import 'package:flutter/material.dart';

import 'icon_constants.dart';

/// Main app icons class that provides access to all design system icons
class AppIcons {
  AppIcons._();

  // Navigation Icons
  static const IconData home = IconConstants.home;
  static const IconData homeOutlined = IconConstants.homeOutlined;
  static const IconData profile = IconConstants.profile;
  static const IconData profileOutlined = IconConstants.profileOutlined;
  static const IconData settings = IconConstants.settings;
  static const IconData settingsOutlined = IconConstants.settingsOutlined;
  static const IconData search = IconConstants.search;
  static const IconData searchOutlined = IconConstants.searchOutlined;
  static const IconData notification = IconConstants.notification;
  static const IconData notificationOutlined =
      IconConstants.notificationOutlined;
  static const IconData menu = IconConstants.menu;
  static const IconData menuOpen = IconConstants.menuOpen;

  // Action Icons
  static const IconData add = IconConstants.add;
  static const IconData remove = IconConstants.remove;
  static const IconData edit = IconConstants.edit;
  static const IconData editOutlined = IconConstants.editOutlined;
  static const IconData delete = IconConstants.delete;
  static const IconData deleteOutlined = IconConstants.deleteOutlined;
  static const IconData close = IconConstants.close;
  static const IconData check = IconConstants.check;
  static const IconData checkCircle = IconConstants.checkCircle;
  static const IconData checkCircleOutlined = IconConstants.checkCircleOutlined;
  static const IconData error = IconConstants.error;
  static const IconData errorOutlined = IconConstants.errorOutlined;
  static const IconData warning = IconConstants.warning;
  static const IconData warningOutlined = IconConstants.warningOutlined;
  static const IconData info = IconConstants.info;
  static const IconData infoOutlined = IconConstants.infoOutlined;
  static const IconData success = IconConstants.success;
  static const IconData successOutlined = IconConstants.successOutlined;

  // Navigation Icons
  static const IconData back = IconConstants.back;
  static const IconData forward = IconConstants.forward;
  static const IconData up = IconConstants.up;
  static const IconData down = IconConstants.down;
  static const IconData left = IconConstants.left;
  static const IconData right = IconConstants.right;
  static const IconData expandMore = IconConstants.expandMore;
  static const IconData expandLess = IconConstants.expandLess;

  // Communication Icons
  static const IconData email = IconConstants.email;
  static const IconData emailOutlined = IconConstants.emailOutlined;
  static const IconData phone = IconConstants.phone;
  static const IconData phoneOutlined = IconConstants.phoneOutlined;
  static const IconData message = IconConstants.message;
  static const IconData messageOutlined = IconConstants.messageOutlined;
  static const IconData chat = IconConstants.chat;
  static const IconData chatOutlined = IconConstants.chatOutlined;

  // Media Icons
  static const IconData play = IconConstants.play;
  static const IconData pause = IconConstants.pause;
  static const IconData stop = IconConstants.stop;
  static const IconData skipNext = IconConstants.skipNext;
  static const IconData skipPrevious = IconConstants.skipPrevious;
  static const IconData volumeUp = IconConstants.volumeUp;
  static const IconData volumeDown = IconConstants.volumeDown;
  static const IconData volumeOff = IconConstants.volumeOff;
  static const IconData mic = IconConstants.mic;
  static const IconData micOff = IconConstants.micOff;
  static const IconData camera = IconConstants.camera;
  static const IconData cameraOutlined = IconConstants.cameraOutlined;
  static const IconData image = IconConstants.image;
  static const IconData imageOutlined = IconConstants.imageOutlined;
  static const IconData video = IconConstants.video;
  static const IconData videoOutlined = IconConstants.videoOutlined;

  // File Icons
  static const IconData file = IconConstants.file;
  static const IconData fileOutlined = IconConstants.fileOutlined;
  static const IconData folder = IconConstants.folder;
  static const IconData folderOutlined = IconConstants.folderOutlined;
  static const IconData download = IconConstants.download;
  static const IconData downloadOutlined = IconConstants.downloadOutlined;
  static const IconData upload = IconConstants.upload;
  static const IconData uploadOutlined = IconConstants.uploadOutlined;
  static const IconData share = IconConstants.share;
  static const IconData shareOutlined = IconConstants.shareOutlined;
  static const IconData print = IconConstants.print;
  static const IconData printOutlined = IconConstants.printOutlined;

  // Social Icons
  static const IconData like = IconConstants.like;
  static const IconData likeOutlined = IconConstants.likeOutlined;
  static const IconData dislike = IconConstants.dislike;
  static const IconData dislikeOutlined = IconConstants.dislikeOutlined;
  static const IconData star = IconConstants.star;
  static const IconData starOutlined = IconConstants.starOutlined;
  static const IconData bookmark = IconConstants.bookmark;
  static const IconData bookmarkOutlined = IconConstants.bookmarkOutlined;
  static const IconData flag = IconConstants.flag;
  static const IconData flagOutlined = IconConstants.flagOutlined;

  // Authentication Icons
  static const IconData lock = IconConstants.lock;
  static const IconData lockOutlined = IconConstants.lockOutlined;
  static const IconData lockOpen = IconConstants.lockOpen;
  static const IconData lockOpenOutlined = IconConstants.lockOpenOutlined;
  static const IconData visibility = IconConstants.visibility;
  static const IconData visibilityOff = IconConstants.visibilityOff;
  static const IconData login = IconConstants.login;
  static const IconData logout = IconConstants.logout;
  static const IconData accountCircle = IconConstants.accountCircle;
  static const IconData accountCircleOutlined =
      IconConstants.accountCircleOutlined;

  // Utility Icons
  static const IconData refresh = IconConstants.refresh;
  static const IconData sync = IconConstants.sync;
  static const IconData syncOutlined = IconConstants.syncOutlined;
  static const IconData loading = IconConstants.loading;
  static const IconData calendar = IconConstants.calendar;
  static const IconData calendarOutlined = IconConstants.calendarOutlined;
  static const IconData clock = IconConstants.clock;
  static const IconData clockOutlined = IconConstants.clockOutlined;
  static const IconData location = IconConstants.location;
  static const IconData locationOutlined = IconConstants.locationOutlined;
  static const IconData map = IconConstants.map;
  static const IconData mapOutlined = IconConstants.mapOutlined;
  static const IconData language = IconConstants.language;
  static const IconData languageOutlined = IconConstants.languageOutlined;
  static const IconData translate = IconConstants.translate;
  static const IconData translateOutlined = IconConstants.translateOutlined;

  /// Get icon with size
  static Icon getIconWithSize(IconData icon, double size) {
    return Icon(icon, size: size);
  }

  /// Get icon with color
  static Icon getIconWithColor(IconData icon, Color color) {
    return Icon(icon, color: color);
  }

  /// Get icon with size and color
  static Icon getIconWithSizeAndColor(IconData icon, double size, Color color) {
    return Icon(icon, size: size, color: color);
  }
}
