import 'package:lib_base/lib_base.dart';

/// Base class for profile events
abstract class ProfileEvent extends BaseBlocEvent {
  const ProfileEvent();
}

/// Event to load profile data
class LoadProfileDataEvent extends ProfileEvent {
  const LoadProfileDataEvent();

  @override
  List<Object?> get props => [];
}
