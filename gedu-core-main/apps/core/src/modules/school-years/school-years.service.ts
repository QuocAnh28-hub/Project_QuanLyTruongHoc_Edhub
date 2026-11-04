import { PrismaService } from '@gedu/prisma';
import { AppError, AppException } from '@gedu/shared/errors';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  CreateSchoolYearsDto,
  UpdateSchoolYearDto,
} from './dto/school-years.request.dto';
import { SchoolYearsResponseDto } from './dto/school-years.response.dto';
import { SchoolYearsRepository } from './repository/school-years.repository';
import { SCHOOL_YEAR_STATUS } from '@gedu/shared/enums';

@Injectable()
export class SchoolYearsService {
  constructor(
    private readonly schoolYearsRepository: SchoolYearsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getSchoolYear(orgId: number, schoolYearId: number) {
    const schoolYear =
      await this.schoolYearsRepository.findSchoolYearByOrgAndId(
        orgId,
        schoolYearId,
      );

    if (!schoolYear) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    return plainToInstance(SchoolYearsResponseDto, schoolYear);
  }

  async getSchoolYears(orgId: number) {
    const { schoolYears, total } =
      await this.schoolYearsRepository.findAllByOrgId(orgId);

    const formatSchoolYears = plainToInstance(
      SchoolYearsResponseDto,
      schoolYears,
    );
    return [formatSchoolYears, total];
  }

  async createSchoolYear(orgId: number, request: CreateSchoolYearsDto) {
    const schoolYear = await this.schoolYearsRepository.createSchoolYear(
      orgId,
      request,
    );

    return plainToInstance(SchoolYearsResponseDto, schoolYear);
  }

  async startSchoolYear(orgId: number, schoolYearId: number) {
    const schoolYearActiveCondition = {
      schoolYear: false,
    };

    const activeSchoolYears =
      await this.schoolYearsRepository.findActiveSchoolYear(orgId);

    if (activeSchoolYears) {
      throw new AppError(AppException.SCHOOL_YEAR_ALREADY_ACTIVE);
    }

    const schoolYear =
      await this.schoolYearsRepository.findSchoolYearByOrgAndId(
        orgId,
        schoolYearId,
      );

    if (!schoolYear) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    if (
      schoolYear.status === SCHOOL_YEAR_STATUS.NEW &&
      schoolYear.fromDate &&
      schoolYear.toDate
    ) {
      schoolYearActiveCondition.schoolYear = true;
    }


    if (schoolYearActiveCondition.schoolYear) {
      await this.prisma.$transaction(async (tx) => {
        await tx.schoolYear.update({
          where: { id: schoolYearId },
          data: {
            status: SCHOOL_YEAR_STATUS.ACTIVE,
          },
        })
      });
    }

    return {
      status: schoolYearActiveCondition.schoolYear,
      validate: schoolYearActiveCondition,
    };
  }

  async updateSchoolYear(
    orgId: number,
    schoolYearId: number,
    request: UpdateSchoolYearDto,
  ) {
    const schoolYear = await this.schoolYearsRepository.updateSchoolYear(
      orgId,
      schoolYearId,
      request,
    );

    if (!schoolYear) {
      throw new AppError(AppException.SCHOOL_YEAR_NOT_FOUND_OR_ACCESS_DENIED);
    }

    return plainToInstance(SchoolYearsResponseDto, schoolYear);
  }
}
