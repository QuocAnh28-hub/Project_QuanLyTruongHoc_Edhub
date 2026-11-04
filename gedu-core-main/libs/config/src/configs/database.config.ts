import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';


/**
 * Database configuration wrapper for DI:
 * - key: injection token for ConfigModule
 * - configuration: registerAs('database') exposing { url }
 * - validationSchema: validates DATABASE_URL env var as a URI
 */
const databaseConfiguration = registerAs('database', () => ({
  url: process.env['DATABASE_URL'],
}));

const databaseValidationSchema = {
  DATABASE_URL: Joi.string().trim().uri().required(),
}; 

export const DATABASE_CONFIG_KEY = databaseConfiguration.KEY;

export const databaseConfig = {
  key: DATABASE_CONFIG_KEY,
  configuration: databaseConfiguration,
  validationSchema: databaseValidationSchema,
} as const satisfies BaseConfig;

export type DatabaseConfig = ConfigType<typeof databaseConfiguration>;