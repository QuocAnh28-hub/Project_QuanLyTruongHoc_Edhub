// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'field_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$FieldState<T,E> {

 T get value; E? get error;
/// Create a copy of FieldState
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$FieldStateCopyWith<T, E, FieldState<T, E>> get copyWith => _$FieldStateCopyWithImpl<T, E, FieldState<T, E>>(this as FieldState<T, E>, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is FieldState<T, E>&&const DeepCollectionEquality().equals(other.value, value)&&const DeepCollectionEquality().equals(other.error, error));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(value),const DeepCollectionEquality().hash(error));

@override
String toString() {
  return 'FieldState<$T, $E>(value: $value, error: $error)';
}


}

/// @nodoc
abstract mixin class $FieldStateCopyWith<T,E,$Res>  {
  factory $FieldStateCopyWith(FieldState<T, E> value, $Res Function(FieldState<T, E>) _then) = _$FieldStateCopyWithImpl;
@useResult
$Res call({
 T value, E? error
});




}
/// @nodoc
class _$FieldStateCopyWithImpl<T,E,$Res>
    implements $FieldStateCopyWith<T, E, $Res> {
  _$FieldStateCopyWithImpl(this._self, this._then);

  final FieldState<T, E> _self;
  final $Res Function(FieldState<T, E>) _then;

/// Create a copy of FieldState
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? value = freezed,Object? error = freezed,}) {
  return _then(_self.copyWith(
value: freezed == value ? _self.value : value // ignore: cast_nullable_to_non_nullable
as T,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as E?,
  ));
}

}


/// Adds pattern-matching-related methods to [FieldState].
extension FieldStatePatterns<T,E> on FieldState<T, E> {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _FieldState<T, E> value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _FieldState() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _FieldState<T, E> value)  $default,){
final _that = this;
switch (_that) {
case _FieldState():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _FieldState<T, E> value)?  $default,){
final _that = this;
switch (_that) {
case _FieldState() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( T value,  E? error)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _FieldState() when $default != null:
return $default(_that.value,_that.error);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( T value,  E? error)  $default,) {final _that = this;
switch (_that) {
case _FieldState():
return $default(_that.value,_that.error);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( T value,  E? error)?  $default,) {final _that = this;
switch (_that) {
case _FieldState() when $default != null:
return $default(_that.value,_that.error);case _:
  return null;

}
}

}

/// @nodoc


class _FieldState<T,E> implements FieldState<T, E> {
  const _FieldState({required this.value, this.error});
  

@override final  T value;
@override final  E? error;

/// Create a copy of FieldState
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$FieldStateCopyWith<T, E, _FieldState<T, E>> get copyWith => __$FieldStateCopyWithImpl<T, E, _FieldState<T, E>>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _FieldState<T, E>&&const DeepCollectionEquality().equals(other.value, value)&&const DeepCollectionEquality().equals(other.error, error));
}


@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(value),const DeepCollectionEquality().hash(error));

@override
String toString() {
  return 'FieldState<$T, $E>(value: $value, error: $error)';
}


}

/// @nodoc
abstract mixin class _$FieldStateCopyWith<T,E,$Res> implements $FieldStateCopyWith<T, E, $Res> {
  factory _$FieldStateCopyWith(_FieldState<T, E> value, $Res Function(_FieldState<T, E>) _then) = __$FieldStateCopyWithImpl;
@override @useResult
$Res call({
 T value, E? error
});




}
/// @nodoc
class __$FieldStateCopyWithImpl<T,E,$Res>
    implements _$FieldStateCopyWith<T, E, $Res> {
  __$FieldStateCopyWithImpl(this._self, this._then);

  final _FieldState<T, E> _self;
  final $Res Function(_FieldState<T, E>) _then;

/// Create a copy of FieldState
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? value = freezed,Object? error = freezed,}) {
  return _then(_FieldState<T, E>(
value: freezed == value ? _self.value : value // ignore: cast_nullable_to_non_nullable
as T,error: freezed == error ? _self.error : error // ignore: cast_nullable_to_non_nullable
as E?,
  ));
}


}

// dart format on
