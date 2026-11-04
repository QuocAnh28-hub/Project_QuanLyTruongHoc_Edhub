// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'common_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$ExceptionEmitted {

 AppExceptionWrapper get appExceptionWrapper;
/// Create a copy of ExceptionEmitted
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ExceptionEmittedCopyWith<ExceptionEmitted> get copyWith => _$ExceptionEmittedCopyWithImpl<ExceptionEmitted>(this as ExceptionEmitted, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ExceptionEmitted&&(identical(other.appExceptionWrapper, appExceptionWrapper) || other.appExceptionWrapper == appExceptionWrapper));
}


@override
int get hashCode => Object.hash(runtimeType,appExceptionWrapper);

@override
String toString() {
  return 'ExceptionEmitted(appExceptionWrapper: $appExceptionWrapper)';
}


}

/// @nodoc
abstract mixin class $ExceptionEmittedCopyWith<$Res>  {
  factory $ExceptionEmittedCopyWith(ExceptionEmitted value, $Res Function(ExceptionEmitted) _then) = _$ExceptionEmittedCopyWithImpl;
@useResult
$Res call({
 AppExceptionWrapper appExceptionWrapper
});




}
/// @nodoc
class _$ExceptionEmittedCopyWithImpl<$Res>
    implements $ExceptionEmittedCopyWith<$Res> {
  _$ExceptionEmittedCopyWithImpl(this._self, this._then);

  final ExceptionEmitted _self;
  final $Res Function(ExceptionEmitted) _then;

/// Create a copy of ExceptionEmitted
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? appExceptionWrapper = null,}) {
  return _then(_self.copyWith(
appExceptionWrapper: null == appExceptionWrapper ? _self.appExceptionWrapper : appExceptionWrapper // ignore: cast_nullable_to_non_nullable
as AppExceptionWrapper,
  ));
}

}


/// Adds pattern-matching-related methods to [ExceptionEmitted].
extension ExceptionEmittedPatterns on ExceptionEmitted {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ExceptionEmitted value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ExceptionEmitted() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ExceptionEmitted value)  $default,){
final _that = this;
switch (_that) {
case _ExceptionEmitted():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ExceptionEmitted value)?  $default,){
final _that = this;
switch (_that) {
case _ExceptionEmitted() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( AppExceptionWrapper appExceptionWrapper)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ExceptionEmitted() when $default != null:
return $default(_that.appExceptionWrapper);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( AppExceptionWrapper appExceptionWrapper)  $default,) {final _that = this;
switch (_that) {
case _ExceptionEmitted():
return $default(_that.appExceptionWrapper);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( AppExceptionWrapper appExceptionWrapper)?  $default,) {final _that = this;
switch (_that) {
case _ExceptionEmitted() when $default != null:
return $default(_that.appExceptionWrapper);case _:
  return null;

}
}

}

/// @nodoc


class _ExceptionEmitted extends ExceptionEmitted {
  const _ExceptionEmitted({required this.appExceptionWrapper}): super._();
  

@override final  AppExceptionWrapper appExceptionWrapper;

/// Create a copy of ExceptionEmitted
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ExceptionEmittedCopyWith<_ExceptionEmitted> get copyWith => __$ExceptionEmittedCopyWithImpl<_ExceptionEmitted>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ExceptionEmitted&&(identical(other.appExceptionWrapper, appExceptionWrapper) || other.appExceptionWrapper == appExceptionWrapper));
}


@override
int get hashCode => Object.hash(runtimeType,appExceptionWrapper);

@override
String toString() {
  return 'ExceptionEmitted(appExceptionWrapper: $appExceptionWrapper)';
}


}

/// @nodoc
abstract mixin class _$ExceptionEmittedCopyWith<$Res> implements $ExceptionEmittedCopyWith<$Res> {
  factory _$ExceptionEmittedCopyWith(_ExceptionEmitted value, $Res Function(_ExceptionEmitted) _then) = __$ExceptionEmittedCopyWithImpl;
@override @useResult
$Res call({
 AppExceptionWrapper appExceptionWrapper
});




}
/// @nodoc
class __$ExceptionEmittedCopyWithImpl<$Res>
    implements _$ExceptionEmittedCopyWith<$Res> {
  __$ExceptionEmittedCopyWithImpl(this._self, this._then);

  final _ExceptionEmitted _self;
  final $Res Function(_ExceptionEmitted) _then;

/// Create a copy of ExceptionEmitted
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? appExceptionWrapper = null,}) {
  return _then(_ExceptionEmitted(
appExceptionWrapper: null == appExceptionWrapper ? _self.appExceptionWrapper : appExceptionWrapper // ignore: cast_nullable_to_non_nullable
as AppExceptionWrapper,
  ));
}


}

