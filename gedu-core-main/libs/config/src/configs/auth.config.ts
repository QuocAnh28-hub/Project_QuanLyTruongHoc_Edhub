import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

const authConfiguration = registerAs('auth', () => ({
  jwtSecret: process.env['JWT_SECRET'],
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || '1d',
}));

const authValidationSchema = {
  JWT_SECRET: Joi.string().optional().default('this-is-a-secret-key'),
  JWT_EXPIRES_IN: Joi.string().optional().default('1d'),
};

/** Injection token for AuthConfiguration (Nest ConfigModule). */
export const AUTH_CONFIG_KEY = authConfiguration.KEY;

/** BaseConfig registration for the auth configuration schema. */
export const authConfig: BaseConfig = {
  key: AUTH_CONFIG_KEY,
  configuration: authConfiguration,
  validationSchema: authValidationSchema,
};

export type AuthConfig = ConfigType<typeof authConfiguration>;