import { Prisma, PrismaService } from '@gedu/prisma';

import { GetEduPositionsDto } from './dto/edu-position.request';
import { Injectable } from '@nestjs/common';
import { ORDER_ENUM } from '@gedu/shared';

@Injectable()
export class EdPositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEduPositions(orgId: number, query: GetEduPositionsDto) {
    const {
      dept,
      page = 1,
      size = 100,
      order = ORDER_ENUM.DESC,
      orderBy = 'id',
    } = query;

    const departmentId = dept ? parseInt(dept, 10) : undefined;
    const templateId = 1;

    const whereClause: Prisma.EdPositionTemplateWhereInput = {
      ...(departmentId && !isNaN(departmentId) && { departmentId }),
      ...{ templateId },
    };

    const skip = (page - 1) * size;
    const take = size;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.edPositionTemplate.findMany({
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
          edStaffs: {
            where: {
              orgId: orgId,
            },
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.edPositionTemplate.count({
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
        memberCount: item.edStaffs.length,
      })),
      total,
    ];
  }

  async getEduPositionDetail(orgId: number, positionId: number) {
    const data = await this.prisma.edPositionTemplate.findFirst({
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
        edStaffs: {
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

    const { edStaffs, ...rest } = data;

    return {
      ...rest,
      memberCount: edStaffs.length ?? 0,
    };
  }
}
