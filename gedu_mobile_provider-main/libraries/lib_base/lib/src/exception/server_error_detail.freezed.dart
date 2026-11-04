// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'server_error_detail.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ServerErrorDetail implements DiagnosticableTreeMixin {

/// server-defined error code
 int? get code;/// server-defined status code
 String get serverStatusCode;/// server-defined message
 String get message;/// server-defined field
 String get field;/// server-defined type enum
 String get type;
/// Create a copy of ServerErrorDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ServerErrorDetailCopyWith<ServerErrorDetail> get copyWith => _$ServerErrorDetailCopyWithImpl<ServerErrorDetail>(this as ServerErrorDetail, _$identity);

  /// Serializes this ServerErrorDetail to a JSON map.
  Map<String, dynamic> toJson();

@override
void debugFillProperties(DiagnosticPropertiesBuilder properties) {
  properties
    ..add(DiagnosticsProperty('type', 'ServerErrorDetail'))
    ..add(DiagnosticsProperty('code', code))..add(DiagnosticsProperty('serverStatusCode', serverStatusCode))..add(DiagnosticsProperty('message', message))..add(DiagnosticsProperty('field', field))..add(DiagnosticsProperty('type', type));
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ServerErrorDetail&&(identical(other.code, code) || other.code == code)&&(identical(other.serverStatusCode, serverStatusCode) || other.serverStatusCode == serverStatusCode)&&(identical(other.message, message) || other.message == message)&&(identical(other.field, field) || other.field == field)&&(identical(other.type, type) || other.type == type));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,code,serverStatusCode,message,field,type);

@override
String toString({ DiagnosticLevel minLevel = DiagnosticLevel.info }) {
  return 'ServerErrorDetail(code: $code, serverStatusCode: $serverStatusCode, message: $message, field: $field, type: $type)';
}


}

/// @nodoc
abstract mixin class $ServerErrorDetailCopyWith<$Res>  {
  factory $ServerErrorDetailCopyWith(ServerErrorDetail value, $Res Function(ServerErrorDetail) _then) = _$ServerErrorDetailCopyWithImpl;
@useResult
$Res call({
 int? code, String serverStatusCode, String message, String field, String type
});




}
/// @nodoc
class _$ServerErrorDetailCopyWithImpl<$Res>
    implements $ServerErrorDetailCopyWith<$Res> {
  _$ServerErrorDetailCopyWithImpl(this._self, this._then);

  final ServerErrorDetail _self;
  final $Res Function(ServerErrorDetail) _then;

/// Create a copy of ServerErrorDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? code = freezed,Object? serverStatusCode = null,Object? message = null,Object? field = null,Object? type = null,}) {
  return _then(_self.copyWith(
code: freezed == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as int?,serverStatusCode: null == serverStatusCode ? _self.serverStatusCode : serverStatusCode // ignore: cast_nullable_to_non_nullable
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,field: null == field ? _self.field : field // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ServerErrorDetail].
extension ServerErrorDetailPatterns on ServerErrorDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ServerErrorDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ServerErrorDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ServerErrorDetail value)  $default,){
final _that = this;
switch (_that) {
case _ServerErrorDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ServerErrorDetail value)?  $default,){
final _that = this;
switch (_that) {
case _ServerErrorDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int? code,  String serverStatusCode,  String message,  String field,  String type)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ServerErrorDetail() when $default != null:
return $default(_that.code,_that.serverStatusCode,_that.message,_that.field,_that.type);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int? code,  String serverStatusCode,  String message,  String field,  String type)  $default,) {final _that = this;
switch (_that) {
case _ServerErrorDetail():
return $default(_that.code,_that.serverStatusCode,_that.message,_that.field,_that.type);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int? code,  String serverStatusCode,  String message,  String field,  String type)?  $default,) {final _that = this;
switch (_that) {
case _ServerErrorDetail() when $default != null:
return $default(_that.code,_that.serverStatusCode,_that.message,_that.field,_that.type);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ServerErrorDetail with DiagnosticableTreeMixin implements ServerErrorDetail {
  const _ServerErrorDetail({this.code, this.serverStatusCode = '-1', this.message = '', this.field = '', this.type = ''});
  factory _ServerErrorDetail.fromJson(Map<String, dynamic> json) => _$ServerErrorDetailFromJson(json);

/// server-defined error code
@override final  int? code;
/// server-defined status code
@override@JsonKey() final  String serverStatusCode;
/// server-defined message
@override@JsonKey() final  String message;
/// server-defined field
@override@JsonKey() final  String field;
/// server-defined type enum
@override@JsonKey() final  String type;

/// Create a copy of ServerErrorDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ServerErrorDetailCopyWith<_ServerErrorDetail> get copyWith => __$ServerErrorDetailCopyWithImpl<_ServerErrorDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ServerErrorDetailToJson(this, );
}
@override
void debugFillProperties(DiagnosticPropertiesBuilder properties) {
  properties
    ..add(DiagnosticsProperty('type', 'ServerErrorDetail'))
    ..add(DiagnosticsProperty('code', code))..add(DiagnosticsProperty('serverStatusCode', serverStatusCode))..add(DiagnosticsProperty('message', message))..add(DiagnosticsProperty('field', field))..add(DiagnosticsProperty('type', type));
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ServerErrorDetail&&(identical(other.code, code) || other.code == code)&&(identical(other.serverStatusCode, serverStatusCode) || other.serverStatusCode == serverStatusCode)&&(identical(other.message, message) || other.message == message)&&(identical(other.field, field) || other.field == field)&&(identical(other.type, type) || other.type == type));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,code,serverStatusCode,message,field,type);

@override
String toString({ DiagnosticLevel minLevel = DiagnosticLevel.info }) {
  return 'ServerErrorDetail(code: $code, serverStatusCode: $serverStatusCode, message: $message, field: $field, type: $type)';
}


}

/// @nodoc
abstract mixin class _$ServerErrorDetailCopyWith<$Res> implements $ServerErrorDetailCopyWith<$Res> {
  factory _$ServerErrorDetailCopyWith(_ServerErrorDetail value, $Res Function(_ServerErrorDetail) _then) = __$ServerErrorDetailCopyWithImpl;
@override @useResult
$Res call({
 int? code, String serverStatusCode, String message, String field, String type
});




}
/// @nodoc
class __$ServerErrorDetailCopyWithImpl<$Res>
    implements _$ServerErrorDetailCopyWith<$Res> {
  __$ServerErrorDetailCopyWithImpl(this._self, this._then);

  final _ServerErrorDetail _self;
  final $Res Function(_ServerErrorDetail) _then;

/// Create a copy of ServerErrorDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? code = freezed,Object? serverStatusCode = null,Object? message = null,Object? field = null,Object? type = null,}) {
  return _then(_ServerErrorDetail(
code: freezed == code ? _self.code : code // ignore: cast_nullable_to_non_nullable
as int?,serverStatusCode: null == serverStatusCode ? _self.serverStatusCode : serverStatusCode // ignore: cast_nullable_to_non_nullable
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,field: null == field ? _self.field : field // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
