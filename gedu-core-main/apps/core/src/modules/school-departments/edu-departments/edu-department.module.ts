import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { EduDepartmentService } from './edu-department.service';
import { EduDepartmentController } from './edu-department.controller';

@Module({
  imports: [PrismaModule, JwtModule ],
  controllers: [EduDepartmentController],
  providers: [EduDepartmentService],
})
export class EduDepartmentModule {}
