import { DynamicModule, Module, Logger, Provider, InjectionToken, ModuleMetadata } from '@nestjs/common';
import { ClientsModule, Transport, ClientKafka, ClientProviderOptions } from '@nestjs/microservices';
import { KAFKA_SERVICE } from './kafka.constant';
import { KafkaOption } from './kafka.interface';
import { KafkaService } from './kafka.service';

@Module({})
export class KafkaTransportModule {

  private static readonly logger = new Logger(KafkaTransportModule.name);

  /**
   * Register the KafkaTransportModule with a static configuration
   * @param option - The Kafka configuration options
   * @returns The KafkaTransportModule
   */
  static register(option: KafkaOption): DynamicModule {
    return this.registerAsync({
      name: KAFKA_SERVICE,
      useFactory: () => option,
    });
  }

  /**
   * Registers a Kafka client using a (sync or async) factory.
   * @param registerArgs.name Injection token for the client (mapped to KAFKA_SERVICE if different).
   * @param registerArgs.useFactory Factory producing KafkaOption (supports async).
   * @param registerArgs.imports Optional module imports for DI context.
   * @param registerArgs.inject Tokens to inject into the factory.
   */
  static registerAsync(registerArgs: {
    name?: string,
    useFactory: (...args: any[]) => KafkaOption,
    imports?: ModuleMetadata['imports'], 
    inject?: InjectionToken[],
  }): DynamicModule {
    const { useFactory, imports, inject } = registerArgs;
    const clients = {
      name: registerArgs.name || KAFKA_SERVICE,
      imports: imports || [],
      useFactory: (...args: any[]): ClientProviderOptions => {
        const option = useFactory(...args);
        return {
          name: registerArgs.name || KAFKA_SERVICE,
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: option.clientId,
              brokers: option.brokers,
              ssl: option.ssl || false,
              ...(option.sasl && { sasl: option.sasl }),
            },
            consumer: {
              groupId: option.groupId || `${option.clientId}-group`,
              allowAutoTopicCreation: true,
              maxWaitTimeInMs: 5000,
              retry: {
                initialRetryTime: 100,
                retries: 5,
              },
            },
            producer: {
              allowAutoTopicCreation: true,
              retry: {
                initialRetryTime: 100,
                retries: 5,
              },
            },
          },
        }
      },
      inject: inject || [],
    }
    const providers: Provider[] = [
      KafkaService,
      ...(registerArgs.name && registerArgs.name !== KAFKA_SERVICE
        ? [{
            provide: KAFKA_SERVICE,
            useFactory: (clientKafka: ClientKafka) => clientKafka,
            inject: [registerArgs.name],
          }]
        : [])
    ];
    return {
      module: KafkaTransportModule,
      imports: [
        ClientsModule.registerAsync([clients]),
      ],
      providers,
      exports: [
        ClientsModule, 
        KafkaService
      ]
    }
  }
} 