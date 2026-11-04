extension NullableExtension<T> on T? {
  R? flatMap<R>(R Function(T) map) {
    final obj = this;
    if (obj == null) return null;
    return map(obj);
  }
}