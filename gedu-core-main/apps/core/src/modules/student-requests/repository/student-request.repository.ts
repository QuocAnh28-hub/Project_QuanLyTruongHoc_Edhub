import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import {
  CreateStudentRequestDto,
  QueryStudentRequestDto,
  ReviewStudentRequestDto,
} from '../dto/student-request.dto';

@Injectable()
export class StudentRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(
    orgId: number,
    submittedBy: number,
    dto: CreateStudentRequestDto,
  ) {
    return this.prisma.studentEditRequest.create({
      data: {
        orgId,
        studentId: dto.studentId,
        submittedBy,
        content: dto.content,
        status: 1, // PENDING
      },
      include: {
        student: {
          select: {
            id: true,
            code: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async findRequests(orgId: number, query: QueryStudentRequestDto) {
    const where: any = { orgId };
    if (query.status) where.status = query.status;
    if (query.studentId) where.studentId = query.studentId;

    return this.prisma.studentEditRequest.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            code: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(orgId: number, id: number) {
    return this.prisma.studentEditRequest.findFirst({
      where: { id, orgId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findByStudent(studentId: number) {
    return this.prisma.studentEditRequest.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReview(
    orgId: number,
    id: number,
    reviewedBy: number,
    dto: ReviewStudentRequestDto,
  ) {
    return this.prisma.studentEditRequest.updateMany({
      where: { id, orgId },
      data: {
        status: dto.status,
        reviewedBy,
        reviewNote: dto.reviewNote ?? null,
        reviewedAt: new Date(),
      },
    });
  }
}

