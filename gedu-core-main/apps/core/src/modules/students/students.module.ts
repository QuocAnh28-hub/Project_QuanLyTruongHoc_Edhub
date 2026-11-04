import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SchoolRepository } from '../schools/repository/school.repository';
import { UserRepository } from '../users/repository/user.repository';
import { ContactStudentRepository } from './contact-student/repository/contact-student.repository';
import { StudentFolderRepository } from './repository/student-folders.repository';
import { StudentMedicalInfoRepository } from './repository/student-medical-info.repository';
import { StudentsContactRepository } from './repository/students-contact.repository';
import { StudentsRepository } from './repository/students.repository';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    JwtModule,
  ],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    StudentsRepository,
    SchoolRepository,
    ContactStudentRepository,
    StudentMedicalInfoRepository,
    StudentFolderRepository,
    StudentsContactRepository,
    UserRepository
  ],
  exports: [
    StudentsRepository,
    ContactStudentRepository,
    StudentMedicalInfoRepository,
    StudentFolderRepository,
    StudentsService
  ],
})
export class StudentsModule { }
