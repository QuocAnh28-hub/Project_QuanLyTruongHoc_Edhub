import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import '../colors/app_colors.dart';
import '../colors/color_constants.dart';
import '../typography/app_typography.dart';

/// Shimmer loading widget with Lottie animation
class ShimmerLoading extends StatefulWidget {
  const ShimmerLoading({
    super.key,
    this.width,
    this.height,
    this.borderRadius,
    this.backgroundColor,
    this.animationPath,
  });

  final double? width;
  final double? height;
  final BorderRadius? borderRadius;
  final Color? backgroundColor;
  final String? animationPath;

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _animation = Tween<double>(begin: -1.0, end: 2.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.repeat();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius ?? BorderRadius.circular(8),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                widget.backgroundColor ??
                    AppColors.textSecondary.withValues(alpha: 0.1),
                widget.backgroundColor?.withValues(alpha: 0.3) ??
                    AppColors.textSecondary.withValues(alpha: 0.3),
                widget.backgroundColor ??
                    AppColors.textSecondary.withValues(alpha: 0.1),
              ],
              stops: [
                _animation.value - 0.3,
                _animation.value,
                _animation.value + 0.3,
              ],
            ),
          ),
        );
      },
    );
  }
}

/// Lottie-based loading widget
class LottieLoading extends StatelessWidget {
  const LottieLoading({
    super.key,
    this.width = 80,
    this.height = 80,
    this.fit = BoxFit.contain,
    this.repeat = true,
    this.reverse = false,
    this.animationPath,
    this.color,
  });

  final double width;
  final double height;
  final BoxFit fit;
  final bool repeat;
  final bool reverse;
  final String? animationPath;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final path = animationPath ?? 'assets/animation/loading_animation.json';

    return SizedBox(
      width: width,
      height: height,
      child: color != null
          ? ColorFiltered(
              colorFilter: ColorFilter.mode(color!, BlendMode.srcIn),
              child: Lottie.asset(
                path,
                width: width,
                height: height,
                fit: fit,
                repeat: repeat,
                reverse: reverse,
              ),
            )
          : Lottie.asset(
              path,
              width: width,
              height: height,
              fit: fit,
              repeat: repeat,
              reverse: reverse,
            ),
    );
  }
}

/// Full screen loading overlay
class LoadingOverlay extends StatelessWidget {
  const LoadingOverlay({
    super.key,
    this.backgroundColor,
    this.useLottie = true,
    this.animationPath,
    this.animationColor,
    this.message,
  });

  final Color? backgroundColor;
  final bool useLottie;
  final String? animationPath;
  final Color? animationColor;
  final String? message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: backgroundColor ?? Colors.transparent,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            useLottie
                ? LottieLoading(
                    animationPath: animationPath,
                    width: 80,
                    height: 80,
                    color: animationColor ?? ColorConstants.focusBlue,
                  )
                : const ShimmerLoading(
                    width: 80,
                    height: 80,
                    borderRadius: BorderRadius.all(Radius.circular(40)),
                  ),
            if (message != null) ...[
              const SizedBox(height: 16),
              Text(
                message!,
                style: AppTypography.bodyMedium.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                  decoration: TextDecoration.none,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Helper widgets for common loading patterns
class ShimmerText extends StatelessWidget {
  const ShimmerText({super.key, this.width, this.height = 16});

  final double? width;
  final double height;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      width: width,
      height: height,
      borderRadius: BorderRadius.circular(height / 2),
    );
  }
}

class ShimmerCard extends StatelessWidget {
  const ShimmerCard({super.key, this.width, this.height = 100});

  final double? width;
  final double height;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      width: width,
      height: height,
      borderRadius: BorderRadius.circular(8),
    );
  }
}

class ShimmerAvatar extends StatelessWidget {
  const ShimmerAvatar({super.key, this.size = 40});

  final double size;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      width: size,
      height: size,
      borderRadius: BorderRadius.circular(size / 2),
    );
  }
}

class ShimmerButton extends StatelessWidget {
  const ShimmerButton({super.key, this.width, this.height = 48});

  final double? width;
  final double height;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      width: width,
      height: height,
      borderRadius: BorderRadius.circular(8),
    );
  }
}