/// @nodoc
mixin _$LoadingVisibilityEmitted {

 bool get isLoading;
/// Create a copy of LoadingVisibilityEmitted
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LoadingVisibilityEmittedCopyWith<LoadingVisibilityEmitted> get copyWith => _$LoadingVisibilityEmittedCopyWithImpl<LoadingVisibilityEmitted>(this as LoadingVisibilityEmitted, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LoadingVisibilityEmitted&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading);

@override
String toString() {
  return 'LoadingVisibilityEmitted(isLoading: $isLoading)';
}


}

/// @nodoc
abstract mixin class $LoadingVisibilityEmittedCopyWith<$Res>  {
  factory $LoadingVisibilityEmittedCopyWith(LoadingVisibilityEmitted value, $Res Function(LoadingVisibilityEmitted) _then) = _$LoadingVisibilityEmittedCopyWithImpl;
@useResult
$Res call({
 bool isLoading
});




}
/// @nodoc
class _$LoadingVisibilityEmittedCopyWithImpl<$Res>
    implements $LoadingVisibilityEmittedCopyWith<$Res> {
  _$LoadingVisibilityEmittedCopyWithImpl(this._self, this._then);

  final LoadingVisibilityEmitted _self;
  final $Res Function(LoadingVisibilityEmitted) _then;

/// Create a copy of LoadingVisibilityEmitted
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? isLoading = null,}) {
  return _then(_self.copyWith(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [LoadingVisibilityEmitted].
extension LoadingVisibilityEmittedPatterns on LoadingVisibilityEmitted {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LoadingVisibilityEmitted value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoadingVisibilityEmitted() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LoadingVisibilityEmitted value)  $default,){
final _that = this;
switch (_that) {
case _LoadingVisibilityEmitted():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LoadingVisibilityEmitted value)?  $default,){
final _that = this;
switch (_that) {
case _LoadingVisibilityEmitted() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool isLoading)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoadingVisibilityEmitted() when $default != null:
return $default(_that.isLoading);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool isLoading)  $default,) {final _that = this;
switch (_that) {
case _LoadingVisibilityEmitted():
return $default(_that.isLoading);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool isLoading)?  $default,) {final _that = this;
switch (_that) {
case _LoadingVisibilityEmitted() when $default != null:
return $default(_that.isLoading);case _:
  return null;

}
}

}

/// @nodoc


class _LoadingVisibilityEmitted extends LoadingVisibilityEmitted {
  const _LoadingVisibilityEmitted({required this.isLoading}): super._();
  

@override final  bool isLoading;

/// Create a copy of LoadingVisibilityEmitted
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoadingVisibilityEmittedCopyWith<_LoadingVisibilityEmitted> get copyWith => __$LoadingVisibilityEmittedCopyWithImpl<_LoadingVisibilityEmitted>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoadingVisibilityEmitted&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading));
}


@override
int get hashCode => Object.hash(runtimeType,isLoading);

@override
String toString() {
  return 'LoadingVisibilityEmitted(isLoading: $isLoading)';
}


}

