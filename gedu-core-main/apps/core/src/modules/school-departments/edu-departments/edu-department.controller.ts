import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authorization } from '../../auth/decorators/authorization.decorators';
import { User } from '../../auth/decorators/user.decorators';
import { EDRoles } from '../../auth/dto/role-enums';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CountStaffByDepartmentResponseDto,
  GetDepartmentsResponseDto,
} from './dto/department.dto';
import { EduDepartmentService } from './edu-department.service';

@ApiTags('edu-departments')
@Controller('edu-departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Authorization([EDRoles.ADMIN])
export class EduDepartmentController {
  constructor(private readonly eduDepartmentService: EduDepartmentService) { }

  @Get('')
  @ApiOperation({ summary: 'Retrieve a list of all school departments' })
  @ApiOkResponse({
    description: 'List of all school departments',
    type: GetDepartmentsResponseDto,
  })
  async getDepartments() {
    return this.eduDepartmentService.getDepartments();
  }

  @Get('/count')
  @ApiOperation({ summary: 'Count staff by department' })
  @ApiOkResponse({
    description: 'Staff count by department for the current organization',
    type: CountStaffByDepartmentResponseDto,
  })
  async countStaffByDepartment(@User('orgId') orgId: number) {
    return this.eduDepartmentService.countStaffByDepartment(orgId);
  }

  @Get('/:departmentId')
  @ApiOperation({
    summary: 'Get department detail including heads and children',
  })
  async getDepartmentDetail(
    @User('orgId') orgId: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    return this.eduDepartmentService.getFullDepartmentDetail(
      departmentId,
      orgId,
    );
  }
}
