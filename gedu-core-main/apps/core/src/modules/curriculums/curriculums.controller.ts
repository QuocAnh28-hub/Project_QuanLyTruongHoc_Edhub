import { DefaultPagination } from '@gedu/http';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../auth/decorators/authorization.decorators';
import { User } from '../auth/decorators/user.decorators';
import { ScRoles } from '../auth/dto/role-enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurriculumsService } from './curriculums.service';
import {
  CreateCurriculumDto,
  GetCurriculumsDto,
  GradeLevelParseIntPipe,
  UpdateSubjectQuickDto,
} from './dto/curriculums.request.dto';

@ApiTags('curriculums')
@Controller('curriculums')
@ApiBearerAuth()
@Authorization([ScRoles.CURRICULUM_ALL])
@UseGuards(JwtAuthGuard)
export class CurriculumsController {
  constructor(private readonly curriculumsService: CurriculumsService) {}

  @Get(':id/subjects')
  @Authorization([ScRoles.CURRICULUM_READ])
  getCurriculumBySubject(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.curriculumsService.getCurriculumBySubject(orgId, id);
  }

  @Get('')
  @Authorization([ScRoles.CURRICULUM_READ])
  getCurriculums(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
    @Query() query: GetCurriculumsDto,
  ) {
    return this.curriculumsService.getCurriculums(orgId, query);
  }

  @Get(':id')
  @Authorization([ScRoles.CURRICULUM_READ])
  findCurriculumById(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.curriculumsService.getCurriculumById(orgId, id);
  }

  @Post('')
  createCurriculum(
    @User('orgId') orgId: number,
    @Body() data: CreateCurriculumDto,
  ) {
    return this.curriculumsService.createCurriculum(orgId, data);
  }

  @Put(':id/subjects/:subjectId')
  quickUpdateCurriculumBySubject(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Query('grd', GradeLevelParseIntPipe()) grd: number,
    @Body() data: UpdateSubjectQuickDto,
  ) {
    return this.curriculumsService.quickUpdateCurriculumBySubject(
      orgId,
      id,
      subjectId,
      grd,
      data,
    );
  }
}
