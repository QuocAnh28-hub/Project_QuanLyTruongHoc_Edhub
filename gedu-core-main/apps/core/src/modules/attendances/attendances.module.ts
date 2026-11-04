import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { AttendanceRepository } from './repository/attendance.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AttendancesController],
  providers: [AttendancesService, AttendanceRepository],
  exports: [AttendancesService, AttendanceRepository],
})
export class AttendancesModule {}

