import { DefaultPagination } from '@gedu/http';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetStudentByClassIdDto } from '../../students/contact-student/dto/contact-student.request.dto';
import { ClassesService } from './classes.service';
import {
  CreateClassGroupDto,
  GetClassesRequestDto,
  UpdateClassDto,
  UpdateClassesInfoDto,
} from './dto/classes.request.dto';
import { Authorization } from '../../auth/decorators/authorization.decorators';
import { ScRoles } from '../../auth/dto/role-enums';

@Controller('classes')
@ApiTags('classes')
@ApiBearerAuth()
@Authorization([ScRoles.GRADE_ALL])
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post('batch')
  async createClasses(
    @User('orgId') orgId: number,
    @Body() body: CreateClassGroupDto,
  ) {
    return this.classesService.createClasses(orgId, body);
  }

  @Get('')
  @Authorization([ScRoles.GRADE_READ])
  async getClasses(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
    @Query() query: GetClassesRequestDto,
  ) {
    return this.classesService.getClasses(orgId, query);
  }

  @Get(':classId')
  @Authorization([ScRoles.GRADE_READ])
  @ApiOperation({
    summary: 'Get class details by ID',
  })
  async getClassById(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
  ): Promise<any> {
    return this.classesService.getClassById(orgId, classId);
  }

  @Patch(':classId')
  @ApiOperation({
    summary: 'Patch classes',
  })
  patchClass(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Body() request: UpdateClassesInfoDto,
  ) {
    return this.classesService.updateInfoClasses(orgId, classId, request);
  }

  @Put(':classId')
  @ApiOperation({
    summary: 'Update classes',
  })
  updateClass(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Body() request: UpdateClassDto,
  ) {
    return this.classesService.updateClasses(orgId, classId, request);
  }

  @Get(':classId/students')
  @Authorization([ScRoles.GRADE_READ])
  @ApiOperation({
    summary: 'Get students in a class by class ID',
  })
  async getStudentsInClass(
    @DefaultPagination() _unused: undefined,
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query() request: GetStudentByClassIdDto,
  ) {
    return this.classesService.getStudentsInClass(orgId, classId, request);
  }
}