/// @nodoc
abstract mixin class _$LoadingVisibilityEmittedCopyWith<$Res> implements $LoadingVisibilityEmittedCopyWith<$Res> {
  factory _$LoadingVisibilityEmittedCopyWith(_LoadingVisibilityEmitted value, $Res Function(_LoadingVisibilityEmitted) _then) = __$LoadingVisibilityEmittedCopyWithImpl;
@override @useResult
$Res call({
 bool isLoading
});




}
/// @nodoc
class __$LoadingVisibilityEmittedCopyWithImpl<$Res>
    implements _$LoadingVisibilityEmittedCopyWith<$Res> {
  __$LoadingVisibilityEmittedCopyWithImpl(this._self, this._then);

  final _LoadingVisibilityEmitted _self;
  final $Res Function(_LoadingVisibilityEmitted) _then;

/// Create a copy of LoadingVisibilityEmitted
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? isLoading = null,}) {
  return _then(_LoadingVisibilityEmitted(
isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$ShowSnackBarEvent {

 String get message; NotificationType get type;
/// Create a copy of ShowSnackBarEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ShowSnackBarEventCopyWith<ShowSnackBarEvent> get copyWith => _$ShowSnackBarEventCopyWithImpl<ShowSnackBarEvent>(this as ShowSnackBarEvent, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ShowSnackBarEvent&&(identical(other.message, message) || other.message == message)&&(identical(other.type, type) || other.type == type));
}


@override
int get hashCode => Object.hash(runtimeType,message,type);

@override
String toString() {
  return 'ShowSnackBarEvent(message: $message, type: $type)';
}


}

/// @nodoc
abstract mixin class $ShowSnackBarEventCopyWith<$Res>  {
  factory $ShowSnackBarEventCopyWith(ShowSnackBarEvent value, $Res Function(ShowSnackBarEvent) _then) = _$ShowSnackBarEventCopyWithImpl;
@useResult
$Res call({
 String message, NotificationType type
});




}
/// @nodoc
class _$ShowSnackBarEventCopyWithImpl<$Res>
    implements $ShowSnackBarEventCopyWith<$Res> {
  _$ShowSnackBarEventCopyWithImpl(this._self, this._then);

  final ShowSnackBarEvent _self;
  final $Res Function(ShowSnackBarEvent) _then;

/// Create a copy of ShowSnackBarEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? message = null,Object? type = null,}) {
  return _then(_self.copyWith(
message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as NotificationType,
  ));
}

}


/// Adds pattern-matching-related methods to [ShowSnackBarEvent].
extension ShowSnackBarEventPatterns on ShowSnackBarEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ShowSnackBarEvent value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ShowSnackBarEvent() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ShowSnackBarEvent value)  $default,){
final _that = this;
switch (_that) {
case _ShowSnackBarEvent():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ShowSnackBarEvent value)?  $default,){
final _that = this;
switch (_that) {
case _ShowSnackBarEvent() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String message,  NotificationType type)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ShowSnackBarEvent() when $default != null:
return $default(_that.message,_that.type);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String message,  NotificationType type)  $default,) {final _that = this;
switch (_that) {
case _ShowSnackBarEvent():
return $default(_that.message,_that.type);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String message,  NotificationType type)?  $default,) {final _that = this;
switch (_that) {
case _ShowSnackBarEvent() when $default != null:
return $default(_that.message,_that.type);case _:
  return null;

}
}

}

/// @nodoc


class _ShowSnackBarEvent extends ShowSnackBarEvent {
  const _ShowSnackBarEvent({required this.message, required this.type}): super._();
  

@override final  String message;
@override final  NotificationType type;

/// Create a copy of ShowSnackBarEvent
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ShowSnackBarEventCopyWith<_ShowSnackBarEvent> get copyWith => __$ShowSnackBarEventCopyWithImpl<_ShowSnackBarEvent>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ShowSnackBarEvent&&(identical(other.message, message) || other.message == message)&&(identical(other.type, type) || other.type == type));
}


@override
int get hashCode => Object.hash(runtimeType,message,type);

@override
String toString() {
  return 'ShowSnackBarEvent(message: $message, type: $type)';
}


}

/// @nodoc
abstract mixin class _$ShowSnackBarEventCopyWith<$Res> implements $ShowSnackBarEventCopyWith<$Res> {
  factory _$ShowSnackBarEventCopyWith(_ShowSnackBarEvent value, $Res Function(_ShowSnackBarEvent) _then) = __$ShowSnackBarEventCopyWithImpl;
@override @useResult
$Res call({
 String message, NotificationType type
});




}
/// @nodoc
class __$ShowSnackBarEventCopyWithImpl<$Res>
    implements _$ShowSnackBarEventCopyWith<$Res> {
  __$ShowSnackBarEventCopyWithImpl(this._self, this._then);

  final _ShowSnackBarEvent _self;
  final $Res Function(_ShowSnackBarEvent) _then;

/// Create a copy of ShowSnackBarEvent
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? message = null,Object? type = null,}) {
  return _then(_ShowSnackBarEvent(
message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as NotificationType,
  ));
}


}

// dart format on
