import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

const buildRedisEventHandler = (redis: Keyv) => {
  redis.store.on('error', (error: any) => {
    console.error('Redis error', error);
  });
  redis.store.on('connect', () => {
    console.log('Redis connected');
  });
  redis.store.on('close', () => {
    console.log('Redis closed');
  });
}

@Module({
  imports: [CacheModule.registerAsync({
    useFactory: (configService: ConfigService) => {
      let redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
      if (!redisUrl.startsWith('redis://')) {
        redisUrl = `redis://${redisUrl}`
      }
      const redis = createKeyv({
        url: redisUrl,
      })
      buildRedisEventHandler(redis)
      return {
        stores: [redis],
      }
    },
    inject: [ConfigService],
  })],
  providers: [RedisService],
  exports: [CacheModule, RedisService],
})
export class RedisModule { }