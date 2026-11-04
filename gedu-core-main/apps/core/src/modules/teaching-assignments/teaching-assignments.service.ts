import { Injectable, NotFoundException } from '@nestjs/common';
import { TeachingAssignmentRepository } from './repository/teaching-assignment.repository';
import {
  BatchTeachingAssignmentDto,
  QueryTeachingAssignmentDto,
} from './dto/teaching-assignment.dto';

@Injectable()
export class TeachingAssignmentsService {
  constructor(
    private readonly repository: TeachingAssignmentRepository,
  ) {}

  async assignBatch(orgId: number, dto: BatchTeachingAssignmentDto) {
    return this.repository.upsertBatch(orgId, dto.assignments);
  }

  async getAssignments(orgId: number, query: QueryTeachingAssignmentDto) {
    return this.repository.findAssignments(orgId, query);
  }

  async getMyAssignments(userId: number, orgId: number) {
    const staff = await this.repository.findStaffByUserId(userId, orgId);
    if (!staff) {
      return [];
    }
    return this.repository.findAssignments(orgId, { staffId: staff.id });
  }

  async getAssignmentById(orgId: number, id: number) {
    const assignment = await this.repository.findById(orgId, id);
    if (!assignment) {
      throw new NotFoundException(`Phân công giảng dạy #${id} không tồn tại`);
    }
    return assignment;
  }

  async deleteAssignment(orgId: number, id: number) {
    const res = await this.repository.deleteById(orgId, id);
    if (res.count === 0) {
      throw new NotFoundException(`Phân công giảng dạy #${id} không tồn tại`);
    }
    return { success: true, message: 'Đã xóa phân công giảng dạy thành công' };
  }
}

