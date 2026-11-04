import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:lib_design_system/gen/assets.gen.dart';

extension DaImage on AssetGenImage {
  Image designSystemImage({
    Key? key,
    bool matchTextDirection = false,
    AssetBundle? bundle,
    double? width,
    double? height,
    BoxFit fit = BoxFit.contain,
    AlignmentGeometry alignment = Alignment.center,
    bool allowDrawingOutsideViewBox = false,
    WidgetBuilder? placeholderBuilder,
    Color? color,
    BlendMode colorBlendMode = BlendMode.srcIn,
    String? semanticsLabel,
    bool excludeFromSemantics = false,
  }) =>
      image(
        key: key,
        matchTextDirection: matchTextDirection,
        bundle: bundle,
        package: 'lib_design_system',
        width: width,
        height: height,
        fit: fit,
        alignment: alignment,
        color: color,
        colorBlendMode: colorBlendMode,
        excludeFromSemantics: excludeFromSemantics,
      );
}

extension GEduSvg on SvgGenImage {
  SvgPicture designSystemSvg({
    Key? key,
    bool matchTextDirection = false,
    AssetBundle? bundle,
    double? width,
    double? height,
    BoxFit fit = BoxFit.contain,
    AlignmentGeometry alignment = Alignment.center,
    bool allowDrawingOutsideViewBox = false,
    WidgetBuilder? placeholderBuilder,
    Color? color,
    BlendMode colorBlendMode = BlendMode.srcIn,
    String? semanticsLabel,
    bool excludeFromSemantics = false,
    Clip clipBehavior = Clip.hardEdge,
    bool cacheColorFilter = false,
    SvgTheme? theme,
  }) => this.svg(
    matchTextDirection: matchTextDirection,
    bundle: bundle,
    package: 'lib_design_system',
    width: width,
    height: height,
    fit: fit,
    alignment: alignment,
    allowDrawingOutsideViewBox: allowDrawingOutsideViewBox,
    placeholderBuilder: placeholderBuilder,
    color: color,
    colorBlendMode: colorBlendMode,
    semanticsLabel: semanticsLabel,
    excludeFromSemantics: excludeFromSemantics,
    clipBehavior: clipBehavior,
    cacheColorFilter: cacheColorFilter,
    theme: theme,
  );
}
