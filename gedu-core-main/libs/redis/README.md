# @gedu/redis

A NestJS module for Redis caching integration using `@nestjs/cache-manager` and `@keyv/redis`.

## Features
- Global Redis caching service
- Easy configuration via module registration
- Built-in cache interceptor for automatic caching
- Type-safe cache operations
- Configurable TTL (Time To Live)
- Follows GEdu Core workspace conventions

## Installation

This module is part of the GEdu Core monorepo. Ensure you have:
```bash
pnpm add @nestjs/cache-manager @keyv/redis
```

## Usage

### Register Module
```typescript
import { RedisModule } from '@gedu/redis';

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost',
      port: 6379,
      ttl: 600000,
    }),
  ],
})
export class AppModule {}
```

### Use RedisService
```typescript
import { RedisService } from '@gedu/redis';

@Injectable()
export class YourService {
  constructor(private readonly redisService: RedisService) {}

  async getData(key: string) {
    return this.redisService.get(key);
  }
  async setData(key: string, value: any, ttl?: number) {
    await this.redisService.set(key, value, ttl);
  }
  async deleteData(key: string) {
    await this.redisService.del(key);
  }
  async clearCache() {
    await this.redisService.reset();
  }
}
```

### Use Cache Interceptor
```typescript
import { RedisInterceptor } from '@gedu/redis';

@Controller('your-controller')
@UseInterceptors(RedisInterceptor)
export class YourController {
  @Get('data')
  async getData() {
    return this.yourService.getData();
  }
}
```

## Configuration Options
See `RedisConfig` interface in the source for all options (host, port, url, ttl, etc).

## Best Practices
- Use meaningful cache keys
- Set appropriate TTLs
- Use cache interceptor for read-heavy endpoints
- Clear cache when data changes
- Handle cache misses gracefully

## Error Handling
- `get()` returns `undefined` for cache misses
- Always check for cache miss and fallback to DB/service

## Contributing
- Follow GEdu Core and NestJS best practices
- Add JSDoc to new exports
- Update this README for new features