abstract class BaseInput {
  const BaseInput();
}

/// Base class for inputs that support caching
/// Use this for use cases that make network calls and can benefit from caching
abstract class CacheableInput extends BaseInput {
  /// Cache duration - Duration.zero means no caching
  final Duration cacheAge;

  const CacheableInput({
    this.cacheAge = Duration.zero,
  });
}

const expectedCacheAge = Duration(minutes: 5);