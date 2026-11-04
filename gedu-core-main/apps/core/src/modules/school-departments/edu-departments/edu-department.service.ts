import { AppError, AppException } from '@gedu/shared/errors';

import { Injectable } from '@nestjs/common';
import { ORDER_ENUM } from '@gedu/shared/enums';
import { PrismaService } from '@gedu/prisma';

@Injectable()
export class EduDepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getDepartments() {
    return this.prisma.eduDepartmentTemplate.findMany({
      where: {},
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

  async countStaffByDepartment(orgId: number) {
    const defaultHighestTemplateId = 1;
    const results = await this.prisma.eduDepartmentTemplate.findMany({
      where: {
        templateId: defaultHighestTemplateId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        parentId: true,
        edStaffs: {
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
      count: result.edStaffs.length,
    }));
  }

  async getFullDepartmentDetail(departmentId: number, orgId: number) {
    const department = await this.prisma.eduDepartmentTemplate.findUnique({
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

    const staffList = await this.prisma.edStaff.findMany({
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
}
