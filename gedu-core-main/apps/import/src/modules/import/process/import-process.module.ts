import { Module } from "@nestjs/common";
import { ImportRepository } from "../repositories/import.repository";
import { MinioModule } from "@gedu/minio";
import { EmailModule } from "@gedu/email";
import { GrpcModule } from "@gedu/transport";
import { KAFKA_IMPORT_ARGS } from "../../../config/kafka.config";
import { ImportProcessController } from "./import-process.controller";
import { ImportFactoryService } from "./services/factory/import-factory.service";
import { SchoolImportService } from "./services/school-import.service";
import { SchoolProcessor } from "./processors/school.processor";
import { StaffImportService } from "./services/staff-import.service";
import { StaffProcessor } from "./processors/staff.process";
import { StudentImportService } from "./services/student-import.service";
import { StudentProcessor } from "./processors/student.process";
import { PrismaModule } from "@gedu/prisma";
import { MINIO_BUILT_IN_ARGS } from "@gedu/config";
import { GRPC_IMPORT_ARGS } from "../../../config/grpc.config";
import { KafkaTransportModule } from "@gedu/transport";

@Module({
  imports: [
    MinioModule.registerAsync(MINIO_BUILT_IN_ARGS),
    PrismaModule,
    GrpcModule.registerAsync(GRPC_IMPORT_ARGS),
    EmailModule.registerAsync({
      imports: [KafkaTransportModule.registerAsync(KAFKA_IMPORT_ARGS)],
    }),
  ],
  controllers: [ImportProcessController],
  providers: [
    ImportRepository,
    SchoolImportService,
    SchoolProcessor,
    ImportFactoryService,
    StaffImportService,
    StaffProcessor,
    StudentImportService,
    StudentProcessor
  ]
})
export class ImportProcessModule {}