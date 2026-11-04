import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SharesService } from './shares.service';
import { User } from '../auth/decorators/user.decorators';
import { GetClassesQueryDto } from '../schools/dto/get-classes.dto';
import {
  GetCurriculumDto,
  GetSchoolPositionsDto,
} from './dto/get-school-positions.dto';
import { GetWardsCommunesQueryDto } from './dto/get-wards-communes.dto';

@ApiTags('shares')
@Controller('shares')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Get('student-priority-policies')
  @ApiOperation({ summary: 'Retrieve student priority policies' })
  getPriorityPolicies() {
    return this.sharesService.getPriorityPolicies();
  }

  @Get('student-special-needs-policies')
  @ApiOperation({ summary: 'Retrieve student special needs policies' })
  getPriorityNeededPolicies() {
    return this.sharesService.getPriorityNeededPolicies();
  }

  @Get('nations')
  @ApiOperation({ summary: 'Retrieve a list of all nations' })
  async getNations() {
    return this.sharesService.getNations();
  }

  @Get('countries')
  @ApiOperation({ summary: 'Retrieve a list of all countries' })
  async getCountries() {
    return this.sharesService.getCountries();
  }

  @Get('school-positions')
  @ApiOperation({ summary: 'Retrieve list of school positions' })
  async getSchoolPositions(
    @User('orgId') orgId: number,
    @Query() query: GetSchoolPositionsDto,
  ) {
    const { tmpl, dept } = query;
    const parsed = Number(tmpl);
    const templateId = tmpl && !Number.isNaN(parsed) ? parsed : undefined;
    const departmentId = dept ? parseInt(dept, 10) : undefined;

    return this.sharesService.getSchoolPositions(orgId, {
      templateId,
      departmentId,
    });
  }

  @Get('school-departments')
  @ApiOperation({ summary: 'Retrieve list of school departments' })
  @ApiQuery({
    name: 'tmpl',
    required: false,
    type: Number,
    description: 'Template ID (optional)',
  })
  async getSchoolDepartments(
    @User('orgId') orgId: number,
    @Query('tmpl') tmpl?: string,
  ) {
    const parsed = Number(tmpl);
    const templateId = tmpl && !Number.isNaN(parsed) ? parsed : undefined;

    return this.sharesService.getDepartments(orgId, templateId);
  }

  @Get('ethnics')
  @ApiOperation({ summary: 'Retrieve a list of all ethnics' })
  async getEthnics() {
    return this.sharesService.getEthnics();
  }

  @Get('religions')
  @ApiOperation({ summary: 'Retrieve a list of all religions' })
  async getReligions() {
    return this.sharesService.getReligions();
  }

  @Get('school-years')
  @ApiOperation({
    summary: "Retrieve all school years for the user's organization",
  })
  getSchoolYears(@User('orgId') orgId: number) {
    return this.sharesService.getSchoolYears(orgId);
  }

  @Get('school-years/:schoolYearId/classes')
  @ApiOperation({
    summary:
      'Get list of classes for a school year, optionally filtered by grade level',
  })
  getClasses(
    @User('orgId') orgId: number,
    @Param('schoolYearId', ParseIntPipe) schoolYearId: number,
    @Query() query: GetClassesQueryDto,
  ) {
    return this.sharesService.getClasses(orgId, schoolYearId, query.grd);
  }

  @Get('instruction-languages')
  @ApiOperation({ summary: 'Retrieve a list of instruction languages' })
  async getInstructionLanguages() {
    return this.sharesService.getInstructionLanguages();
  }

  @Get('foreign-languages')
  @ApiOperation({ summary: 'Retrieve a list of foreign languages' })
  async getForeignLanguages() {
    return this.sharesService.getForeignLanguages();
  }

  @Get('provinces-cities')
  @ApiOperation({ summary: 'Retrieve a list of all provinces-cities' })
  async getProvincesCities() {
    return this.sharesService.getProvincesCities();
  }

  @Get('wards-communes')
  @ApiOperation({ summary: 'Get list of wards-communes by provinces-cities' })
  async getWardsCommunes(@Query() query: GetWardsCommunesQueryDto) {
    return this.sharesService.findWardsCommunes(query.provincesCitiesId);
  }

  @Get('curriculums')
  @ApiOperation({ summary: 'Retrieve a list of curriculums' })
  async getCurriculums(
    @User('orgId') orgId: number,
    @Query() query: GetCurriculumDto,
  ) {
    return this.sharesService.getCurriculums(orgId, query);
  }

  @Get('homeroom-teachers')
  @ApiOperation({ summary: 'Retrieve a list of home room teachers' })
  async getHomeroomTeachers(@User('orgId') orgId: number) {
    return this.sharesService.getHomeroomTeachers(orgId);
  }
}
