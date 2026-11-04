import 'package:freezed_annotation/freezed_annotation.dart';

part 'field_state.freezed.dart';

@freezed
abstract class FieldState<T, E> with _$FieldState<T, E> {
  const factory FieldState({required T value, E? error}) = _FieldState;
}
