import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      clientId: 'email-service',
    },
    consumer: {
      groupId: 'email-consumer',
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
    }
  },
};