import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import { BulkRecordScoreDto } from '../dto/grade.dto';

@Injectable()
export class GradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getClassStudents(orgId: number, classId: number) {
    return this.prisma.studentClass.findMany({
      where: {
        orgId,
        classId,
        status: { in: [1, 2] },
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: [
        { student: { user: { lastName: 'asc' } } },
        { student: { user: { firstName: 'asc' } } },
      ],
    });
  }

  async resolveSemesterId(
    orgId: number,
    semesterId?: number,
    schoolYearId?: number,
  ): Promise<number | undefined> {
    if (!semesterId) return undefined;
    const direct = await this.prisma.semester.findFirst({
      where: { id: semesterId, orgId },
    });
    if (direct) return direct.id;

    const sems = await this.prisma.semester.findMany({
      where: { orgId, ...(schoolYearId ? { schoolYearId } : {}) },
      orderBy: { id: 'asc' },
    });
    if (sems.length >= semesterId && semesterId > 0) {
      return sems[semesterId - 1].id;
    }
    if (sems.length > 0) {
      return sems[0].id;
    }
    return semesterId;
  }

  async bulkUpsertScores(
    orgId: number,
    classId: number,
    dto: BulkRecordScoreDto,
  ) {
    const resolvedSemesterId =
      (await this.resolveSemesterId(orgId, dto.semesterId, dto.schoolYearId)) ??
      dto.semesterId;

    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.scores) {
        // Find existing score entry
        const existing = await tx.scoreEntry.findFirst({
          where: {
            orgId,
            classId,
            studentId: item.studentId,
            subjectId: dto.subjectId,
            schoolYearId: dto.schoolYearId,
            semesterId: resolvedSemesterId,
            scoreType: dto.scoreType,
          },
        });

        if (existing) {
          await tx.scoreEntry.update({
            where: { id: existing.id },
            data: {
              scoreValue: item.scoreValue ?? null,
              comment: item.comment ?? null,
            },
          });
        } else {
          await tx.scoreEntry.create({
            data: {
              orgId,
              classId,
              studentId: item.studentId,
              subjectId: dto.subjectId,
              schoolYearId: dto.schoolYearId,
              semesterId: resolvedSemesterId,
              scoreType: dto.scoreType,
              scoreValue: item.scoreValue ?? null,
              comment: item.comment ?? null,
            },
          });
        }
      }

      return {
        success: true,
        count: dto.scores.length,
      };
    });
  }

  async findClassSubjectScores(
    orgId: number,
    classId: number,
    subjectId: number,
    schoolYearId: number,
    semesterId: number,
  ) {
    const resolvedSemesterId =
      (await this.resolveSemesterId(orgId, semesterId, schoolYearId)) ??
      semesterId;

    return this.prisma.scoreEntry.findMany({
      where: {
        orgId,
        classId,
        subjectId,
        schoolYearId,
        semesterId: resolvedSemesterId,
      },
      include: {
        student: {
          select: {
            id: true,
            code: true,
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async findSummaries(
    orgId: number,
    classId: number,
    subjectId: number,
    schoolYearId: number,
    semesterId: number,
  ) {
    const resolvedSemesterId =
      (await this.resolveSemesterId(orgId, semesterId, schoolYearId)) ??
      semesterId;

    return this.prisma.subjectSemesterSummary.findMany({
      where: {
        orgId,
        classId,
        subjectId,
        schoolYearId,
        semesterId: resolvedSemesterId,
      },
    });
  }

  async upsertSubjectSummary(data: {
    orgId: number;
    studentId: number;
    classId: number;
    subjectId: number;
    schoolYearId: number;
    semesterId: number;
    averageScore: number | null;
    evaluation: string | null;
  }) {
    const resolvedSemesterId =
      (await this.resolveSemesterId(
        data.orgId,
        data.semesterId,
        data.schoolYearId,
      )) ?? data.semesterId;

    return this.prisma.subjectSemesterSummary.upsert({
      where: {
        studentId_subjectId_schoolYearId_semesterId: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          schoolYearId: data.schoolYearId,
          semesterId: resolvedSemesterId,
        },
      },
      update: {
        averageScore: data.averageScore,
        evaluation: data.evaluation,
        classId: data.classId,
      },
      create: {
        ...data,
        semesterId: resolvedSemesterId,
      },
    });
  }

  async findStudentTranscript(
    studentId: number,
    schoolYearId: number,
    semesterId?: number,
  ) {
    const whereScores: any = {
      studentId,
      schoolYearId,
    };
    if (semesterId) whereScores.semesterId = semesterId;

    const scores = await this.prisma.scoreEntry.findMany({
      where: whereScores,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        semester: { select: { id: true, title: true } },
      },
      orderBy: [{ subjectId: 'asc' }, { scoreType: 'asc' }],
    });

    const whereSummaries: any = {
      studentId,
      schoolYearId,
    };
    if (semesterId) whereSummaries.semesterId = semesterId;

    const summaries = await this.prisma.subjectSemesterSummary.findMany({
      where: whereSummaries,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        semester: { select: { id: true, title: true } },
      },
    });

    return { scores, summaries };
  }
}
