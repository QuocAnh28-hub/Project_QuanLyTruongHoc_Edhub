import 'package:flutter/material.dart';

import '../colors/color_constants.dart';
import '../widgets/shimmer_loading.dart';

/// Service for managing loading overlays throughout the app
class LoadingService {
  static final LoadingService _instance = LoadingService._internal();
  factory LoadingService() => _instance;
  LoadingService._internal();

  OverlayEntry? _currentOverlay;

  /// Show loading overlay with Lottie animation
  void showLottieLoading({
    required BuildContext context,
    String? animationPath,
    Color? animationColor,
    String? message,
  }) {
    hideLoading(); // Hide any existing loading

    _currentOverlay = OverlayEntry(
      builder: (context) => LoadingOverlay(
        useLottie: true,
        backgroundColor: Colors.black.withValues(alpha: 0.5),
        animationPath: animationPath,
        animationColor: animationColor ?? ColorConstants.focusBlue,
        message: message,
      ),
    );

    Overlay.of(context).insert(_currentOverlay!);
  }

  /// Show loading overlay with shimmer animation
  void showShimmerLoading({
    required BuildContext context,
    Color? animationColor,
    String? message,
  }) {
    hideLoading(); // Hide any existing loading

    _currentOverlay = OverlayEntry(
      builder: (context) => LoadingOverlay(
        useLottie: false,
        backgroundColor: Colors.black.withValues(alpha: 0.5),
        animationColor: animationColor ?? ColorConstants.focusBlue,
        message: message,
      ),
    );

    Overlay.of(context).insert(_currentOverlay!);
  }

  /// Show default loading overlay (Lottie)
  void showLoading({required BuildContext context, Color? animationColor}) {
    showLottieLoading(
      context: context,
      animationColor: animationColor ?? ColorConstants.focusBlue,
    );
  }

  /// Hide current loading overlay
  void hideLoading() {
    _currentOverlay?.remove();
    _currentOverlay = null;
  }

  /// Check if loading is currently shown
  bool get isLoading => _currentOverlay != null;
}

/// Extension for easy access to loading service
extension LoadingServiceExtension on BuildContext {
  LoadingService get loadingService => LoadingService();
}

/// Mixin for blocs to easily show/hide loading overlays
mixin LoadingOverlayMixin {
  LoadingService get _loadingService => LoadingService();

  /// Show loading overlay during API calls
  void showLoadingOverlay(
    BuildContext context, {
    String? animationPath,
    bool useShimmer = false,
    Color? animationColor,
  }) {
    if (useShimmer) {
      _loadingService.showShimmerLoading(
        context: context,
        animationColor: animationColor ?? ColorConstants.focusBlue,
      );
    } else {
      _loadingService.showLottieLoading(
        context: context,
        animationPath:
            animationPath ?? 'assets/animation/loading_animation.json',
        animationColor: animationColor ?? ColorConstants.focusBlue,
      );
    }
  }

  /// Hide loading overlay
  void hideLoadingOverlay() {
    _loadingService.hideLoading();
  }
}
