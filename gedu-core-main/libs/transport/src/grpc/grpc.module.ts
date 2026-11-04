import { DynamicModule, Module, ModuleMetadata, InjectionToken } from '@nestjs/common';
import { ClientsModule, GrpcOptions  } from '@nestjs/microservices';
import { GrpcServiceConfig } from './grpc.interface';
import { createGrpcOptions } from './grpc.options';

@Module({})
export class GrpcModule {
  /**
   * Register one or multiple gRPC clients with static configuration.
   */
  static register(options: GrpcServiceConfig | GrpcServiceConfig[]): DynamicModule {
    const services = Array.isArray(options) ? options : [options];
    const clients = services.map((config: GrpcServiceConfig) => ({
      name: config.name,
      useFactory: () => createGrpcOptions(config),
    }));

    return {
      module: GrpcModule,
      imports: [
        ClientsModule.registerAsync(clients),
      ],
      exports: [ClientsModule],
    };
  }

  static registerService(service: GrpcServiceConfig): DynamicModule {
    return this.register([service]);
  }

  /**
   * Register a gRPC client using an async factory.
   * @param registerArgs.name Injection token/name for the client
   * @param registerArgs.useFactory Factory returning GrpcServiceConfig (sync/async)
   * @param registerArgs.imports Optional module imports for DI
   * @param registerArgs.inject Providers to inject into the factory
   */
  static registerAsync(registerArgs: {
    name: string,
    useFactory: (...args: any[]) => GrpcServiceConfig,
    imports?: ModuleMetadata['imports'],
    inject?: InjectionToken[],
  }): DynamicModule {
    const { useFactory, imports, inject } = registerArgs;
    const clients = {
      name: registerArgs.name,
      imports: imports || [],
      useFactory: (...args: any[]): GrpcOptions => {
        const option = useFactory(...args);
        return createGrpcOptions(option);
      },
      inject: inject || [],
    };

    return {
      module: GrpcModule,
      imports: [
        ClientsModule.registerAsync([clients]),
      ],
      exports: [ClientsModule],
    };
  } 
} 