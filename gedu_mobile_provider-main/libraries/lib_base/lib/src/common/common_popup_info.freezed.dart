// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'common_popup_info.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$CommonPopupInfo {

 String get title; String get message; String get primaryButtonLabel;
/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommonPopupInfoCopyWith<CommonPopupInfo> get copyWith => _$CommonPopupInfoCopyWithImpl<CommonPopupInfo>(this as CommonPopupInfo, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommonPopupInfo&&(identical(other.title, title) || other.title == title)&&(identical(other.message, message) || other.message == message)&&(identical(other.primaryButtonLabel, primaryButtonLabel) || other.primaryButtonLabel == primaryButtonLabel));
}


@override
int get hashCode => Object.hash(runtimeType,title,message,primaryButtonLabel);

@override
String toString() {
  return 'CommonPopupInfo(title: $title, message: $message, primaryButtonLabel: $primaryButtonLabel)';
}


}

/// @nodoc
abstract mixin class $CommonPopupInfoCopyWith<$Res>  {
  factory $CommonPopupInfoCopyWith(CommonPopupInfo value, $Res Function(CommonPopupInfo) _then) = _$CommonPopupInfoCopyWithImpl;
@useResult
$Res call({
 String title, String message, String primaryButtonLabel
});




}
/// @nodoc
class _$CommonPopupInfoCopyWithImpl<$Res>
    implements $CommonPopupInfoCopyWith<$Res> {
  _$CommonPopupInfoCopyWithImpl(this._self, this._then);

  final CommonPopupInfo _self;
  final $Res Function(CommonPopupInfo) _then;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? title = null,Object? message = null,Object? primaryButtonLabel = null,}) {
  return _then(_self.copyWith(
title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,primaryButtonLabel: null == primaryButtonLabel ? _self.primaryButtonLabel : primaryButtonLabel // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [CommonPopupInfo].
extension CommonPopupInfoPatterns on CommonPopupInfo {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _AlertDialog value)?  alertDialog,TResult Function( _ErrorDialog value)?  errorDialog,TResult Function( _ErrorPopupPage value)?  errorPopupPage,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AlertDialog() when alertDialog != null:
return alertDialog(_that);case _ErrorDialog() when errorDialog != null:
return errorDialog(_that);case _ErrorPopupPage() when errorPopupPage != null:
return errorPopupPage(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _AlertDialog value)  alertDialog,required TResult Function( _ErrorDialog value)  errorDialog,required TResult Function( _ErrorPopupPage value)  errorPopupPage,}){
final _that = this;
switch (_that) {
case _AlertDialog():
return alertDialog(_that);case _ErrorDialog():
return errorDialog(_that);case _ErrorPopupPage():
return errorPopupPage(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _AlertDialog value)?  alertDialog,TResult? Function( _ErrorDialog value)?  errorDialog,TResult? Function( _ErrorPopupPage value)?  errorPopupPage,}){
final _that = this;
switch (_that) {
case _AlertDialog() when alertDialog != null:
return alertDialog(_that);case _ErrorDialog() when errorDialog != null:
return errorDialog(_that);case _ErrorPopupPage() when errorPopupPage != null:
return errorPopupPage(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( String title,  String message,  String primaryButtonLabel,  List<String> bulletPoints,  VoidCallback? onPrimaryButtonClicked,  String? secondaryButtonLabel,  VoidCallback? onSecondaryButtonClicked,  Func0<void>? onPressed)?  alertDialog,TResult Function( String title,  String message,  String primaryButtonLabel,  VoidCallback? onPrimaryButtonClicked,  String? secondaryButtonLabel,  VoidCallback? onSecondaryButtonClicked,  Func0<void>? onRetryPressed)?  errorDialog,TResult Function( String title,  String message,  String primaryButtonLabel,  Pair<String, VoidCallback> primaryButton,  Pair<String, VoidCallback>? secondaryButton)?  errorPopupPage,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AlertDialog() when alertDialog != null:
return alertDialog(_that.title,_that.message,_that.primaryButtonLabel,_that.bulletPoints,_that.onPrimaryButtonClicked,_that.secondaryButtonLabel,_that.onSecondaryButtonClicked,_that.onPressed);case _ErrorDialog() when errorDialog != null:
return errorDialog(_that.title,_that.message,_that.primaryButtonLabel,_that.onPrimaryButtonClicked,_that.secondaryButtonLabel,_that.onSecondaryButtonClicked,_that.onRetryPressed);case _ErrorPopupPage() when errorPopupPage != null:
return errorPopupPage(_that.title,_that.message,_that.primaryButtonLabel,_that.primaryButton,_that.secondaryButton);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( String title,  String message,  String primaryButtonLabel,  List<String> bulletPoints,  VoidCallback? onPrimaryButtonClicked,  String? secondaryButtonLabel,  VoidCallback? onSecondaryButtonClicked,  Func0<void>? onPressed)  alertDialog,required TResult Function( String title,  String message,  String primaryButtonLabel,  VoidCallback? onPrimaryButtonClicked,  String? secondaryButtonLabel,  VoidCallback? onSecondaryButtonClicked,  Func0<void>? onRetryPressed)  errorDialog,required TResult Function( String title,  String message,  String primaryButtonLabel,  Pair<String, VoidCallback> primaryButton,  Pair<String, VoidCallback>? secondaryButton)  errorPopupPage,}) {final _that = this;
switch (_that) {
case _AlertDialog():
return alertDialog(_that.title,_that.message,_that.primaryButtonLabel,_that.bulletPoints,_that.onPrimaryButtonClicked,_that.secondaryButtonLabel,_that.onSecondaryButtonClicked,_that.onPressed);case _ErrorDialog():
return errorDialog(_that.title,_that.message,_that.primaryButtonLabel,_that.onPrimaryButtonClicked,_that.secondaryButtonLabel,_that.onSecondaryButtonClicked,_that.onRetryPressed);case _ErrorPopupPage():
return errorPopupPage(_that.title,_that.message,_that.primaryButtonLabel,_that.primaryButton,_that.secondaryButton);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( String title,  String message,  String primaryButtonLabel,  List<String> bulletPoints,  VoidCallback? onPrimaryButtonClicked,  String? secondaryButtonLabel,  VoidCallback? onSecondaryButtonClicked,  Func0<void>? onPressed)?  alertDialog,TResult? Function( String title,  String message,  String primaryButtonLabel,  VoidCallback? onPrimaryButtonClicked,  String? secondaryButtonLabel,  VoidCallback? onSecondaryButtonClicked,  Func0<void>? onRetryPressed)?  errorDialog,TResult? Function( String title,  String message,  String primaryButtonLabel,  Pair<String, VoidCallback> primaryButton,  Pair<String, VoidCallback>? secondaryButton)?  errorPopupPage,}) {final _that = this;
switch (_that) {
case _AlertDialog() when alertDialog != null:
return alertDialog(_that.title,_that.message,_that.primaryButtonLabel,_that.bulletPoints,_that.onPrimaryButtonClicked,_that.secondaryButtonLabel,_that.onSecondaryButtonClicked,_that.onPressed);case _ErrorDialog() when errorDialog != null:
return errorDialog(_that.title,_that.message,_that.primaryButtonLabel,_that.onPrimaryButtonClicked,_that.secondaryButtonLabel,_that.onSecondaryButtonClicked,_that.onRetryPressed);case _ErrorPopupPage() when errorPopupPage != null:
return errorPopupPage(_that.title,_that.message,_that.primaryButtonLabel,_that.primaryButton,_that.secondaryButton);case _:
  return null;

}
}

}

/// @nodoc


class _AlertDialog implements CommonPopupInfo {
  const _AlertDialog({this.title = '', this.message = '', this.primaryButtonLabel = '', final  List<String> bulletPoints = const [], this.onPrimaryButtonClicked, this.secondaryButtonLabel, this.onSecondaryButtonClicked, this.onPressed}): _bulletPoints = bulletPoints;
  

@override@JsonKey() final  String title;
@override@JsonKey() final  String message;
@override@JsonKey() final  String primaryButtonLabel;
 final  List<String> _bulletPoints;
@JsonKey() List<String> get bulletPoints {
  if (_bulletPoints is EqualUnmodifiableListView) return _bulletPoints;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_bulletPoints);
}

 final  VoidCallback? onPrimaryButtonClicked;
 final  String? secondaryButtonLabel;
 final  VoidCallback? onSecondaryButtonClicked;
 final  Func0<void>? onPressed;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AlertDialogCopyWith<_AlertDialog> get copyWith => __$AlertDialogCopyWithImpl<_AlertDialog>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AlertDialog&&(identical(other.title, title) || other.title == title)&&(identical(other.message, message) || other.message == message)&&(identical(other.primaryButtonLabel, primaryButtonLabel) || other.primaryButtonLabel == primaryButtonLabel)&&const DeepCollectionEquality().equals(other._bulletPoints, _bulletPoints)&&(identical(other.onPrimaryButtonClicked, onPrimaryButtonClicked) || other.onPrimaryButtonClicked == onPrimaryButtonClicked)&&(identical(other.secondaryButtonLabel, secondaryButtonLabel) || other.secondaryButtonLabel == secondaryButtonLabel)&&(identical(other.onSecondaryButtonClicked, onSecondaryButtonClicked) || other.onSecondaryButtonClicked == onSecondaryButtonClicked)&&(identical(other.onPressed, onPressed) || other.onPressed == onPressed));
}


