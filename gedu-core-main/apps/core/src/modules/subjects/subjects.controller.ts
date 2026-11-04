import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorators';
import { DefaultPagination } from '@gedu/http';
import { SubjectsService } from './subjects.service';
import { PositiveIntPipe } from '@gedu/shared';
import { UpdateSubjectRequestDto } from './dto/subject.request.dto';
import { ScRoles } from '../auth/dto/role-enums';
import { Authorization } from '../auth/decorators/authorization.decorators';

@ApiTags('subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Authorization([ScRoles.CURRICULUM_ALL])
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @Authorization([ScRoles.CURRICULUM_READ])
  @ApiOperation({ summary: 'Update subject by ID' })
  async getSubjects(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
  ) {
    return this.subjectsService.getSubjects(orgId);
  }

  @Get(':subjectId')
  @Authorization([ScRoles.CURRICULUM_READ])
  @ApiOperation({ summary: 'Retrieve subject details by ID' })
  async getSubjectById(
    @User('orgId') orgId: number,
    @Param('subjectId', PositiveIntPipe) subjectId: number,
  ) {
    return this.subjectsService.findOne(subjectId, orgId);
  }

  @Put(':subjectId')
  @ApiOperation({
    summary: 'Retrieve all curriculums that include this subject',
  })
  async updateSubject(
    @User('orgId') orgId: number,
    @Param('subjectId', PositiveIntPipe) subjectId: number,
    @Body() data: UpdateSubjectRequestDto,
  ) {
    return this.subjectsService.updateSubject(subjectId, orgId, data);
  }

  @Get('/:subjectId/curriculums')
  @Authorization([ScRoles.CURRICULUM_READ])
  @ApiOperation({
    summary: 'Retrieve all curriculums that include this subject',
  })
  async getSubjectsByCurriculum(
    @User('orgId') orgId: number,
    @Param('subjectId', PositiveIntPipe) subjectId: number,
  ) {
    return this.subjectsService.findCurriculumsBySubjectId(orgId, subjectId);
  }

  @Put(':subjectId/activate')
  @ApiOperation({ summary: 'Activate a subject by ID' })
  async activateSubject(
    @User('orgId') orgId: number,
    @Param('subjectId', PositiveIntPipe) subjectId: number,
  ) {
    return this.subjectsService.activateSubject(subjectId, orgId);
  }

  @Put(':subjectId/deactivate')
  @ApiOperation({ summary: 'Deactivate a subject by ID' })
  async deactivateSubject(
    @User('orgId') orgId: number,
    @Param('subjectId', PositiveIntPipe) subjectId: number,
  ) {
    return this.subjectsService.deactivateSubject(subjectId, orgId);
  }
}
