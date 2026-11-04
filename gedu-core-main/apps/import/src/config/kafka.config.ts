import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { KAFKA_BUILT_IN_ARGS, KafkaConfiguration } from "@gedu/config";

export const KAFKA_SERVER_ARGS = (config: KafkaConfiguration): MicroserviceOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: config.brokers,
      clientId: 'gedu-import-service',
      connectionTimeout: 3000,
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    },
    consumer: {
      groupId: 'gedu-import-service',
      allowAutoTopicCreation: true,
      sessionTimeout: 45000,
      heartbeatInterval: 15000,
      maxWaitTimeInMs: 5000,
      maxBytesPerPartition: 1048576, // 1MB
      readUncommitted: false
    },
    subscribe: {
      fromBeginning: true
    }
  }
})

export const KAFKA_IMPORT_SERVICE = 'KAFKA_IMPORT_SERVICE';

export const KAFKA_IMPORT_ARGS = KAFKA_BUILT_IN_ARGS(
  KAFKA_IMPORT_SERVICE,
  'gedu-import-service',
  'gedu-import',
  false,
  undefined
);