import { AppError } from '@gedu/shared/errors/app.error';
import { AppException } from '@gedu/shared/errors/app.exception';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  CreateCurriculumDto,
  GetCurriculumsDto,
  UpdateSubjectQuickDto,
} from './dto/curriculums.request.dto';
import {
  CurriculumResponseDto,
  CurriculumSubjectResponseDto,
} from './dto/curriculums.response.dto';
import { CurriculumRepository } from './repository/curriculums.repository';

@Injectable()
export class CurriculumsService {
  constructor(private readonly curriculumRepository: CurriculumRepository) {}

  async getCurriculums(orgId: number, query: GetCurriculumsDto) {
    const { curriculums = [], total = 0 } =
      await this.curriculumRepository.findCurriculums(orgId, query);
    return [plainToInstance(CurriculumResponseDto, curriculums), total];
  }

  async createCurriculum(orgId: number, data: CreateCurriculumDto) {
    const createdCurriculum = await this.curriculumRepository.createCurriculum(
      orgId,
      data,
    );

    if (!createdCurriculum) {
      throw new AppError(AppException.CURRICULUM_CREATION_FAILED);
    }

    const findCurrent = await this.curriculumRepository.findCurriculumById(
      orgId,
      createdCurriculum.id,
    );

    return plainToInstance(CurriculumResponseDto, findCurrent);
  }

  async getCurriculumById(orgId: number, id: number) {
    const curriculum = await this.curriculumRepository.findCurriculumById(
      orgId,
      id,
    );

    if (!curriculum) {
      throw new AppError(AppException.CURRICULUM_NOT_FOUND_OR_ACCESS_DENIED);
    }

    return plainToInstance(CurriculumResponseDto, curriculum);
  }

  async getCurriculumBySubject(orgId: number, id: number) {
    const curriculum = await this.curriculumRepository.findCurriculumById(
      orgId,
      id,
    );

    if (!curriculum) {
      throw new AppError(AppException.CURRICULUM_NOT_FOUND_OR_ACCESS_DENIED);
    }

    const subjects = await this.curriculumRepository.findCurriculumBySubject(
      orgId,
      id,
    );

    return plainToInstance(CurriculumSubjectResponseDto, subjects);
  }

  async quickUpdateCurriculumBySubject(
    orgId: number,
    id: number,
    subjectId: number,
    grd: number,
    data: UpdateSubjectQuickDto,
  ) {
    const curriculum = await this.curriculumRepository.findCurriculumById(
      orgId,
      id,
    );

    if (!curriculum) {
      throw new AppError(AppException.CURRICULUM_NOT_FOUND_OR_ACCESS_DENIED);
    }

    if (!grd) {
      throw new AppError(AppException.GRADE_LEVEL_INVALID);
    }

    return await this.curriculumRepository.quickUpdateCurriculumBySubject(
      orgId,
      id,
      subjectId,
      grd,
      data,
    );
  }
}
