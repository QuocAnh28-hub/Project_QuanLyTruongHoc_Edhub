import { Injectable, Logger } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Injectable()
export class RedisInterceptor extends CacheInterceptor {
  private static logger = new Logger(RedisInterceptor.name);
  override trackBy(context: ExecutionContext): string | undefined {
    const key = super.trackBy(context);
    RedisInterceptor.logger.log(`Cache key: ${key}`);
    return (key as string | undefined) ?? undefined;
  }
}