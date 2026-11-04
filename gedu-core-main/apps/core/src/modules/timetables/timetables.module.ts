import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { TimetablesController } from './timetables.controller';
import { TimetablesService } from './timetables.service';
import { TimetableRepository } from './repository/timetable.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TimetablesController],
  providers: [TimetablesService, TimetableRepository],
  exports: [TimetablesService, TimetableRepository],
})
export class TimetablesModule {}

