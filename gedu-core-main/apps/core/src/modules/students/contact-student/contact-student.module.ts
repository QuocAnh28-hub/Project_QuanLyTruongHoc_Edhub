import { ContactStudentController } from './contact-student.controller';
import { ContactStudentRepository } from './repository/contact-student.repository';
import { ContactStudentService } from './contact-student.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { StudentsModule } from '../students.module';

@Module({
  imports: [JwtModule, PrismaModule, StudentsModule],
  controllers: [ContactStudentController],
  providers: [ContactStudentRepository, ContactStudentService],
})
export class ContactStudentModule {}
