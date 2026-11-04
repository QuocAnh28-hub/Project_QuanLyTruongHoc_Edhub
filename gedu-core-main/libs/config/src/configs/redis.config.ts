import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

const redisConfiguration = registerAs('redis', () => ({
  url: process.env['REDIS_URL'],
}));

const redisValidationSchema = {
  REDIS_URL: Joi.string().required(),
}; 

export const REDIS_CONFIG_KEY = redisConfiguration.KEY;

export const redisConfig: BaseConfig = {
  key: REDIS_CONFIG_KEY,
  configuration: redisConfiguration,
  validationSchema: redisValidationSchema,
};

export type RedisConfiguration = ConfigType<typeof redisConfiguration>;

export const REDIS_BUILT_IN_ARGS = {
  useFactory: (redisConfig: RedisConfiguration) => {
    return {
      url: redisConfig.url,
      ttl: 60 * 10 * 1000, // in milliseconds
    }
  },
  inject: [REDIS_CONFIG_KEY],
}