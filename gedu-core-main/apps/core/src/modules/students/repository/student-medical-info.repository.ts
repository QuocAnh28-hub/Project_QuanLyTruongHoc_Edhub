import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';

@Injectable()
export class StudentMedicalInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentMedicalInfo(studentId: number) {
    return this.prisma.studentMedicalInfo.findMany({
      where: { studentId },
      select: {
        id: true,
        group: true,
        type: true,
        info: true,
      },
    });
  }
}
