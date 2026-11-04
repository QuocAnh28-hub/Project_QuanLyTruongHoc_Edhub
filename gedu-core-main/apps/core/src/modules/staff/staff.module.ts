import { EducationLevelController } from './education-levels/education-level.controller';
import { EducationLevelService } from './education-levels/education-level.service';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { StaffController } from './staff.controller';
import { StaffRepository } from './repository/school-staff.repository';
import { StaffService } from './staff.service';

/**  
 * StaffModule configures Prisma for staff-related features.
 * Email delivery is handled by the global EmailModule (registered in AppModule), which uses the app-level KafkaModule.
 * Exposes StaffController and provides StaffService, JwtService, and StaffRepository.
 */  
@Module({
  imports: [
    PrismaModule
  ],
  controllers: [StaffController, EducationLevelController],
  providers: [StaffService, JwtService, EducationLevelService, StaffRepository],
  exports: [
    StaffRepository,
  ],
})
export class StaffModule { }
