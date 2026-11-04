import { DynamicModule, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MINIO_OPTIONS } from './constants';
import { MinioOptions } from './types';

@Module({})
export class MinioModule {

  /**
   * Registers the MinioModule with static configuration options
   * @param options - MinIO connection and authentication options
   * @returns DynamicModule configured with MinioService
   */
  static register(options: MinioOptions): DynamicModule {
    return this.registerAsync({
      useFactory: () => options
    });
  }

  /**
   * Registers the MinioModule asynchronously with a custom factory
   * @param registerArgs - Configuration options for the module
   * @returns DynamicModule configured with MinioService
   */
  static registerAsync(registerArgs: {
    useFactory: (...args: any[]) => MinioOptions,
    imports?: any[], 
    inject?: any[],
  }): DynamicModule {
    const { useFactory, imports, inject } = registerArgs;
    return {
      module: MinioModule,
      imports: imports || [],
      providers: [
        MinioService,   
        {
          provide: MINIO_OPTIONS,
          useFactory: useFactory,
          inject: inject || [],
        },
      ],
      exports: [MinioService],
    }
  }
}
