import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import {
  CreatePeriodDto,
  SaveClassScheduleDto,
  UpdatePeriodDto,
} from '../dto/timetable.dto';

@Injectable()
export class TimetableRepository {
  constructor(private readonly prisma: PrismaService) {}

  // --- PERIODS ---

  async findPeriods(orgId: number) {
    const list = await this.prisma.timetablePeriod.findMany({
      where: { orgId },
      orderBy: [{ shift: 'asc' }, { period: 'asc' }],
    });
    return list.map((p) => ({
      ...p,
      periodNumber: p.period,
      name: `Tiết ${p.period} (${p.shift === 1 ? 'Sáng' : 'Chiều'})`,
    }));
  }

  async createPeriod(orgId: number, dto: CreatePeriodDto) {
    return this.prisma.timetablePeriod.create({
      data: {
        orgId,
        period: dto.period,
        shift: dto.shift,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  async updatePeriod(orgId: number, id: number, dto: UpdatePeriodDto) {
    return this.prisma.timetablePeriod.update({
      where: { id },
      data: dto,
    });
  }

  async initDefaultPeriods(orgId: number) {
    const existing = await this.prisma.timetablePeriod.findMany({
      where: { orgId },
    });
    if (existing.length > 0) return existing;

    const defaults = [
      { period: 1, shift: 1, startTime: '07:15', endTime: '08:00' },
      { period: 2, shift: 1, startTime: '08:05', endTime: '08:50' },
      { period: 3, shift: 1, startTime: '09:05', endTime: '09:50' },
      { period: 4, shift: 1, startTime: '09:55', endTime: '10:40' },
      { period: 5, shift: 1, startTime: '10:45', endTime: '11:30' },
      { period: 6, shift: 2, startTime: '13:15', endTime: '14:00' },
      { period: 7, shift: 2, startTime: '14:05', endTime: '14:50' },
      { period: 8, shift: 2, startTime: '15:05', endTime: '15:50' },
      { period: 9, shift: 2, startTime: '15:55', endTime: '16:40' },
      { period: 10, shift: 2, startTime: '16:45', endTime: '17:30' },
    ];

    await this.prisma.timetablePeriod.createMany({
      data: defaults.map((d) => ({ ...d, orgId })),
    });

    return this.findPeriods(orgId);
  }

  // --- SCHEDULES ---

  async resolveSemesterId(orgId: number, semesterId?: number, schoolYearId?: number): Promise<number | undefined> {
    if (semesterId === undefined || semesterId === null) return undefined;
    const direct = await this.prisma.semester.findFirst({
      where: { id: semesterId, orgId },
    });
    if (direct) return semesterId;

    const sems = await this.prisma.semester.findMany({
      where: { orgId, ...(schoolYearId ? { schoolYearId } : {}) },
      orderBy: { id: 'asc' },
    });
    if (sems.length >= semesterId && semesterId > 0) {
      return sems[semesterId - 1].id;
    }
    if (sems.length > 0) {
      return sems[0].id;
    }
    return semesterId;
  }

  async findClassSchedules(
    orgId: number,
    classId: number,
    schoolYearId?: number,
    semesterId?: number,
  ) {
    const where: any = { orgId, classId };
    if (schoolYearId) where.schoolYearId = schoolYearId;
    const resolvedSemesterId = await this.resolveSemesterId(orgId, semesterId, schoolYearId);
    if (resolvedSemesterId !== undefined) where.semesterId = resolvedSemesterId;

    const list = await this.prisma.timetableSchedule.findMany({
      where,
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: {
          select: {
            id: true,
            code: true,
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { period: 'asc' }],
    });

    return list.map((item) => ({
      ...item,
      periodId: item.period,
      periodNumber: item.period,
      room: item.roomNumber,
    }));
  }

  async findTeacherSchedules(
    orgId: number,
    teacherId: number,
    schoolYearId?: number,
    semesterId?: number,
  ) {
    const where: any = { orgId, teacherId };
    if (schoolYearId) where.schoolYearId = schoolYearId;
    const resolvedSemesterId = await this.resolveSemesterId(orgId, semesterId, schoolYearId);
    if (resolvedSemesterId !== undefined) where.semesterId = resolvedSemesterId;

    return this.prisma.timetableSchedule.findMany({
      where,
      include: {
        class: { select: { id: true, name: true, code: true } },
        subject: { select: { id: true, name: true, code: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { period: 'asc' }],
    });
  }

  async checkTeacherConflict(
    orgId: number,
    teacherId: number,
    dayOfWeek: number,
    period: number,
    schoolYearId: number,
    semesterId?: number,
    excludeClassId?: number,
  ) {
    return this.prisma.timetableSchedule.findFirst({
      where: {
        orgId,
        teacherId,
        dayOfWeek,
        period,
        schoolYearId,
        semesterId: semesterId ?? null,
        ...(excludeClassId ? { classId: { not: excludeClassId } } : {}),
      },
      include: {
        class: { select: { name: true } },
      },
    });
  }

  async saveClassSchedules(
    orgId: number,
    classId: number,
    dto: SaveClassScheduleDto,
  ) {
    const resolvedSemesterId = await this.resolveSemesterId(orgId, dto.semesterId, dto.schoolYearId);
    return this.prisma.$transaction(async (tx) => {
      // 1. Delete existing schedules for this class / schoolYear / semester
      await tx.timetableSchedule.deleteMany({
        where: {
          orgId,
          classId,
          schoolYearId: dto.schoolYearId,
          semesterId: resolvedSemesterId ?? null,
        },
      });

      // 2. Insert new schedule entries
      if (dto.schedules.length > 0) {
        await tx.timetableSchedule.createMany({
          data: dto.schedules.map((s) => ({
            orgId,
            classId,
            subjectId: s.subjectId,
            teacherId: s.teacherId ?? null,
            schoolYearId: dto.schoolYearId,
            semesterId: resolvedSemesterId ?? null,
            dayOfWeek: s.dayOfWeek,
            period: s.period,
            roomNumber: s.roomNumber ?? null,
            note: s.note ?? null,
          })),
        });
      }

      return tx.timetableSchedule.findMany({
        where: {
          orgId,
          classId,
          schoolYearId: dto.schoolYearId,
          semesterId: resolvedSemesterId ?? null,
        },
        include: {
          subject: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: [{ dayOfWeek: 'asc' }, { period: 'asc' }],
      });
    });
  }

  async deleteScheduleById(orgId: number, id: number) {
    return this.prisma.timetableSchedule.deleteMany({
      where: { id, orgId },
    });
  }

  async findStaffByUserId(userId: number, orgId: number) {
    return this.prisma.schoolStaff.findFirst({
      where: { userId, orgId },
    });
  }
}

