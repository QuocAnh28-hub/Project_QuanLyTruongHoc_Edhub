import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import { SubmitAttendanceDto } from '../dto/attendance.dto';

@Injectable()
export class AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getClassStudents(orgId: number, classId: number) {
    return this.prisma.studentClass.findMany({
      where: {
        orgId,
        classId,
        status: { in: [1, 2] },
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: [
        { student: { user: { lastName: 'asc' } } },
        { student: { user: { firstName: 'asc' } } },
      ],
    });
  }

  async findSession(
    orgId: number,
    classId: number,
    date: Date,
    shift: number,
    period?: number,
  ) {
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    dayStart.setTime(dayStart.getTime() - 14 * 3600 * 1000);
    const dayEnd = new Date(date);
    dayEnd.setUTCHours(23, 59, 59, 999);
    dayEnd.setTime(dayEnd.getTime() + 14 * 3600 * 1000);

    return this.prisma.attendanceSession.findFirst({
      where: {
        orgId,
        classId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        shift,
        period: period ?? null,
      },
      include: {
        records: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async upsertAttendance(
    orgId: number,
    classId: number,
    takenById: number,
    dto: SubmitAttendanceDto,
  ) {
    const sessionDate = new Date(dto.date);
    const dayStart = new Date(dto.date);
    dayStart.setUTCHours(0, 0, 0, 0);
    dayStart.setTime(dayStart.getTime() - 14 * 3600 * 1000);
    const dayEnd = new Date(dto.date);
    dayEnd.setUTCHours(23, 59, 59, 999);
    dayEnd.setTime(dayEnd.getTime() + 14 * 3600 * 1000);

    return this.prisma.$transaction(async (tx) => {
      // 1. Find or create session
      let session = await tx.attendanceSession.findFirst({
        where: {
          orgId,
          classId,
          date: {
            gte: dayStart,
            lte: dayEnd,
          },
          shift: dto.shift,
          period: dto.period ?? null,
        },
      });

      if (session) {
        session = await tx.attendanceSession.update({
          where: { id: session.id },
          data: {
            takenById,
            schoolYearId: dto.schoolYearId,
          },
        });
      } else {
        session = await tx.attendanceSession.create({
          data: {
            orgId,
            classId,
            schoolYearId: dto.schoolYearId,
            date: sessionDate,
            shift: dto.shift,
            period: dto.period ?? null,
            takenById,
          },
        });
      }

      // 2. Upsert each record
      for (const rec of dto.records) {
        await tx.attendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId: session.id,
              studentId: rec.studentId,
            },
          },
          update: {
            status: rec.status,
            note: rec.note,
          },
          create: {
            sessionId: session.id,
            studentId: rec.studentId,
            status: rec.status,
            note: rec.note,
          },
        });
      }

      return tx.attendanceSession.findUnique({
        where: { id: session.id },
        include: {
          records: true,
        },
      });
    });
  }

  async findHistory(
    orgId: number,
    classId: number,
    fromDate?: Date,
    toDate?: Date,
    shift?: number,
  ) {
    const where: any = {
      orgId,
      classId,
    };

    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date.gte = fromDate;
      if (toDate) where.date.lte = toDate;
    }
    if (shift) {
      where.shift = shift;
    }

    return this.prisma.attendanceSession.findMany({
      where,
      include: {
        _count: { select: { records: true } },
        records: {
          select: { status: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findStudentRecords(
    studentId: number,
    fromDate?: Date,
    toDate?: Date,
  ) {
    const where: any = {
      studentId,
    };

    if (fromDate || toDate) {
      where.session = { date: {} };
      if (fromDate) where.session.date.gte = fromDate;
      if (toDate) where.session.date.lte = toDate;
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      include: {
        session: {
          select: {
            date: true,
            shift: true,
            period: true,
            class: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { session: { date: 'desc' } },
    });
  }

  async findStaffByUserId(userId: number, orgId: number) {
    return this.prisma.schoolStaff.findFirst({
      where: { userId, orgId },
    });
  }
}

