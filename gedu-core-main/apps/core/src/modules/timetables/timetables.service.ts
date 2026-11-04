import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TimetableRepository } from './repository/timetable.repository';
import {
  CreatePeriodDto,
  QueryScheduleDto,
  SaveClassScheduleDto,
  UpdatePeriodDto,
} from './dto/timetable.dto';

@Injectable()
export class TimetablesService {
  constructor(private readonly repository: TimetableRepository) {}

  // --- PERIODS ---

  async getPeriods(orgId: number) {
    const periods = await this.repository.findPeriods(orgId);
    if (periods.length === 0) {
      return this.repository.initDefaultPeriods(orgId);
    }
    return periods;
  }

  async createPeriod(orgId: number, dto: CreatePeriodDto) {
    return this.repository.createPeriod(orgId, dto);
  }

  async updatePeriod(orgId: number, id: number, dto: UpdatePeriodDto) {
    return this.repository.updatePeriod(orgId, id, dto);
  }

  async initDefaultPeriods(orgId: number) {
    return this.repository.initDefaultPeriods(orgId);
  }

  // --- SCHEDULES ---

  async getClassTimetable(
    orgId: number,
    classId: number,
    query: QueryScheduleDto,
  ) {
    const rawSchedules = await this.repository.findClassSchedules(
      orgId,
      classId,
      query.schoolYearId,
      query.semesterId,
    );

    // Build matrix: days 2..8 (Mon..Sun) -> periods 1..10
    const matrix: Record<number, Record<number, any>> = {};
    for (let day = 2; day <= 8; day++) {
      matrix[day] = {};
    }

    for (const item of rawSchedules) {
      matrix[item.dayOfWeek][item.period] = {
        scheduleId: item.id,
        subjectId: item.subjectId,
        subjectName: item.subject?.name,
        subjectCode: item.subject?.code,
        teacherId: item.teacherId,
        teacherName: item.teacher?.user
          ? `${item.teacher.user.lastName} ${item.teacher.user.firstName}`
          : null,
        roomNumber: item.roomNumber,
        note: item.note,
      };
    }

    return {
      classId,
      schoolYearId: query.schoolYearId,
      semesterId: query.semesterId,
      schedules: rawSchedules,
      matrix,
    };
  }

  async saveClassTimetable(
    orgId: number,
    classId: number,
    dto: SaveClassScheduleDto,
  ) {
    // Conflict detection for assigned teachers
    for (const item of dto.schedules) {
      if (item.teacherId) {
        const conflict = await this.repository.checkTeacherConflict(
          orgId,
          item.teacherId,
          item.dayOfWeek,
          item.period,
          dto.schoolYearId,
          dto.semesterId,
          classId,
        );

        if (conflict) {
          throw new BadRequestException(
            `Xung đột lịch: Giáo viên đã có lịch dạy lớp "${conflict.class?.name}" vào Thứ ${item.dayOfWeek}, Tiết ${item.period}!`,
          );
        }
      }
    }

    return this.repository.saveClassSchedules(orgId, classId, dto);
  }

  async getTeacherTimetable(
    orgId: number,
    teacherId: number,
    query: QueryScheduleDto,
  ) {
    const rawSchedules = await this.repository.findTeacherSchedules(
      orgId,
      teacherId,
      query.schoolYearId,
      query.semesterId,
    );

    const matrix: Record<number, Record<number, any>> = {};
    for (let day = 2; day <= 8; day++) {
      matrix[day] = {};
    }

    for (const item of rawSchedules) {
      matrix[item.dayOfWeek][item.period] = {
        scheduleId: item.id,
        classId: item.classId,
        className: item.class?.name,
        classCode: item.class?.code,
        subjectId: item.subjectId,
        subjectName: item.subject?.name,
        roomNumber: item.roomNumber,
        note: item.note,
      };
    }

    return {
      teacherId,
      schoolYearId: query.schoolYearId,
      semesterId: query.semesterId,
      schedules: rawSchedules,
      matrix,
    };
  }

  async getMySchedule(userId: number, orgId: number, query: QueryScheduleDto) {
    const staff = await this.repository.findStaffByUserId(userId, orgId);
    if (!staff) {
      return { teacherId: null, schedules: [], matrix: {} };
    }
    return this.getTeacherTimetable(orgId, staff.id, query);
  }

  async deleteScheduleItem(orgId: number, id: number) {
    const res = await this.repository.deleteScheduleById(orgId, id);
    if (res.count === 0) {
      throw new NotFoundException(`Tiết học TKB #${id} không tồn tại`);
    }
    return { success: true, message: 'Đã xóa tiết học khỏi thời khóa biểu' };
  }
}

