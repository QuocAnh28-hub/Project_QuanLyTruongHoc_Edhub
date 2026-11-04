import { GrpcOptions, Transport } from '@nestjs/microservices';
import { GrpcServiceConfig } from './grpc.interface';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Get the proto file path based on the environment
 * In development, protos are in the source directory
 * In production, protos are copied to the dist directory
 */
function getProtoPath(protoPath: string): string {
  const path = join(process.cwd(), 'assets', 'protos', protoPath);
  if (existsSync(path)) {
    return path;
  }
  return join(__dirname, 'protos', protoPath);
}

export function createGrpcOptions(options: GrpcServiceConfig): GrpcOptions {
  if (options.protoPaths.length !== options.packages.length) {
    throw new Error('The number of proto paths must match the number of package names.');
  }

  return {
    transport: Transport.GRPC,
    options: {
      url: options.url || `${options.host || '0.0.0.0'}:${options.port || 50051}`,
      package: options.packages,
      protoPath: options.protoPaths.map(getProtoPath),
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      },
      maxReceiveMessageLength: 1024 * 1024 * 50, // 50MB
      maxSendMessageLength: 1024 * 1024 * 50, // 50MB
    },
  };
}