import { PrismaService, Subject } from '@gedu/prisma';
import { AppError, AppException, GRADE_LEVEL, ORDER_ENUM } from '@gedu/shared';
import { Injectable } from '@nestjs/common';
import {
  CreateCurriculumDto,
  GetCurriculumsDto,
  UpdateSubjectQuickDto,
} from '../dto/curriculums.request.dto';

@Injectable()
export class CurriculumRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurriculums(orgId: number, query: GetCurriculumsDto) {
    const { page = 1, size = 100 } = query;

    const curriculums = await this.prisma.curriculum.findMany({
      include: {
        instructionLanguage: {
          select: {
            name: true,
          },
        },
        gradeLevels: true,
      },
      where: { orgId },
      orderBy: { id: ORDER_ENUM.DESC },
      skip: (page - 1) * size,
      take: size,
    });

    const total = await this.prisma.curriculum.count({
      where: { orgId },
    });
    return { curriculums, total };
  }

  async findCurriculumById(orgId: number, id: number) {
    return await this.prisma.curriculum.findUnique({
      where: { id, orgId },
      include: {
        gradeLevels: true,
        instructionLanguage: {
          select: {
            name: true,
          },
        },
        subjects: {
          include: {
            subject: {
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
  }

  async findCurriculumBySubject(orgId: number, curriculumId: number) {
    const curriculumSubjects = await this.prisma.curriculumSubject.findMany({
      where: {
        orgId,
        curriculumId,
      },
      include: {
        instructionLanguage: {
          select: {
            name: true,
          },
        },
        subject: true,
      },
    });

    const grouped = new Map<
      number,
      {
        subjectId: number;
        instructionLanguageName: string;
        type: number;
        subject: Subject;
        id: number;
        gradeLevels: GRADE_LEVEL[];
      }
    >();

    for (const cs of curriculumSubjects) {
      const existing = grouped.get(cs.subjectId);

      if (!existing) {
        grouped.set(cs.subjectId, {
          subjectId: cs.subjectId,
          subject: cs.subject,
          type: cs.type,
          id: cs.subject.id,
          instructionLanguageName: cs.instructionLanguage.name,
          gradeLevels: [cs.gradeLevel],
        });
      } else {
        existing.gradeLevels.push(cs.gradeLevel);
      }
    }

    return Array.from(grouped.values());
  }

  async createCurriculum(orgId: number, data: CreateCurriculumDto) {
    return await this.prisma.$transaction(async (tx) => {
      const curriculum = await tx.curriculum.create({
        data: {
          orgId,
          code: data.code,
          name: data.name,
          instructionLanguageId: data.instructionLanguageId,
          graduationDegree: data.graduationDegree,
          isReceived: data.isReceived,
          canApply: data.canApply,
        },
      });

      const gradeLevels = data.gradeLevels.map((gradeLevel) => ({
        orgId,
        curriculumId: curriculum.id,
        gradeLevel,
      }));

      if (curriculum.id && gradeLevels.length > 0)
        await tx.curriculumGradeLevel.createMany({
          data: gradeLevels,
        });

      return curriculum;
    });
  }

  async findCurriculumByOrgIdAndId(orgId: number, id: number) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id, orgId },
      include: {
        gradeLevels: true,
        instructionLanguage: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!curriculum) {
      throw new AppError(AppException.CURRICULUM_NOT_FOUND_OR_ACCESS_DENIED);
    }

    return curriculum;
  }

  async quickUpdateCurriculumBySubject(
    orgId: number,
    id: number,
    subjectId: number,
    grd: number,
    data: UpdateSubjectQuickDto,
  ) {
    const curriculumSubject = await this.prisma.curriculumSubject.findFirst({
      where: { subjectId: subjectId, orgId, curriculumId: id, gradeLevel: grd },
    });

    if (!curriculumSubject) {
      throw new AppError(AppException.SUBJECT_OF_CURRICULUM_NOT_FOUND);
    }

    return await this.prisma.curriculumSubject.update({
      where: { id: curriculumSubject.id },
      data: {
        lessonsPerWeek: data.lessonsPerWeek,
        type: data.type,
        scoringBased: data.scoringBased,
        commentsBased: data.commentsBased,
      },
      include: {
        subject: true,
      },
    });
  }
}
