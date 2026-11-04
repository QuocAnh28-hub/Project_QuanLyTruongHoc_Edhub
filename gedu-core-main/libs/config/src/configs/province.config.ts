import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

const provinceConfiguration = registerAs('province', () => {
  const raw = process.env['PROVINCE_ID'];
  const parsed = raw ? parseInt(raw, 10) : 1;
  const id = Number.isFinite(parsed) && parsed >= 1 && parsed <= 99 ? parsed : 1;
  return { id };
});

export default provinceConfiguration;

const provinceValidationSchema = {
  PROVINCE_ID: Joi.number().integer().min(1).max(99).default(1),
};

export const PROVINCE_CONFIG_KEY = provinceConfiguration.KEY;

export const provinceConfig: BaseConfig = {
  key: PROVINCE_CONFIG_KEY,
  configuration: provinceConfiguration,
  validationSchema: provinceValidationSchema,
};

export type ProvinceConfig = ConfigType<typeof provinceConfiguration>; 