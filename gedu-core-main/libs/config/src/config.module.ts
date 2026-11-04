import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './configs/base.config';

const getEnvFilePaths = (): string[] => {
  const appName = process.env['APP_NAME'];
  const paths = [];
  if (appName) {
    paths.push(`.env.${appName}`);
  }

  paths.push('.env');

  return paths;
};

@Global()
@Module({})
export class ConfigModule {
  /**
   * Registers global configuration using provided BaseConfig descriptors.
   * - Loads config factories via `load`
   * - Applies combined Joi validation schema
   * - Resolves env files via APP_NAME-aware search
   */
  static forRoot(configs: BaseConfig[]): DynamicModule {
    if (!configs || configs.length === 0) {
      throw new Error('At least one configuration must be provided to ConfigModule.forRoot()');
    }
    return {
      module: ConfigModule,
      imports: [NestConfigModule.forRoot({
        isGlobal: true,
        load: configs.map(config => config.configuration),
        validationSchema: Joi.object(configs.reduce((acc, config) => ({ ...acc, ...config.validationSchema }), {})),
        envFilePath: getEnvFilePaths()
      })],
      providers: [],
      exports: [NestConfigModule],
    }
  }
}