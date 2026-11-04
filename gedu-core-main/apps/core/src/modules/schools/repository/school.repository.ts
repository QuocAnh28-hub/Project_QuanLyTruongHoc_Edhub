import { PrismaService, School } from '@gedu/prisma';
import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from '../dto/create-schools.dto';

@Injectable()
export class SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSchoolById(id: number): Promise<School | null> {
    return this.prisma.school.findUnique({
      where: { id },
    });
  }

  findSchoolByCode(code: string): Promise<School | null> {
    return this.prisma.school.findUnique({
      where: { code },
    });
  }

  updateSchoolById(id: number, data: CreateSchoolDto): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data,
    });
  }
}
