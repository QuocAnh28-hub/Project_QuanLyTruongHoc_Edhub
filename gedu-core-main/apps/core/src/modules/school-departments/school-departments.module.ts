import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { SchoolDepartmentsController } from './school-departments.controller';
import { SchoolDepartmentsService } from './school-departments.service';
import { SharesModule } from '../shares/shares.module';

@Module({
  imports: [PrismaModule, JwtModule, SharesModule],
  controllers: [SchoolDepartmentsController],
  providers: [SchoolDepartmentsService],
})
export class SchoolDepartmentsModule {}
