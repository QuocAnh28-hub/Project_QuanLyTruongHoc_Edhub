import { AppError, AppException, ORDER_ENUM } from '@gedu/shared';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import { SubjectResponseDto } from './dto/subject.response.dto';
import { UpdateSubjectRequestDto } from './dto/subject.request.dto';

@Injectable()
export class SubjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSubjectsWithCount(orgId: number) {
    const [subjects, total] = await this.prisma.$transaction([
      this.prisma.subject.findMany({
        orderBy: { id: ORDER_ENUM.DESC },
        where: { orgId },
        select: {
          id: true,
          code: true,
          name: true,
          orgId: true,
          canApply: true,
          departmentSubjects: {
            select: {
              department: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.subject.count({ where: { orgId } }),
    ]);

    const result = subjects.map((subject) => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      orgId: subject.orgId,
      canApply: subject.canApply,
      departments: subject.departmentSubjects.map((ds) => ds.department),
    }));

    return [result, total];
  }

  async findOneWithDetail(
    id: number,
    orgId: number,
  ): Promise<SubjectResponseDto> {
    const subject = await this.prisma.subject.findFirst({
      where: { id, orgId },
      select: {
        id: true,
        code: true,
        name: true,
        orgId: true,
        canApply: true,
        departmentSubjects: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!subject) throw new AppError(AppException.SUBJECT_NOT_FOUND);

    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      orgId: subject.orgId,
      canApply: subject.canApply,
      departments: subject.departmentSubjects.map((ds) => ds.department),
    };
  }

  async findCurriculumsGroupedBySubjectId(orgId: number, subjectId: number) {
    return this.prisma.curriculumSubject.findMany({
      where: { subjectId, orgId },
      select: {
        id: true,
        gradeLevel: true,
        type: true,
        commentsBased: true,
        scoringBased: true,
        lessonsPerWeek: true,
        curriculum: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        curriculumId: 'asc',
      },
    });
  }

  async activateSubject(subjectId: number, orgId: number) {
    const result = await this.prisma.subject.updateMany({
      where: { id: subjectId, orgId },
      data: { canApply: true },
    });
    if (result.count === 0) throw new AppError(AppException.SUBJECT_NOT_FOUND);
    return this.findOneWithDetail(subjectId, orgId);
  }

  async deactivateSubject(subjectId: number, orgId: number) {
    const result = await this.prisma.subject.updateMany({
      where: { id: subjectId, orgId },
      data: { canApply: false },
    });
    if (result.count === 0) throw new AppError(AppException.SUBJECT_NOT_FOUND);
    return this.findOneWithDetail(subjectId, orgId);
  }

  async updateSubject(
    subjectId: number,
    orgId: number,
    data: UpdateSubjectRequestDto,
  ) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId, orgId },
      select: {
        departmentSubjects: true,
      },
    });

    if (!subject) throw new AppError(AppException.SUBJECT_NOT_FOUND);

    return await this.prisma.$transaction(async (prisma) => {
      await prisma.departmentSubject.deleteMany({
        where: {
          subjectId,
          orgId,
        },
      });

      if (data.departments && data.departments.length > 0) {
        const departments = data.departments.map((dept) => ({
          subjectId,
          departmentId: dept,
          orgId,
        }));

        await prisma.departmentSubject.createMany({
          data: departments,
        });
      }

      return prisma.subject.findFirst({
        where: { id: subjectId, orgId },
        select: {
          id: true,
          departmentSubjects: {
            select: {
              department: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      });
    });
  }
}
