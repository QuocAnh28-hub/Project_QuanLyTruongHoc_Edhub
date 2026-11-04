import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesRepository } from './repository/classes.repository';
import { SchoolYearsRepository } from '../../school-years/repository/school-years.repository';
import { ClassesController } from './classes.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@gedu/prisma';
import { CurriculumRepository } from '../../curriculums/repository/curriculums.repository';
import { StaffRepository } from '../../staff/repository/school-staff.repository';
import { StudentsRepository } from '../../students/repository/students.repository';
import { ContactStudentRepository } from '../../students/contact-student/repository/contact-student.repository';

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [ClassesController],
  providers: [
    ClassesService,
    ClassesRepository,
    SchoolYearsRepository,
    CurriculumRepository,
    StaffRepository,
    ContactStudentRepository,
    StudentsRepository,
  ],
})
export class ClassesModule {}
