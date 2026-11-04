import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { SchoolRepository } from './repository/school.repository';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { EmailModule } from '@gedu/email';
import { KafkaModule } from '../kafka/kafka.module';
/**  
 * SchoolsModule wires Prisma and Kafka-backed email capabilities for school-related features.  
 * Email delivery is handled by the global EmailModule (registered in AppModule), which uses the app-level KafkaModule.
 */  
@Module({
  imports: [
    PrismaModule, 
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService, JwtService, SchoolRepository],
  exports: [SchoolsService],
})
export class SchoolsModule {}
