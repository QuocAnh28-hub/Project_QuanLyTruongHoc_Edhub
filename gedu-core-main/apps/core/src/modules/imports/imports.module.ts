import { ImportsController } from './controllers/imports.controller';
import { ImportsService } from './imports.service';
import { Module } from '@nestjs/common';
import { RedisService } from '@gedu/redis';
import { PrismaModule } from '@gedu/prisma';
import { SchoolImportGrpcController } from './controllers/school-import.grpc.controller';
import { SchoolsModule } from '../schools/schools.module';
import { StaffImportGrpcController } from './controllers/staff-import.grpc.controller';
import { StaffModule } from '../staff/staff.module';
import { StudentImportGrpcController } from "./controllers/student-import.grpc.controller";
import { StudentsModule } from "../students/students.module";
import { ImportRepository } from './repositories/import.repository';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    PrismaModule,
    SchoolsModule,
    StaffModule,
    StudentsModule,
    KafkaModule
  ],
  controllers: [
    ImportsController,
    StaffImportGrpcController,
    SchoolImportGrpcController,
    StudentImportGrpcController,
  ],
  providers: [
    ImportsService,
    ImportRepository,
    RedisService,
  ],
})
export class ImportsModule { }