@override
int get hashCode => Object.hash(runtimeType,title,message,primaryButtonLabel,const DeepCollectionEquality().hash(_bulletPoints),onPrimaryButtonClicked,secondaryButtonLabel,onSecondaryButtonClicked,onPressed);

@override
String toString() {
  return 'CommonPopupInfo.alertDialog(title: $title, message: $message, primaryButtonLabel: $primaryButtonLabel, bulletPoints: $bulletPoints, onPrimaryButtonClicked: $onPrimaryButtonClicked, secondaryButtonLabel: $secondaryButtonLabel, onSecondaryButtonClicked: $onSecondaryButtonClicked, onPressed: $onPressed)';
}


}

/// @nodoc
abstract mixin class _$AlertDialogCopyWith<$Res> implements $CommonPopupInfoCopyWith<$Res> {
  factory _$AlertDialogCopyWith(_AlertDialog value, $Res Function(_AlertDialog) _then) = __$AlertDialogCopyWithImpl;
@override @useResult
$Res call({
 String title, String message, String primaryButtonLabel, List<String> bulletPoints, VoidCallback? onPrimaryButtonClicked, String? secondaryButtonLabel, VoidCallback? onSecondaryButtonClicked, Func0<void>? onPressed
});




}
/// @nodoc
class __$AlertDialogCopyWithImpl<$Res>
    implements _$AlertDialogCopyWith<$Res> {
  __$AlertDialogCopyWithImpl(this._self, this._then);

  final _AlertDialog _self;
  final $Res Function(_AlertDialog) _then;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? title = null,Object? message = null,Object? primaryButtonLabel = null,Object? bulletPoints = null,Object? onPrimaryButtonClicked = freezed,Object? secondaryButtonLabel = freezed,Object? onSecondaryButtonClicked = freezed,Object? onPressed = freezed,}) {
  return _then(_AlertDialog(
title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,primaryButtonLabel: null == primaryButtonLabel ? _self.primaryButtonLabel : primaryButtonLabel // ignore: cast_nullable_to_non_nullable
as String,bulletPoints: null == bulletPoints ? _self._bulletPoints : bulletPoints // ignore: cast_nullable_to_non_nullable
as List<String>,onPrimaryButtonClicked: freezed == onPrimaryButtonClicked ? _self.onPrimaryButtonClicked : onPrimaryButtonClicked // ignore: cast_nullable_to_non_nullable
as VoidCallback?,secondaryButtonLabel: freezed == secondaryButtonLabel ? _self.secondaryButtonLabel : secondaryButtonLabel // ignore: cast_nullable_to_non_nullable
as String?,onSecondaryButtonClicked: freezed == onSecondaryButtonClicked ? _self.onSecondaryButtonClicked : onSecondaryButtonClicked // ignore: cast_nullable_to_non_nullable
as VoidCallback?,onPressed: freezed == onPressed ? _self.onPressed : onPressed // ignore: cast_nullable_to_non_nullable
as Func0<void>?,
  ));
}


}

