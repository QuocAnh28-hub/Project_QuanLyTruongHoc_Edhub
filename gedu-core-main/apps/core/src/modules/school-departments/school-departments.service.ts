import { AppError, AppException } from '@gedu/shared/errors';

import { Injectable } from '@nestjs/common';
import { ORDER_ENUM } from '@gedu/shared/enums';
import { PrismaService } from '@gedu/prisma';
import { SharesService } from '../shares/shares.service';

@Injectable()
export class SchoolDepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shareService: SharesService,
  ) {}

  async getDepartments(orgId: number, templateId?: number) {
    const defaultHighestTemplateId =
      await this.getDefaultHighestTemplateId(orgId);

    return this.prisma.schoolDepartmentTemplates.findMany({
      where: { templateId: templateId ?? defaultHighestTemplateId },
      orderBy: {
        name: ORDER_ENUM.ASC,
      },
      select: {
        id: true,
        name: true,
        code: true,
        parentId: true,
      },
    });
  }

  async countStaffByDepartment(templateId?: number, orgId?: number) {
    const defaultHighestTemplateId =
      await this.getDefaultHighestTemplateId(orgId);

    const results = await this.prisma.schoolDepartmentTemplates.findMany({
      where: { templateId: templateId ?? defaultHighestTemplateId },
      select: {
        id: true,
        name: true,
        code: true,
        parentId: true,
        schoolStaffs: {
          where: {
            orgId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return results.map((result) => ({
      id: result.id,
      parentId: result.parentId,
      count: result.schoolStaffs.length,
    }));
  }

  async getFullDepartmentDetail(departmentId: number, orgId: number) {
    const department = await this.prisma.schoolDepartmentTemplates.findUnique({
      where: { id: departmentId },
      include: {
        parent: {
          select: { name: true },
        },
        children: {
          select: { id: true, name: true },
        },
      },
    });

    if (!department) {
      throw new AppError(AppException.DEPARTMENT_NOT_FOUND);
    }

    const departmentIds = [
      department.id,
      ...department.children.map((c) => c.id),
    ];

    const staffList = await this.prisma.schoolStaff.findMany({
      where: {
        departmentId: { in: departmentIds },
        orgId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        position: {
          select: {
            id: true,
            title: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const heads = staffList.filter(
      (staff) =>
        staff.positionId && staff.positionId === department.headPositionId,
    );

    return {
      id: department.id,
      name: department.name,
      code: department.code,
      parentId: department.parentId,
      parentDepartmentName: department.parent?.name || null,
      memberCount: staffList.length,

      headPositions: heads.map((staff) => ({
        firstName: staff.user.firstName,
        lastName: staff.user.lastName,
        email: staff.user.email,
        phone: staff.contactPhone,
        positionTitle: staff.position?.title,
        id: staff.id,
      })),

      subDepartments: department.children.map((child) => ({
        name: child.name,
        id: child.id,
      })),
    };
  }

  private async getDefaultHighestTemplateId(
    orgId?: number,
  ): Promise<number | undefined> {
    if (!orgId) return undefined;

    const school = await this.prisma.school.findUnique({
      where: { id: orgId },
      select: {
        canUpperSecondarySchool: true,
        canLowerSecondarySchool: true,
        canPrimarySchool: true,
        canPreschool: true,
      },
    });

    return school ? this.shareService.getHighestTemplateId(school) : undefined;
  }
}
