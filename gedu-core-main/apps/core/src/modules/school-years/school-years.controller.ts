import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SchoolYearsService } from './school-years.service';

import { DefaultPagination } from '@gedu/http';
import {
  CreateSchoolYearsDto,
  UpdateSchoolYearDto,
} from './dto/school-years.request.dto';
import { ScRoles } from '../auth/dto/role-enums';
import { Authorization } from '../auth/decorators/authorization.decorators';

@Controller('school-years')
@ApiTags('school-years')
@ApiBearerAuth()
@Authorization([ScRoles.SCHOOLYEAR_ALL])
@UseGuards(JwtAuthGuard)
export class SchoolYearsController {
  constructor(private readonly schoolYearsService: SchoolYearsService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all school years for the organization',
  })
  @Authorization([ScRoles.SCHOOLYEAR_READ])
  async getSchoolYears(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
  ) {
    return this.schoolYearsService.getSchoolYears(orgId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific school year by ID',
  })
  @Authorization([ScRoles.SCHOOLYEAR_READ])
  async getSchoolYear(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) schoolYearId: number,
  ) {
    return this.schoolYearsService.getSchoolYear(orgId, schoolYearId);
  }

  @Post('')
  @ApiOperation({
    summary: 'Create a new school year for school',
  })
  async createSchoolYears(
    @User('orgId') orgId: number,
    @Body() request: CreateSchoolYearsDto,
  ) {
    return this.schoolYearsService.createSchoolYear(orgId, request);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing school year',
  })
  async updateSchoolYear(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) schoolYearId: number,
    @Body() request: UpdateSchoolYearDto,
  ) {
    return this.schoolYearsService.updateSchoolYear(
      orgId,
      schoolYearId,
      request,
    );
  }

  @Post(':id/start')
  @ApiOperation({
    summary: 'Start a school year',
  })
  async startSchoolYear(  
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) schoolYearId: number,
  ) {
    return this.schoolYearsService.startSchoolYear(orgId, schoolYearId);
  }
}
