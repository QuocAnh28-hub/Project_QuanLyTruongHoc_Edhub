import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { TeachingAssignmentsController } from './teaching-assignments.controller';
import { TeachingAssignmentsService } from './teaching-assignments.service';
import { TeachingAssignmentRepository } from './repository/teaching-assignment.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TeachingAssignmentsController],
  providers: [TeachingAssignmentsService, TeachingAssignmentRepository],
  exports: [TeachingAssignmentsService, TeachingAssignmentRepository],
})
export class TeachingAssignmentsModule {}

