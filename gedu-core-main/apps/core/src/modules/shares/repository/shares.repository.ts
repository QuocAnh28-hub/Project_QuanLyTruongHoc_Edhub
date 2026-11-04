import { Prisma, PrismaService, SchoolYear } from '@gedu/prisma';

import { GetCurriculumDto } from '../dto/get-school-positions.dto';
import { Injectable } from '@nestjs/common';
import { ORDER_ENUM } from '@gedu/shared';

@Injectable()
export class SharesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getPriorityPolicies() {
    return this.prisma.studentPriorityPolicies.findMany({
      where: {
        isActive: true,
      },
    });
  }

  getPriorityNeededPolicies() {
    return this.prisma.studentSpecialNeedsPolicies.findMany({
      where: {
        isActive: true,
      },
    });
  }

  findSchoolYearsByIdAndOrgId(
    orgId: number,
    schoolYearId: number,
  ): Promise<SchoolYear | null> {
    return this.prisma.schoolYear.findFirst({
      where: { orgId, id: schoolYearId },
    });
  }

  findSchoolYearsAllByOrgId(orgId: number) {
    return this.prisma.schoolYear.findMany({
      where: {
        orgId,
      },
      orderBy: {
        updatedAt: ORDER_ENUM.DESC,
      },
    });
  }

  findInstructionLanguages() {
    return this.prisma.instructionLanguage.findMany({
      orderBy: {
        name: ORDER_ENUM.ASC,
      },
      where: {
        isActive: true,
        isInstruction: true,
      },
    });
  }

  findForeignLanguages() {
    return this.prisma.instructionLanguage.findMany({
      orderBy: {
        name: ORDER_ENUM.ASC,
      },
      where: {
        isActive: true,
        isForeign: true,
      },
    });
  }

  findSchoolYearByTitle(
    title?: string,
    orgId?: number,
  ): Promise<SchoolYear | null> {
    return this.prisma.schoolYear.findFirst({
      where: { orgId, title },
    });
  }

  findSchoolPositionTemplates(
    where: Prisma.SchoolPositionTemplatesWhereInput,
    select: Prisma.SchoolPositionTemplatesSelect,
  ) {
    return this.prisma.schoolPositionTemplates.findMany({
      where,
      select,
    });
  }

  async findSchoolDepartmentTemplates(
    where: Prisma.SchoolDepartmentTemplatesWhereInput,
    select: Prisma.SchoolDepartmentTemplatesSelect,
    orderBy: Prisma.SchoolDepartmentTemplatesOrderByWithRelationInput = {
      name: ORDER_ENUM.ASC,
    },
  ) {
    return this.prisma.schoolDepartmentTemplates.findMany({
      where,
      select,
      orderBy,
    });
  }

  getNations() {
    return this.prisma.nations.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  getEthnics() {
    return this.prisma.ethnics.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  getCountries() {
    return this.prisma.countries.findMany({
      select: {
        id: true,
        originalName: true,
        name: true,
        phoneCode: true,
        flag: true,
      },
    });
  }

  getReligions() {
    return this.prisma.religions.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  getProvinces() {
    return this.prisma.provinces.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: ORDER_ENUM.ASC,
      },
    });
  }

  getDistricts(provinceId: number) {
    return this.prisma.districts.findMany({
      where: { provinceId },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: ORDER_ENUM.ASC,
      },
    });
  }

  getWardsByDistrictId(districtId: number) {
    return this.prisma.wards.findMany({
      where: { districtId },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: ORDER_ENUM.ASC,
      },
    });
  }

  async getWardsByProvinceId(provinceId: number) {
    const districts = await this.prisma.districts.findMany({
      where: { provinceId },
      select: {
        id: true,
        title: true,
      },
    });
    const wards = await this.prisma.wards.findMany({
      where: { districtId: { in: districts.map((district) => district.id) } },
      select: {
        id: true,
        title: true,
      },
    });
    return wards;
  }

  // New provinces, cities, wards, communes (apply from 01/07/2025)
  getProvincesCities() {
    return this.prisma.provincesCities.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        type: true,
      },
      orderBy: {
        title: ORDER_ENUM.ASC,
      },
    });
  }

  findWardsCommunes(provincesCitiesId: number) {
    return this.prisma.wardsCommunes.findMany({
      where: {
        parentId: provincesCitiesId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        parentId: true,
        type: true,
      },
      orderBy: {
        title: ORDER_ENUM.ASC,
      },
    });
  }

  async getWardsAndCommunes() {
    const wards = await this.prisma.wardsCommunes.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        parentId: true,
        type: true,
      },
      orderBy: {
        title: ORDER_ENUM.ASC,
      },
    });
    return wards;
  }

  async getCurriculums(orgId: number, query?: GetCurriculumDto) {
    const grd = query?.grd;

    return this.prisma.curriculum.findMany({
      include: {
        gradeLevels: true,
      },
      where: {
        orgId,
        canApply: true,
        ...(grd ? { gradeLevels: { some: { gradeLevel: grd } } } : {}),
      },
    });
  }

  async findHomeroomTeachers(orgId: number) {
    return this.prisma.schoolStaff.findMany({
      where: {
        orgId,
        OR: [
          { position: { code: { in: ['GVCN', 'GVBM'] } } },
          { schoolStaffPositions: { some: { position: { code: { in: ['GVCN', 'GVBM'] } } } } },
        ],
      },
      include: {
        user: true,
      },
    });
  }
}
