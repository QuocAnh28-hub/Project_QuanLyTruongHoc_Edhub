import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { AdministrativeUnitsModule } from './modules/administrative-units/administrative-units.module';
import { AuthModule } from './modules/auth/auth.module';
import { 
  appConfig, 
  authConfig, 
  ConfigModule as AppConfigModule, 
  databaseConfig, 
  kafkaConfig, 
  minioConfig, 
  provinceConfig, 
  REDIS_BUILT_IN_ARGS, 
  redisConfig, 
} from '@gedu/config';
import { ContactStudentModule } from './modules/students/contact-student/contact-student.module';
import { HealthModule } from './modules/health/health.module';
import { HttpModule } from '@gedu/http';
import { ImportsModule } from './modules/imports/imports.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { RedisModule } from '@gedu/redis';
import { SchoolDepartmentsModule } from './modules/school-departments/school-departments.module';
import { SchoolPositionsModule } from './modules/school-positions/school-positions.module';
import { SchoolYearsModule } from './modules/school-years/school-years.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { SeedModule } from './modules/seeds/seeds.module';
import { SharesModule } from './modules/shares/shares.module';
import { StaffModule } from './modules/staff/staff.module';
import { StaticModule } from './modules/static/static.module';
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { CurriculumsModule } from './modules/curriculums/curriculums.module';
import { ClassesModule } from './modules/schools/classes/classes.module';
import { EduDepartmentModule } from './modules/school-departments/edu-departments/edu-department.module';
import { EdPositionsModule } from './modules/school-departments/edu-departments/edu-positions/edu-position.module';
import { EduStaffModule } from './modules/school-departments/edu-departments/edu-staffs/edu-staffs.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { EmailModule } from '@gedu/email';

@Module({
  imports: [
    AppConfigModule.forRoot([
      appConfig,
      authConfig,
      databaseConfig,
      kafkaConfig,
      minioConfig,
      provinceConfig,
      redisConfig,
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 30,
      },
      {
        ttl: 3600, limit: 1000,
      },
    ]),
    HttpModule, // HttpModule is used to handle the request and response
    PrismaModule,
    KafkaModule,
    HealthModule,
    RedisModule.registerAsync(REDIS_BUILT_IN_ARGS),
    EmailModule.registerAsync({
      imports: [KafkaModule],
    }),
    // Application Modules
    AuthModule,
    SchoolsModule,
    UsersModule,
    ImportsModule,
    StaticModule,
    UploadModule,
    SharesModule,
    AdministrativeUnitsModule,
    StaffModule,
    StudentsModule,
    SchoolYearsModule,
    SchoolDepartmentsModule,
    SchoolPositionsModule,
    ContactStudentModule,
    CurriculumsModule,
    SeedModule,
    ClassesModule,
    SubjectsModule,
    EduDepartmentModule,
    EdPositionsModule,
    EduStaffModule  
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ThrottlerModule]
})
export class AppModule { }
