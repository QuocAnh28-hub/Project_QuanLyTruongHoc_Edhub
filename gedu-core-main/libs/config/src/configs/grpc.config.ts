import { ConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { BaseConfig } from './base.config';

const grpcConfiguration = registerAs('grpc', () => ({
  host: process.env['GRPC_IMPORT_HOST'],
  port: parseInt(process.env['GRPC_IMPORT_PORT'] || '50001', 10),
}));

const grpcValidationSchema = {
  GRPC_IMPORT_HOST: Joi.string().required(),
  GRPC_IMPORT_PORT: Joi.number().integer().min(1).max(65535).default(50001),
};

export const GRPC_CONFIG_KEY = grpcConfiguration.KEY;

export const grpcConfig: BaseConfig = {
  key: GRPC_CONFIG_KEY,
  configuration: grpcConfiguration,
  validationSchema: grpcValidationSchema,
};

export type GrpcConfiguration = ConfigType<typeof grpcConfiguration>;

/**
 * Builds the arguments/config used to register a gRPC client.
 * @param name Injection token or logical client name.
 * @param packages Protobuf package names to load.
 * @param protoPaths Paths to .proto files.
 * @returns Provider-like object with useFactory to resolve gRPC connection params.
 */
export const GRPC_BUILT_IN_ARGS = (
  name: string, 
  packages: string[], 
  protoPaths: string[]
) => ({
  name: name,
  useFactory: (grpcConfig: GrpcConfiguration) => ({
    name: name,
    host: grpcConfig.host,
    port: grpcConfig.port,
    url: `${grpcConfig.host}:${grpcConfig.port}`, 
    packages: packages,
    protoPaths: protoPaths,
  }),
  inject: [GRPC_CONFIG_KEY],
});