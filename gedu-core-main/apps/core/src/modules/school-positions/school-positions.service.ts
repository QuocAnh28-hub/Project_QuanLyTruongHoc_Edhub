import {
  AppError,
  AppException,
  AppExceptionDetail,
  ORDER_ENUM,
} from '@gedu/shared';

import { GetSchoolPositionsDto } from './dto/get-school-positions.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import { SharesService } from '../shares/shares.service';

@Injectable()
export class SchoolPositionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shareService: SharesService,
  ) {}

  async getSchoolPositions(orgId: number, query: GetSchoolPositionsDto) {
    const {
      dept,
      tmpl,
      page = 1,
      size = 100,
      q: keyword,
      order = ORDER_ENUM.DESC,
      orderBy = 'id',
    } = query;
    const school = await this.prisma.school.findUnique({
      where: { id: orgId },
      select: {
        canUpperSecondarySchool: true,
        canLowerSecondarySchool: true,
        canPrimarySchool: true,
        canPreschool: true,
      },
    });

    const defaultHighestTemplateId = school
      ? this.shareService.getHighestTemplateId(school)
      : undefined;

    const departmentId = dept ? parseInt(dept, 10) : undefined;
    const templateId = tmpl ? parseInt(tmpl, 10) : defaultHighestTemplateId;

    const whereClause: any = {
      ...(departmentId && !isNaN(departmentId) && { departmentId }),
      ...(templateId && !isNaN(templateId) && { templateId }),
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { code: { contains: keyword, mode: 'insensitive' } },
        ],
      }),
    };

    const skip = (page - 1) * size;
    const take = size;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.schoolPositionTemplates.findMany({
        where: whereClause,
        orderBy: {
          [orderBy]: order,
        },
        skip,
        take,
        select: {
          id: true,
          code: true,
          title: true,
          departmentId: true,
          department: {
            select: {
              name: true,
            },
          },
          schoolStaffs: {
            where: {
              orgId: orgId,
            },
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.schoolPositionTemplates.count({
        where: whereClause,
      }),
    ]);

    return [
      data.map((item) => ({
        id: item.id,
        code: item.code,
        title: item.title,
        departmentId: item.departmentId,
        department: item.department?.name || null,
        departmentName: item.department?.name || null,
        memberCount: item.schoolStaffs.length,
      })),
      total,
    ];
  }

  async getSchoolPositionDetail(orgId: number, positionId: number) {
    const data = await this.prisma.schoolPositionTemplates.findFirst({
      where: {
        id: positionId,
      },
      select: {
        id: true,
        code: true,
        title: true,
        departmentId: true,
        department: {
          select: {
            id: true,
            code: true,
            name: true,
            parentId: true,
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        schoolStaffs: {
          where: {
            orgId: orgId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!data) return null;

    const { schoolStaffs, ...rest } = data;

    return {
      ...rest,
      memberCount: schoolStaffs.length ?? 0,
    };
  }

  async getSchoolPositionAuthorities(orgId: number, positionId: number) {
    const templateId = orgId
      ? await this.getSchoolTemplateId(orgId)
      : undefined;

    const position = await this.findPositionWithRoles(positionId, templateId);

    if (!position) {
      throw new AppError(AppException.POSITION_NOT_FOUND);
    }

    return await this.getPermissionsForRoles(position.positionRoles);
  }

  private async getSchoolTemplateId(
    orgId: number,
  ): Promise<number | undefined> {
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

  private async findPositionWithRoles(positionId: number, templateId?: number) {
    return await this.prisma.schoolPositionTemplates.findFirst({
      where: {
        id: positionId,
        ...(templateId && { templateId }),
      },
      select: {
        id: true,
        positionRoles: {
          select: {
            role_code: true,
          },
        },
      },
    });
  }

  private async getPermissionsForRoles(positionRoles: { role_code: string }[]) {
    if (!positionRoles?.length) return [];
    const permissions = await this.prisma.role_Permission.findMany({
      where: {
        role_code: {
          in: positionRoles.map((item) => item.role_code),
        },
      },
      include: {
        permission: true,
      },
    });

    const seen = new Set<string>();
    const result: Array<{
      id: number;
      roleCode: string;
      permissionCode: string;
      permissionTitle: string;
    }> = [];

    for (const item of permissions) {
      const key = `${item.role_code}|${item.permission_code}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({
        id: item.id,
        roleCode: item.role_code,
        permissionCode: item.permission_code,
        permissionTitle: item.permission.title,
      });
    }
    return result;
  }
}
