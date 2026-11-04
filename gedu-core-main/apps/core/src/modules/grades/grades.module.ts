import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { GradeRepository } from './repository/grade.repository';

@Module({
  imports: [PrismaModule],
  controllers: [GradesController],
  providers: [GradesService, GradeRepository],
  exports: [GradesService, GradeRepository],
})
export class GradesModule {}

