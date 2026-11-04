import { ConfigType, registerAs } from '@nestjs/config';
import { BaseConfig } from './base.config';
import * as Joi from 'joi';

export const appConfiguration = registerAs('app', () => ({
  env: process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] || '3000', 10),
  name: process.env['APP_NAME'],
  enableSwagger: process.env['ENABLE_SWAGGER'] === 'true',
  apiPath: process.env['API_PATH'] || '/',
}));

const appValidationSchema = {
  NODE_ENV: Joi.string().valid('development', 'production', 'staging').default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().optional(),
  ENABLE_SWAGGER: Joi.boolean().default(false),
  API_PATH: Joi.string().optional().default('/'),
};

export const APP_CONFIG_KEY = appConfiguration.KEY;

export const appConfig: BaseConfig = {
  key: APP_CONFIG_KEY,
  configuration: appConfiguration,
  validationSchema: appValidationSchema,
};

export type AppConfig = ConfigType<typeof appConfiguration>;
