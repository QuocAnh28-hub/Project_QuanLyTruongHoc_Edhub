// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'common_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$CommonState {

 AppExceptionWrapper? get appExceptionWrapper; int get loadingCount; bool get isLoading; SnackBarInfo? get snackBar;
/// Create a copy of CommonState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CommonStateCopyWith<CommonState> get copyWith => _$CommonStateCopyWithImpl<CommonState>(this as CommonState, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CommonState&&(identical(other.appExceptionWrapper, appExceptionWrapper) || other.appExceptionWrapper == appExceptionWrapper)&&(identical(other.loadingCount, loadingCount) || other.loadingCount == loadingCount)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.snackBar, snackBar) || other.snackBar == snackBar));
}


@override
int get hashCode => Object.hash(runtimeType,appExceptionWrapper,loadingCount,isLoading,snackBar);

@override
String toString() {
  return 'CommonState(appExceptionWrapper: $appExceptionWrapper, loadingCount: $loadingCount, isLoading: $isLoading, snackBar: $snackBar)';
}


}

/// @nodoc
abstract mixin class $CommonStateCopyWith<$Res>  {
  factory $CommonStateCopyWith(CommonState value, $Res Function(CommonState) _then) = _$CommonStateCopyWithImpl;
@useResult
$Res call({
 AppExceptionWrapper? appExceptionWrapper, int loadingCount, bool isLoading, SnackBarInfo? snackBar
});




}
/// @nodoc
class _$CommonStateCopyWithImpl<$Res>
    implements $CommonStateCopyWith<$Res> {
  _$CommonStateCopyWithImpl(this._self, this._then);

  final CommonState _self;
  final $Res Function(CommonState) _then;

/// Create a copy of CommonState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? appExceptionWrapper = freezed,Object? loadingCount = null,Object? isLoading = null,Object? snackBar = freezed,}) {
  return _then(_self.copyWith(
appExceptionWrapper: freezed == appExceptionWrapper ? _self.appExceptionWrapper : appExceptionWrapper // ignore: cast_nullable_to_non_nullable
as AppExceptionWrapper?,loadingCount: null == loadingCount ? _self.loadingCount : loadingCount // ignore: cast_nullable_to_non_nullable
as int,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,snackBar: freezed == snackBar ? _self.snackBar : snackBar // ignore: cast_nullable_to_non_nullable
as SnackBarInfo?,
  ));
}

}


/// Adds pattern-matching-related methods to [CommonState].
extension CommonStatePatterns on CommonState {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CommonState value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CommonState() when $default != null:
return $default(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CommonState value)  $default,){
final _that = this;
switch (_that) {
case _CommonState():
return $default(_that);case _:
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CommonState value)?  $default,){
final _that = this;
switch (_that) {
case _CommonState() when $default != null:
return $default(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( AppExceptionWrapper? appExceptionWrapper,  int loadingCount,  bool isLoading,  SnackBarInfo? snackBar)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CommonState() when $default != null:
return $default(_that.appExceptionWrapper,_that.loadingCount,_that.isLoading,_that.snackBar);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( AppExceptionWrapper? appExceptionWrapper,  int loadingCount,  bool isLoading,  SnackBarInfo? snackBar)  $default,) {final _that = this;
switch (_that) {
case _CommonState():
return $default(_that.appExceptionWrapper,_that.loadingCount,_that.isLoading,_that.snackBar);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( AppExceptionWrapper? appExceptionWrapper,  int loadingCount,  bool isLoading,  SnackBarInfo? snackBar)?  $default,) {final _that = this;
switch (_that) {
case _CommonState() when $default != null:
return $default(_that.appExceptionWrapper,_that.loadingCount,_that.isLoading,_that.snackBar);case _:
  return null;

}
}

}

/// @nodoc


class _CommonState extends CommonState {
  const _CommonState({this.appExceptionWrapper, this.loadingCount = 0, this.isLoading = false, this.snackBar}): super._();
  

@override final  AppExceptionWrapper? appExceptionWrapper;
@override@JsonKey() final  int loadingCount;
@override@JsonKey() final  bool isLoading;
@override final  SnackBarInfo? snackBar;

/// Create a copy of CommonState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CommonStateCopyWith<_CommonState> get copyWith => __$CommonStateCopyWithImpl<_CommonState>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CommonState&&(identical(other.appExceptionWrapper, appExceptionWrapper) || other.appExceptionWrapper == appExceptionWrapper)&&(identical(other.loadingCount, loadingCount) || other.loadingCount == loadingCount)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.snackBar, snackBar) || other.snackBar == snackBar));
}


@override
int get hashCode => Object.hash(runtimeType,appExceptionWrapper,loadingCount,isLoading,snackBar);

@override
String toString() {
  return 'CommonState(appExceptionWrapper: $appExceptionWrapper, loadingCount: $loadingCount, isLoading: $isLoading, snackBar: $snackBar)';
}


}

/// @nodoc
abstract mixin class _$CommonStateCopyWith<$Res> implements $CommonStateCopyWith<$Res> {
  factory _$CommonStateCopyWith(_CommonState value, $Res Function(_CommonState) _then) = __$CommonStateCopyWithImpl;
@override @useResult
$Res call({
 AppExceptionWrapper? appExceptionWrapper, int loadingCount, bool isLoading, SnackBarInfo? snackBar
});




}
/// @nodoc
class __$CommonStateCopyWithImpl<$Res>
    implements _$CommonStateCopyWith<$Res> {
  __$CommonStateCopyWithImpl(this._self, this._then);

  final _CommonState _self;
  final $Res Function(_CommonState) _then;

/// Create a copy of CommonState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? appExceptionWrapper = freezed,Object? loadingCount = null,Object? isLoading = null,Object? snackBar = freezed,}) {
  return _then(_CommonState(
appExceptionWrapper: freezed == appExceptionWrapper ? _self.appExceptionWrapper : appExceptionWrapper // ignore: cast_nullable_to_non_nullable
as AppExceptionWrapper?,loadingCount: null == loadingCount ? _self.loadingCount : loadingCount // ignore: cast_nullable_to_non_nullable
as int,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,snackBar: freezed == snackBar ? _self.snackBar : snackBar // ignore: cast_nullable_to_non_nullable
as SnackBarInfo?,
  ));
}


}

// dart format on
