import 'package:go_router/go_router.dart';

/// App need to provide a manager and custom to add/remove none support feature
/// Use it to init the GoRouter
abstract class BaseNavigatorManager {
  String get authInitialLocation;

  String get mainInitialLocation;

  List<RouteBase> get authRoutes => [];

  List<RouteBase> get mainRoutes => [];
}