/// @nodoc


class _ErrorDialog implements CommonPopupInfo {
  const _ErrorDialog({this.title = '', this.message = '', this.primaryButtonLabel = '', this.onPrimaryButtonClicked, this.secondaryButtonLabel, this.onSecondaryButtonClicked, this.onRetryPressed});
  

@override@JsonKey() final  String title;
@override@JsonKey() final  String message;
@override@JsonKey() final  String primaryButtonLabel;
 final  VoidCallback? onPrimaryButtonClicked;
 final  String? secondaryButtonLabel;
 final  VoidCallback? onSecondaryButtonClicked;
 final  Func0<void>? onRetryPressed;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ErrorDialogCopyWith<_ErrorDialog> get copyWith => __$ErrorDialogCopyWithImpl<_ErrorDialog>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ErrorDialog&&(identical(other.title, title) || other.title == title)&&(identical(other.message, message) || other.message == message)&&(identical(other.primaryButtonLabel, primaryButtonLabel) || other.primaryButtonLabel == primaryButtonLabel)&&(identical(other.onPrimaryButtonClicked, onPrimaryButtonClicked) || other.onPrimaryButtonClicked == onPrimaryButtonClicked)&&(identical(other.secondaryButtonLabel, secondaryButtonLabel) || other.secondaryButtonLabel == secondaryButtonLabel)&&(identical(other.onSecondaryButtonClicked, onSecondaryButtonClicked) || other.onSecondaryButtonClicked == onSecondaryButtonClicked)&&(identical(other.onRetryPressed, onRetryPressed) || other.onRetryPressed == onRetryPressed));
}


