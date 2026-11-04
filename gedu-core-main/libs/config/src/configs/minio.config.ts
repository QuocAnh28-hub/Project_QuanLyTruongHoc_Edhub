import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

const minioConfiguration = registerAs('minio', () => ({
  domain: process.env['MINIO_DOMAIN'],
  endpoint: process.env['MINIO_ENDPOINT'] || 'localhost',
  port: parseInt(process.env['MINIO_PORT'] || '9000', 10),
  accessKey: process.env['MINIO_ACCESS_KEY'] || 'minioadmin',
  secretKey: process.env['MINIO_SECRET_KEY'] || 'minioadmin',
}));

const minioValidationSchema = {
  MINIO_DOMAIN: Joi.string().allow('').optional(),
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_PORT: Joi.number().integer().min(1).max(65535).required(),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
};

export const MINIO_CONFIG_KEY = minioConfiguration.KEY;

export const minioConfig: BaseConfig = {
  key: MINIO_CONFIG_KEY,
  configuration: minioConfiguration,
  validationSchema: minioValidationSchema,
};

export type MinioConfig = ConfigType<typeof minioConfiguration>;

export const MINIO_BUILT_IN_ARGS = {
  useFactory: (minioConfig: MinioConfig) => {
    return {
      endpoint: minioConfig.endpoint,
      port: minioConfig.port,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
      useSSL: minioConfig.port === 443,
    }
  },
  inject: [MINIO_CONFIG_KEY],
}