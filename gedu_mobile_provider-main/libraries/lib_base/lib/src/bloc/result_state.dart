sealed class ResultState<T> {
  const ResultState();
}

class Loading<T> extends ResultState<T> {
  const Loading();
}

class Success<T> extends ResultState<T> {
  final T data;

  const Success(this.data);
}

class Failure<T> extends ResultState<T> {
  final String message;

  const Failure(this.message);
}

abstract class EnabledStatusModel {
  bool get enable;
}

extension ResultStatusExt<T> on ResultState<T> {
  bool get isLoading => this is Loading<T>;

  T? get dataOrNull => switch (this) {
    Success(data: final data) => data,
    _ => null,
  };

  bool get isEnabled => switch (this) {
    Success(data: final data) when data is bool => data as bool,
    Success(data: final data) when data is EnabledStatusModel =>
    data.enable,
    _ => false,
  };
}