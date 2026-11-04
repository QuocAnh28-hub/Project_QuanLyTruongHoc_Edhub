import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}
  /**
   * Lifecycle hook called after module initialization.
   */
  onModuleInit() {
    this.logger.log("RedisService initialized");
  }

  /**
   * Lifecycle hook called before module destruction.
   */
  async onModuleDestroy() {
    this.logger.log("RedisService destroyed");
  }

  /**
   * Get a value from the cache.
   * @param key - The key to get the value for.
   * @returns The value from the cache.
   */
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  /**
   * Set a value in the cache.
   * @param key - The key to set the value for.
   * @param value - The value to set.
   * @param ttl - The time to live for the value in seconds.
   * @returns The value from the cache.
   */
  async set<T>(key: string, value: T, ttl?: number) {
    return this.cacheManager.set<T>(key, value, ttl);
  }

  /**
   * Delete a value from the cache.
   * @param key - The key to delete the value for.
   * @returns The value from the cache.
   */
  async del(key: string) {
    return this.cacheManager.del(key);
  }


  /**
   * Reset the cache.
   * @returns The value from the cache.
   */
  async reset() {
    if ('reset' in this.cacheManager && typeof this.cacheManager.reset === 'function') {
      return this.cacheManager.reset();
    }
    this.logger.warn("CacheManager does not have a reset method");
  }
}
