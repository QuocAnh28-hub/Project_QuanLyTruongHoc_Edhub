import { Keyv } from "keyv";
import { Logger } from "@nestjs/common";

export const buildRedisEventHandlers = (redis: Keyv, logger: Logger) => {
  redis.store.on('connect', () => { 
    logger.log('Redis connected');
  });
  redis.store.on('error', (error: any) => {
    logger.error('Redis error', error);
  });
  redis.store.on('reconnecting', () => {
    logger.log('Redis reconnecting');
  });
  redis.store.on('end', () => {
    logger.log('Redis disconnected');
  });
  redis.store.on('close', () => {
    logger.log('Redis closed');
  });
  redis.store.on('drain', () => {
    logger.log('Redis drained');
  });
  redis.store.on('idle', () => {
    logger.log('Redis idle');
  });
};