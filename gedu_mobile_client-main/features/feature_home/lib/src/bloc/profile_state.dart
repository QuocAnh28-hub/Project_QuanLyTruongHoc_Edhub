import 'package:lib_base/lib_base.dart';
import 'package:core_auth/core_auth.dart';

/// Profile state using BaseBlocState pattern
abstract class ProfileState extends BaseBlocState {
  const ProfileState();
}

/// Initial profile state
class ProfileInitial extends ProfileState {
  const ProfileInitial();
}

/// Loading profile state
class ProfileLoading extends ProfileState {
  const ProfileLoading();
}

/// Success profile state
class ProfileSuccess extends ProfileState {
  const ProfileSuccess({required this.accountInfo});

  final GetAccountInfoOutput accountInfo;

  @override
  List<Object?> get props => [accountInfo];
}

/// Error profile state
class ProfileError extends ProfileState {
  const ProfileError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
