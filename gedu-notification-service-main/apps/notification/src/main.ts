/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConfig } from './config/kafka.config';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule, 
  );
  app.enableCors()
  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3005, '0.0.0.0');
  
  Logger.log(`Microservice is running on Kafka!`);
  Logger.log(`Email microservice is listening on port ${process.env.PORT || 3005}`);
}

bootstrap();
