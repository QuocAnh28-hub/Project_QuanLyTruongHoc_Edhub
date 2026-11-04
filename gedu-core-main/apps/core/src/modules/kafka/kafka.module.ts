import { Module } from "@nestjs/common";
import { KafkaTransportModule } from "@gedu/transport";
import { KAFKA_CORE_ARGS } from "./kafka.config";

@Module({
  imports: [
    KafkaTransportModule.registerAsync(KAFKA_CORE_ARGS)
  ],
  providers: [],
  exports: [
    KafkaTransportModule
  ]
})
/**
 * KafkaModule
 * Thin wrapper to register and re-export Kafka transport for the Core app.
 */
export class KafkaModule {}