import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:lib_base/lib_base.dart';
import 'package:core_auth/core_auth.dart';
import 'package:core_storage/core_storage.dart' hide getIt;

import 'profile_event.dart';
import 'profile_state.dart';

@injectable
class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  static const String _tag = 'ProfileBloc';

  final GetAccountInfoUseCase _getAccountInfoUseCase;

  ProfileBloc(this._getAccountInfoUseCase) : super(const ProfileInitial()) {
    on<LoadProfileDataEvent>(_handleLoadProfileData);
  }

  final AppPreferences _appPreferences = getIt<AppPreferences>();

  /// Handle load profile data event - fetch auth info
  Future<void> _handleLoadProfileData(
    LoadProfileDataEvent event,
    Emitter<ProfileState> emit,
  ) async {
    try {
      Log.d('$_tag: Loading profile data');
      emit(const ProfileLoading());

      // Get account info from API
      final accountInfoResult = await _getAccountInfoUseCase.execute(
        const GetAccountInfoInput(),
      );

      if (accountInfoResult != null) {
        Log.d('$_tag: Profile data loaded successfully');
        Log.d('$_tag: Phone number from API: ${accountInfoResult.phone}');

        // Save phone number to storage if available
        final phone = accountInfoResult.phone;
        if (phone?.isNotEmpty == true) {
          await _appPreferences.saveUserPhoneNumber(phone!);
          Log.d('$_tag: Phone number saved to storage: $phone');
        } else {
          Log.d('$_tag: No phone number available from API');
        }

        emit(ProfileSuccess(accountInfo: accountInfoResult));
      } else {
        Log.d('$_tag: No profile data available');
        emit(const ProfileError('No profile data available'));
      }
    } catch (e) {
      Log.e('$_tag: Load profile data exception: $e');
      emit(ProfileError('Failed to load profile data: $e'));
    }
  }
}
