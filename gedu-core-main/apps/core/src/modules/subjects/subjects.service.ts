import { Injectable } from '@nestjs/common';
import { SubjectResponseDto } from './dto/subject.response.dto';
import { SubjectsRepository } from './subjects.repository';
import { AppError, AppException } from '@gedu/shared';
import { UpdateSubjectRequestDto } from './dto/subject.request.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly subjectsRepo: SubjectsRepository) {}

  async getSubjects(orgId: number) {
    return this.subjectsRepo.findSubjectsWithCount(orgId);
  }

  async findOne(id: number, orgId: number): Promise<SubjectResponseDto> {
    return this.subjectsRepo.findOneWithDetail(id, orgId);
  }

  async findCurriculumsBySubjectId(orgId: number, subjectId: number) {
    const items = await this.subjectsRepo.findCurriculumsGroupedBySubjectId(
      orgId,
      subjectId,
    );

    const grouped = new Map<number, any>();

    for (const item of items) {
      const { curriculum } = item;
      if (!grouped.has(curriculum.id)) {
        grouped.set(curriculum.id, {
          id: curriculum.id,
          code: curriculum.code,
          name: curriculum.name,
          assignedGradeLevels: [],
        });
      }

      grouped.get(curriculum.id).assignedGradeLevels.push({
        id: item.id,
        name: item.gradeLevel,
        subjectType: item.type,
        commentsBased: item.commentsBased,
        scoringBased: item.scoringBased,
        lessonsPerWeek: item.lessonsPerWeek,
      });
    }

    return Array.from(grouped.values());
  }

  async updateSubject(
    subjectId: number,
    orgId: number,
    data: UpdateSubjectRequestDto,
  ) {
    return this.subjectsRepo.updateSubject(subjectId, orgId, data);
  }

  async activateSubject(subjectId: number, orgId: number) {
    return this.subjectsRepo.activateSubject(subjectId, orgId);
  }

  async deactivateSubject(subjectId: number, orgId: number) {
    return this.subjectsRepo.deactivateSubject(subjectId, orgId);
  }
}
