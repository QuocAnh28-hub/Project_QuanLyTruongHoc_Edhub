import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from './repository/attendance.repository';
import {
  AttendanceHistoryQueryDto,
  AttendanceStatus,
  GetSessionQueryDto,
  SubmitAttendanceDto,
} from './dto/attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(private readonly repository: AttendanceRepository) {}

  async getClassSession(
    orgId: number,
    classId: number,
    query: GetSessionQueryDto,
  ) {
    const sessionDate = new Date(query.date);
    const shift = query.shift ?? 1;
    const existing = await this.repository.findSession(
      orgId,
      classId,
      sessionDate,
      shift,
      query.period,
    );

    if (existing) {
      const records = existing.records.map((r) => ({
        recordId: r.id,
        attendanceId: r.id,
        studentId: r.studentId,
        studentCode: r.student.code,
        firstName: r.student.user?.firstName ?? '',
        lastName: r.student.user?.lastName ?? '',
        avatar: r.student.user?.avatar,
        status: r.status,
        note: r.note,
      }));

      const totalStudents = records.length;
      const present = records.filter(
        (r) => r.status === AttendanceStatus.PRESENT,
      ).length;
      const absentExcused = records.filter(
        (r) => r.status === AttendanceStatus.EXCUSED_ABSENCE,
      ).length;
      const absentUnexcused = records.filter(
        (r) => r.status === AttendanceStatus.UNEXCUSED_ABSENCE,
      ).length;
      const late = records.filter(
        (r) => r.status === AttendanceStatus.LATE,
      ).length;
      const attendanceRate =
        totalStudents > 0
          ? Math.round((present / totalStudents) * 100)
          : 100;

      return {
        isSubmitted: true,
        sessionId: existing.id,
        classId,
        date: existing.date,
        shift: existing.shift,
        period: existing.period,
        summary: {
          totalStudents,
          present,
          absentExcused,
          absentUnexcused,
          late,
          attendanceRate,
        },
        records,
        students: records,
      };
    }

    // Not yet submitted: return class student roster with default PRESENT (1)
    const students = await this.repository.getClassStudents(orgId, classId);
    const records = students.map((sc) => ({
      recordId: null,
      attendanceId: null,
      studentId: sc.student.id,
      studentCode: sc.student.code,
      firstName: sc.student.user?.firstName ?? '',
      lastName: sc.student.user?.lastName ?? '',
      avatar: sc.student.user?.avatar,
      status: AttendanceStatus.PRESENT,
      note: '',
    }));

    return {
      isSubmitted: false,
      sessionId: null,
      classId,
      date: sessionDate,
      shift,
      period: query.period ?? null,
      summary: {
        totalStudents: records.length,
        present: records.length,
        absentExcused: 0,
        absentUnexcused: 0,
        late: 0,
        attendanceRate: 100,
      },
      records,
      students: records,
    };
  }

  async submitAttendance(
    orgId: number,
    classId: number,
    userId: number,
    dto: SubmitAttendanceDto,
  ) {
    const staff = await this.repository.findStaffByUserId(userId, orgId);
    const takenById = staff?.id ?? userId;
    return this.repository.upsertAttendance(orgId, classId, takenById, dto);
  }

  async getClassHistory(
    orgId: number,
    classId: number,
    query: AttendanceHistoryQueryDto,
  ) {
    const fromDate = query.fromDate ? new Date(query.fromDate) : undefined;
    const toDate = query.toDate ? new Date(query.toDate) : undefined;

    const sessions = await this.repository.findHistory(
      orgId,
      classId,
      fromDate,
      toDate,
      query.shift,
    );

    return sessions.map((s) => {
      const counts = {
        present: 0,
        excused: 0,
        unexcused: 0,
        late: 0,
      };

      for (const rec of s.records) {
        if (rec.status === AttendanceStatus.PRESENT) counts.present++;
        else if (rec.status === AttendanceStatus.EXCUSED_ABSENCE) counts.excused++;
        else if (rec.status === AttendanceStatus.UNEXCUSED_ABSENCE) counts.unexcused++;
        else if (rec.status === AttendanceStatus.LATE) counts.late++;
      }

      const total = s._count.records;
      const rate = total > 0 ? Math.round((counts.present / total) * 1000) / 10 : 0;

      return {
        id: s.id,
        date: s.date,
        shift: s.shift,
        period: s.period,
        totalStudents: total,
        counts,
        attendanceRate: rate,
      };
    });
  }

  async getStudentSummary(studentId: number, fromDate?: string, toDate?: string) {
    const from = fromDate ? new Date(fromDate) : undefined;
    const to = toDate ? new Date(toDate) : undefined;

    const records = await this.repository.findStudentRecords(studentId, from, to);

    const counts = {
      total: records.length,
      present: 0,
      excused: 0,
      unexcused: 0,
      late: 0,
    };

    for (const r of records) {
      if (r.status === AttendanceStatus.PRESENT) counts.present++;
      else if (r.status === AttendanceStatus.EXCUSED_ABSENCE) counts.excused++;
      else if (r.status === AttendanceStatus.UNEXCUSED_ABSENCE) counts.unexcused++;
      else if (r.status === AttendanceStatus.LATE) counts.late++;
    }

    const attendanceRate =
      counts.total > 0
        ? Math.round((counts.present / counts.total) * 1000) / 10
        : 100;

    return {
      studentId,
      statistics: {
        ...counts,
        attendanceRate,
      },
      history: records,
    };
  }

  async getClassStatistics(
    orgId: number,
    classId: number,
    query: AttendanceHistoryQueryDto,
  ) {
    const history = await this.getClassHistory(orgId, classId, query);
    const totalSessions = history.length;
    let sumRate = 0;
    let totalPresent = 0;
    let totalExcused = 0;
    let totalUnexcused = 0;
    let totalLate = 0;

    for (const h of history) {
      sumRate += h.attendanceRate;
      totalPresent += h.counts.present;
      totalExcused += h.counts.excused;
      totalUnexcused += h.counts.unexcused;
      totalLate += h.counts.late;
    }

    const averageAttendanceRate =
      totalSessions > 0 ? Math.round((sumRate / totalSessions) * 10) / 10 : 0;

    return {
      classId,
      totalSessions,
      averageAttendanceRate,
      totals: {
        present: totalPresent,
        excused: totalExcused,
        unexcused: totalUnexcused,
        late: totalLate,
      },
      sessions: history,
    };
  }
}

