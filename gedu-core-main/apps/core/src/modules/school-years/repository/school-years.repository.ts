import {
  Prisma,
  PrismaService,
  SchoolYear,
} from '@gedu/prisma';
import { ORDER_ENUM, SCHOOL_YEAR_STATUS } from '@gedu/shared/enums';
import { Injectable } from '@nestjs/common';
import {
  CreateSchoolYearsDto,
  UpdateExaminationsDto,
  UpdateSchoolYearDto,
} from '../dto/school-years.request.dto';


@Injectable()
export class SchoolYearsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByIdAndOrgId(orgId: number, schoolYearId: number): Promise<SchoolYear | null> {
    return this.prisma.schoolYear.findFirst({
      where: {
        orgId,
        id: schoolYearId,
      },
    });
  }

  async findAllByOrgId(
    orgId: number,
  ): Promise<{ schoolYears: SchoolYear[]; total: number }> {
    return this.prisma.$transaction(async (tx) => {
      const [schoolYears, total] = await Promise.all([
        tx.schoolYear.findMany({
          where: { orgId },
          orderBy: { id: ORDER_ENUM.DESC },
        }),
        tx.schoolYear.count({
          where: { orgId },
        }),
      ]);

      return { schoolYears, total };
    });
  }

  async findSchoolYearByOrgAndId(orgId: number, schoolYearId: number) {
    return this.prisma.schoolYear.findFirst({
      where: {
        orgId,
        id: schoolYearId,
      },
      include: {
        semesters: {
          include: {
            examinations: true,
          },
        },
      },
    });
  }

  async createSchoolYear(orgId: number, request: CreateSchoolYearsDto) {
    return this.prisma.$transaction(async (tx) => {
      const { title, fromDate, toDate, semesters = [] } = request;

      const schoolYear = await tx.schoolYear.create({
        data: { orgId, title, fromDate, toDate },
      });

      const schoolYearId = schoolYear.id;
      let totalExams = 0;

      for (const s of semesters) {
        const { id: semesterId } = await tx.semester.create({
          data: {
            orgId,
            schoolYearId,
            title: s.title,
            fromDate: s.fromDate,
            toDate: s.toDate,
          },
        });

        if (s.examinations?.length) {
          totalExams += s.examinations.length;

          await Promise.all(
            s.examinations.map((e) =>
              tx.examination.create({
                data: {
                  orgId,
                  schoolYearId,
                  semesterId,
                  title: e.title,
                  fromDate: e.fromDate,
                  toDate: e.toDate,
                },
              }),
            ),
          );
        }
      }

      await tx.schoolYear.update({
        where: { id: schoolYearId },
        data: {
          semesterCount: semesters.length,
          examCount: totalExams,
        },
      });

      return tx.schoolYear.findUnique({
        where: { id: schoolYearId },
        include: {
          semesters: { include: { examinations: true } },
        },
      });
    });
  }

  async updateSchoolYear(
    orgId: number,
    schoolYearId: number,
    request: UpdateSchoolYearDto,
  ) {
    await this.prisma.$transaction(async (tx) => {
      const schoolYear = await tx.schoolYear.update({
        where: {
          id: schoolYearId,
          orgId,
        },
        data: {
          title: request.title,
          fromDate: request.fromDate,
          toDate: request.toDate,
        },
      });

      if (request.examinations && request.examinations.length > 0) {
        await this.updateExaminations(tx, request.examinations, orgId);
      }

      if (request.semesters && request.semesters.length > 0) {
        const semestersDelete = request.semesters.filter((s) => s.isDeleted);

        if (semestersDelete.length > 0) {
          await tx.semester.deleteMany({
            where: {
              id: { in: semestersDelete.map((s) => s.id) },
              schoolYearId,
            },
          });
        }

        const semestersCreate = request.semesters.filter((s) => !s.isDeleted);

        if (semestersCreate.length > 0) {
          await Promise.all(
            semestersCreate.map(async (s) => {
              const semesterData = {
                orgId,
                schoolYearId,
                title: s.title,
                fromDate: s.fromDate,
                toDate: s.toDate,
                examinations: {
                  create:
                    s.examinations?.map((e) => ({
                      orgId,
                      schoolYearId,
                      title: e.title,
                      fromDate: e.fromDate,
                      toDate: e.toDate,
                    })) ?? [],
                },
              };

              if (s.id && semestersCreate.length > 0) {
                await tx.semester.upsert({
                  where: { id: s.id },
                  create: semesterData,
                  update: semesterData,
                });
              } else {
                await tx.semester.create({ data: semesterData });
              }
            }),
          );
        }
      }

      const semesters = await tx.semester.findMany({
        where: { schoolYearId },
        include: { examinations: true },
      });

      const semesterCount = semesters.length;
      const examCount = semesters.reduce(
        (count, semester) => count + semester.examinations.length,
        0,
      );

      await tx.schoolYear.update({
        where: { id: schoolYearId },
        data: { semesterCount, examCount },
      });

      return schoolYear;
    });

    return this.findSchoolYearByOrgAndId(orgId, schoolYearId);
  }

  async updateExaminations(
    tx: Prisma.TransactionClient,
    examinations: UpdateExaminationsDto[],
    orgId: number,
  ) {
    const updatedExams = await Promise.all(
      examinations.map(async (exam) => {
        if (!exam.isDeleted) {
          await tx.examination.update({
            where: { id: exam.id, semesterId: exam.semesterId, orgId },
            data: {
              title: exam.title,
              fromDate: exam.fromDate,
              toDate: exam.toDate,
            },
          });
        } else {
          await tx.examination.delete({
            where: { id: exam.id, semesterId: exam.semesterId, orgId },
          });
        }
      }),
    );

    return updatedExams;
  }

  async findActiveSchoolYear(orgId: number) {
    return this.prisma.schoolYear.findFirst({
      where: {
        orgId,
        status: SCHOOL_YEAR_STATUS.ACTIVE,
      },
    });
  }
}
