export interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  ttl?: number;
  lruSize?: number;
  max?: number;
  min?: number;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  showFriendlyErrorStack?: boolean;
  enableOfflineQueue?: boolean;
}