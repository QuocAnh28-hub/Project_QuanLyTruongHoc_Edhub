import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import {
  CreateTeachingAssignmentItemDto,
  QueryTeachingAssignmentDto,
} from '../dto/teaching-assignment.dto';

@Injectable()
export class TeachingAssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertBatch(orgId: number, items: CreateTeachingAssignmentItemDto[]) {
    return this.prisma.$transaction(async (tx) => {
      const results: any[] = [];
      for (const item of items) {
        const existing = await tx.teachingAssignment.findFirst({
          where: {
            orgId,
            classId: item.classId,
            subjectId: item.subjectId,
            schoolYearId: item.schoolYearId,
            semesterId: item.semesterId ?? null,
          },
        });

        if (existing) {
          const updated = await tx.teachingAssignment.update({
            where: { id: existing.id },
            data: { staffId: item.staffId },
            include: {
              class: { select: { id: true, name: true, code: true } },
              subject: { select: { id: true, name: true, code: true } },
              teacher: {
                select: {
                  id: true,
                  user: {
                    select: { id: true, firstName: true, lastName: true },
                  },
                },
              },
            },
          });
          results.push(updated);
        } else {
          const created = await tx.teachingAssignment.create({
            data: {
              orgId,
              classId: item.classId,
              subjectId: item.subjectId,
              staffId: item.staffId,
              schoolYearId: item.schoolYearId,
              semesterId: item.semesterId ?? null,
            },
            include: {
              class: { select: { id: true, name: true, code: true } },
              subject: { select: { id: true, name: true, code: true } },
              teacher: {
                select: {
                  id: true,
                  user: {
                    select: { id: true, firstName: true, lastName: true },
                  },
                },
              },
            },
          });
          results.push(created);
        }
      }
      return results;
    });
  }

  async findAssignments(orgId: number, query: QueryTeachingAssignmentDto) {
    const where: any = { orgId };

    if (query.classId) where.classId = query.classId;
    if (query.staffId) where.staffId = query.staffId;
    if (query.schoolYearId) where.schoolYearId = query.schoolYearId;
    if (query.semesterId !== undefined) where.semesterId = query.semesterId;
    if (query.subjectId) where.subjectId = query.subjectId;

    return this.prisma.teachingAssignment.findMany({
      where,
      include: {
        class: { select: { id: true, name: true, code: true } },
        subject: { select: { id: true, name: true, code: true } },
        teacher: {
          select: {
            id: true,
            code: true,
            user: {
              select: { id: true, firstName: true, lastName: true, phone: true },
            },
          },
        },
      },
      orderBy: [{ classId: 'asc' }, { subjectId: 'asc' }],
    });
  }

  async findById(orgId: number, id: number) {
    return this.prisma.teachingAssignment.findFirst({
      where: { id, orgId },
      include: {
        class: true,
        subject: true,
        teacher: {
          include: { user: true },
        },
      },
    });
  }

  async deleteById(orgId: number, id: number) {
    return this.prisma.teachingAssignment.deleteMany({
      where: { id, orgId },
    });
  }

  async findStaffByUserId(userId: number, orgId: number) {
    return this.prisma.schoolStaff.findFirst({
      where: { userId, orgId },
    });
  }
}