@override
int get hashCode => Object.hash(runtimeType,title,message,primaryButtonLabel,onPrimaryButtonClicked,secondaryButtonLabel,onSecondaryButtonClicked,onRetryPressed);

@override
String toString() {
  return 'CommonPopupInfo.errorDialog(title: $title, message: $message, primaryButtonLabel: $primaryButtonLabel, onPrimaryButtonClicked: $onPrimaryButtonClicked, secondaryButtonLabel: $secondaryButtonLabel, onSecondaryButtonClicked: $onSecondaryButtonClicked, onRetryPressed: $onRetryPressed)';
}


}

/// @nodoc
abstract mixin class _$ErrorDialogCopyWith<$Res> implements $CommonPopupInfoCopyWith<$Res> {
  factory _$ErrorDialogCopyWith(_ErrorDialog value, $Res Function(_ErrorDialog) _then) = __$ErrorDialogCopyWithImpl;
@override @useResult
$Res call({
 String title, String message, String primaryButtonLabel, VoidCallback? onPrimaryButtonClicked, String? secondaryButtonLabel, VoidCallback? onSecondaryButtonClicked, Func0<void>? onRetryPressed
});




}
/// @nodoc
class __$ErrorDialogCopyWithImpl<$Res>
    implements _$ErrorDialogCopyWith<$Res> {
  __$ErrorDialogCopyWithImpl(this._self, this._then);

  final _ErrorDialog _self;
  final $Res Function(_ErrorDialog) _then;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? title = null,Object? message = null,Object? primaryButtonLabel = null,Object? onPrimaryButtonClicked = freezed,Object? secondaryButtonLabel = freezed,Object? onSecondaryButtonClicked = freezed,Object? onRetryPressed = freezed,}) {
  return _then(_ErrorDialog(
title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,primaryButtonLabel: null == primaryButtonLabel ? _self.primaryButtonLabel : primaryButtonLabel // ignore: cast_nullable_to_non_nullable
as String,onPrimaryButtonClicked: freezed == onPrimaryButtonClicked ? _self.onPrimaryButtonClicked : onPrimaryButtonClicked // ignore: cast_nullable_to_non_nullable
as VoidCallback?,secondaryButtonLabel: freezed == secondaryButtonLabel ? _self.secondaryButtonLabel : secondaryButtonLabel // ignore: cast_nullable_to_non_nullable
as String?,onSecondaryButtonClicked: freezed == onSecondaryButtonClicked ? _self.onSecondaryButtonClicked : onSecondaryButtonClicked // ignore: cast_nullable_to_non_nullable
as VoidCallback?,onRetryPressed: freezed == onRetryPressed ? _self.onRetryPressed : onRetryPressed // ignore: cast_nullable_to_non_nullable
as Func0<void>?,
  ));
}


}

