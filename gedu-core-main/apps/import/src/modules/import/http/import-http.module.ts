import { Module } from "@nestjs/common";
import { ImportHttpController } from "./import-http.controller";
import { ImportHttpService } from "./import-http.service";
import { ImportRepository } from "../repositories/import.repository";
import { PrismaModule } from "@gedu/prisma";
import { KafkaTransportModule } from "@gedu/transport";
import { KAFKA_IMPORT_ARGS } from "../../../config/kafka.config";

@Module({
  imports: [
    PrismaModule,
    KafkaTransportModule.registerAsync(KAFKA_IMPORT_ARGS)
  ],
  controllers: [
    ImportHttpController
  ],
  providers: [
    ImportHttpService, 
    ImportRepository
  ],
})
export class ImportHttpModule {}  