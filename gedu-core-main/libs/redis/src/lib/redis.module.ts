import { DynamicModule, Global, InjectionToken, Logger, Module, ModuleMetadata } from '@nestjs/common';
import { createKeyv, Keyv } from '@keyv/redis';
import { RedisConfig } from './redis.interface';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { buildRedisEventHandlers } from './redis.handler';

@Global()
@Module({})
export class RedisModule {
  private static logger = new Logger(RedisModule.name);
  /**
   * Register the RedisModule
   * @param config - The configuration for the RedisModule
   * @returns The RedisModule
   */
  static register(config: RedisConfig): DynamicModule {
    return this.registerAsync({
      useFactory: () => config,
    });
  }

  /**
   * Register the RedisModule asynchronously
   * @param registerArgs - The configuration for the RedisModule
   * @param imports - The imports for the RedisModule
   * @param inject - The inject for the RedisModule
   * @returns The RedisModule
   */
  static registerAsync(registerArgs: {
    useFactory: (...args: any[]) => RedisConfig,
    imports?: ModuleMetadata['imports'],
    inject?: InjectionToken[],
  }): DynamicModule {
    const { useFactory, imports, inject } = registerArgs;
    return {
      module: RedisModule,
      imports: [
        CacheModule.registerAsync({
          imports: imports || [],
          useFactory: (...args: any[]) => {
            const config = useFactory(...args);
            let stores: any[] = [];
            if (!config.url && (!config.host || !config.port)) {
              RedisModule.logger.warn('No Redis URL or host provided, using in-memory cache');
              stores = [
                new Keyv({
                  store: new CacheableMemory({ ttl: config.ttl || 60 * 10 * 1000, lruSize: 5000 }),
                }),
              ];
            } else {
              let uri = `${config.url || `${config.host}:${config.port}`}`;
              uri = uri.startsWith('redis://') ? uri : `redis://${uri}`;
              RedisModule.logger.log(`Using Redis URL: ${uri}`);
              const redisStore = createKeyv({
                url: uri,
                socket: {
                  reconnectStrategy: (retries) => {
                    if (retries > 10) {
                      return new Error('Redis connection failed');
                    }
                    return 1000;
                  },
                },
                pingInterval: 10 * 1000,
              }, {
                throwOnConnectError: false,
                clearBatchSize: 1000,
              });
              buildRedisEventHandlers(redisStore, RedisModule.logger);
              stores = [redisStore];
            }
            return {
              stores,
              ttl: config.ttl || 60 * 10 * 1000, // in milliseconds
            }
          },
          inject: inject || [],
        }),
      ],
      providers: [
        RedisService,
      ],
      exports: [CacheModule, RedisService],
    }
  }
}