/// @nodoc


class _ErrorPopupPage implements CommonPopupInfo {
  const _ErrorPopupPage({this.title = '', this.message = '', this.primaryButtonLabel = '', required this.primaryButton, this.secondaryButton});
  

@override@JsonKey() final  String title;
@override@JsonKey() final  String message;
@override@JsonKey() final  String primaryButtonLabel;
 final  Pair<String, VoidCallback> primaryButton;
 final  Pair<String, VoidCallback>? secondaryButton;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ErrorPopupPageCopyWith<_ErrorPopupPage> get copyWith => __$ErrorPopupPageCopyWithImpl<_ErrorPopupPage>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ErrorPopupPage&&(identical(other.title, title) || other.title == title)&&(identical(other.message, message) || other.message == message)&&(identical(other.primaryButtonLabel, primaryButtonLabel) || other.primaryButtonLabel == primaryButtonLabel)&&(identical(other.primaryButton, primaryButton) || other.primaryButton == primaryButton)&&(identical(other.secondaryButton, secondaryButton) || other.secondaryButton == secondaryButton));
}


@override
int get hashCode => Object.hash(runtimeType,title,message,primaryButtonLabel,primaryButton,secondaryButton);

@override
String toString() {
  return 'CommonPopupInfo.errorPopupPage(title: $title, message: $message, primaryButtonLabel: $primaryButtonLabel, primaryButton: $primaryButton, secondaryButton: $secondaryButton)';
}


}

/// @nodoc
abstract mixin class _$ErrorPopupPageCopyWith<$Res> implements $CommonPopupInfoCopyWith<$Res> {
  factory _$ErrorPopupPageCopyWith(_ErrorPopupPage value, $Res Function(_ErrorPopupPage) _then) = __$ErrorPopupPageCopyWithImpl;
@override @useResult
$Res call({
 String title, String message, String primaryButtonLabel, Pair<String, VoidCallback> primaryButton, Pair<String, VoidCallback>? secondaryButton
});




}
/// @nodoc
class __$ErrorPopupPageCopyWithImpl<$Res>
    implements _$ErrorPopupPageCopyWith<$Res> {
  __$ErrorPopupPageCopyWithImpl(this._self, this._then);

  final _ErrorPopupPage _self;
  final $Res Function(_ErrorPopupPage) _then;

/// Create a copy of CommonPopupInfo
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? title = null,Object? message = null,Object? primaryButtonLabel = null,Object? primaryButton = null,Object? secondaryButton = freezed,}) {
  return _then(_ErrorPopupPage(
title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,primaryButtonLabel: null == primaryButtonLabel ? _self.primaryButtonLabel : primaryButtonLabel // ignore: cast_nullable_to_non_nullable
as String,primaryButton: null == primaryButton ? _self.primaryButton : primaryButton // ignore: cast_nullable_to_non_nullable
as Pair<String, VoidCallback>,secondaryButton: freezed == secondaryButton ? _self.secondaryButton : secondaryButton // ignore: cast_nullable_to_non_nullable
as Pair<String, VoidCallback>?,
  ));
}


}

// dart format on
