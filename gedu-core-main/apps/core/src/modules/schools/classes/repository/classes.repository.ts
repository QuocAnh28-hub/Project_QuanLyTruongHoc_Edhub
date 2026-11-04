import {
  AppError,
  AppException,
  ORDER_ENUM,
  STUDENT_CLASS_STATUS,
} from '@gedu/shared';
import { Class, Prisma, PrismaService } from '@gedu/prisma';
import {
  CreateClassGroupDto,
  GetClassesRequestDto,
  UpdateClassDto,
  UpdateClassesInfoDto,
} from '../dto/classes.request.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByConditions(
    schoolId: number,
    schoolYearId: number,
    gradeLevel?: number,
  ) {
    return this.prisma.class.findMany({
      where: {
        orgId: schoolId,
        schoolYearId,
        ...(gradeLevel ? { gradeLevel } : {}),
      },
    });
  }

  async updateInfoClass(id: number, orgId: number, data: UpdateClassesInfoDto) {
    return this.prisma.class.update({
      where: {
        id,
        orgId,
      },
      data,
    });
  }

  findDetailsByIdAndOrgId(
    orgId: number,
    classId: number,
  ): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: {
        id: classId,
        orgId,
      },
      include: {
        secondForeignLanguage: true,
        firstForeignLanguage: true,
        _count: { select: { studentClasses: true } },
        homeroomTeacher: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        curriculum: {
          select: {
            id: true,
            code: true,
            name: true,
            canApply: true,
            isReceived: true,
            graduationDegree: true,
          },
        },
      },
    });
  }

  findByIdAndOrgId(orgId: number, classId: number): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: {
        id: classId,
        orgId,
      },
    });
  }

  findByName(
    orgId: number,
    schoolYearId: number,
    name: string,
  ): Promise<Class | null> {
    return this.prisma.class.findFirst({
      where: {
        orgId,
        schoolYearId,
        name,
      },
    });
  }

  async findAllAndCountClasses(orgId: number, query: GetClassesRequestDto) {
    const { page = 1, size = 100, year, grd, curr } = query;
    const whereClause: Prisma.ClassWhereInput = {
      orgId,
      ...{ schoolYearId: year },
      ...(grd && { gradeLevel: grd }),
      ...(curr && { curriculumId: curr }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.class.findMany({
        include: {
          studentClasses: {
            where: {
              status: {
                in: [STUDENT_CLASS_STATUS.CREATED, STUDENT_CLASS_STATUS.ACTIVE],
              },
            },
            select: {
              student: true,
            },
          },
          homeroomTeacher: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          curriculum: true,
        },
        where: whereClause,
        skip: (page - 1) * size,
        take: size,
        orderBy: { id: ORDER_ENUM.DESC },
      }),
      this.prisma.class.count({ where: whereClause }),
    ]);

    return { items, total };
  }

  async createClasses(orgId: number, request: CreateClassGroupDto) {
    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: { id: request.schoolYearId, orgId },
    });

    if (!schoolYear) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    const school = await this.prisma.school.findUnique({
      where: { id: orgId },
      select: { code: true },
    });

    if (!school) {
      throw new AppError(AppException.SCHOOL_NOT_FOUND);
    }

    return await this.prisma.class.createMany({
      data: request.classes.map((cls) => ({
        orgId,
        schoolYearId: request.schoolYearId,
        gradeLevel: request.gradeLevel,
        curriculumId: cls.curriculumId,
        dailyScheduleType: request.dailyScheduleType,
        firstForeignLanguageId: cls.firstForeignLanguageId,
        secondForeignLanguageId: cls.secondForeignLanguageId,
        isDayBoarding: request.isDayBoarding,
        maxClassSize: cls.maxClassSize,
        name: cls.name,
        code: `${school.code}-${schoolYear.title}-${cls.name}`,
      })),
    });
  }

  async updateClass(orgId: number, classId: number, data: UpdateClassDto) {
    return this.prisma.class.update({
      where: { id: classId, orgId },
      data,
    });
  }
}
