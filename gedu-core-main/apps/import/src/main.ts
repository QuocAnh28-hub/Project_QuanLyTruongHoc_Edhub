import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { KAFKA_CONFIG_KEY, KafkaConfiguration } from '@gedu/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { KAFKA_SERVER_ARGS } from './config/kafka.config';

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.create(
    AppModule
  );
  const kafkaConfig = app.get<KafkaConfiguration>(KAFKA_CONFIG_KEY);
  app.connectMicroservice<MicroserviceOptions>(KAFKA_SERVER_ARGS(kafkaConfig));
  app.enableShutdownHooks();  
  await app.startAllMicroservices();
  
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `Import microservice is running and connected to Kafka at ${(kafkaConfig?.brokers ?? []).join(',') || 'N/A'}`
  );
  Logger.log(`Import microservice is running on port ${port}`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start import service:', error);
  process.exit(1);
});
