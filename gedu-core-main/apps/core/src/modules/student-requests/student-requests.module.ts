import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { StudentRequestsController } from './student-requests.controller';
import { StudentRequestsService } from './student-requests.service';
import { StudentRequestRepository } from './repository/student-request.repository';

@Module({
  imports: [PrismaModule],
  controllers: [StudentRequestsController],
  providers: [StudentRequestsService, StudentRequestRepository],
  exports: [StudentRequestsService, StudentRequestRepository],
})
export class StudentRequestsModule {}

