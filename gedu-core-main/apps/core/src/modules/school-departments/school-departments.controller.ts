import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SchoolDepartmentsService } from './school-departments.service';
import { User } from '../auth/decorators/user.decorators';
import { Authorization } from '../auth/decorators/authorization.decorators';
import { ScRoles } from '../auth/dto/role-enums';

@ApiTags('school-departments')
@Controller('school-departments')
@ApiBearerAuth()
@Authorization([ScRoles.DEPARTMENT_ALL])
@UseGuards(JwtAuthGuard)
export class SchoolDepartmentsController {
  constructor(
    private readonly schoolDepartmentsService: SchoolDepartmentsService,
  ) {}

  @Get('')
  @Authorization([ScRoles.DEPARTMENT_READ])
  @ApiOperation({ summary: 'Retrieve a list of all school departments' })
  @ApiQuery({
    name: 'tmpl',
    required: false,
    type: Number,
    description: 'Template ID to filter by',
  })
  async getDepartments(
    @User('orgId') orgId: number,
    @Query('tmpl') tmpl?: string,
  ) {
    const parsed = Number(tmpl);
    const templateId = tmpl && !Number.isNaN(parsed) ? parsed : undefined;

    return this.schoolDepartmentsService.getDepartments(orgId, templateId);
  }

  @Get('/count')
  @Authorization([ScRoles.DEPARTMENT_READ])
  @ApiOperation({ summary: 'Count staff by department' })
  @ApiQuery({
    name: 'tmpl',
    required: false,
    description: 'Template ID to filter by',
  })
  async countStaffByDepartment(
    @User('orgId') orgId: number,
    @Query('tmpl') tmpl?: string,
  ) {
    const parsed = Number(tmpl);
    const templateId = tmpl && !Number.isNaN(parsed) ? parsed : undefined;

    return this.schoolDepartmentsService.countStaffByDepartment(
      templateId,
      orgId,
    );
  }

  @Get('/:departmentId')
  @ApiOperation({
    summary: 'Get department detail including heads and children',
  })
  @Authorization([ScRoles.DEPARTMENT_READ])
  async getDepartmentDetail(
    @User('orgId') orgId: number,
    @Param('departmentId') departmentId: number,
  ) {
    return this.schoolDepartmentsService.getFullDepartmentDetail(
      departmentId,
      orgId,
    );
  }
}
