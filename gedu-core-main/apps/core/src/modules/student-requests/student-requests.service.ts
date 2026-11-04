import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentRequestRepository } from './repository/student-request.repository';
import {
  CreateStudentRequestDto,
  QueryStudentRequestDto,
  ReviewStudentRequestDto,
} from './dto/student-request.dto';

@Injectable()
export class StudentRequestsService {
  constructor(private readonly repository: StudentRequestRepository) {}

  async createRequest(
    orgId: number,
    userId: number,
    dto: CreateStudentRequestDto,
  ) {
    return this.repository.createRequest(orgId, userId, dto);
  }

  async getRequests(orgId: number, query: QueryStudentRequestDto) {
    return this.repository.findRequests(orgId, query);
  }

  async getRequestById(orgId: number, id: number) {
    const item = await this.repository.findById(orgId, id);
    if (!item) {
      throw new NotFoundException(`Yêu cầu #${id} không tồn tại`);
    }
    return item;
  }

  async reviewRequest(
    orgId: number,
    id: number,
    reviewerId: number,
    dto: ReviewStudentRequestDto,
  ) {
    const res = await this.repository.updateReview(orgId, id, reviewerId, dto);
    if (res.count === 0) {
      throw new NotFoundException(`Yêu cầu #${id} không tồn tại`);
    }
    return {
      success: true,
      message:
        dto.status === 2
          ? 'Đã phê duyệt yêu cầu thành công'
          : 'Đã từ chối yêu cầu',
    };
  }

  async getStudentRequests(studentId: number) {
    return this.repository.findByStudent(studentId);
  }
}

