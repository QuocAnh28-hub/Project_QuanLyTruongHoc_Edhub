import { DefaultPagination } from '@gedu/http';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Authorization } from '../auth/decorators/authorization.decorators';
import { User } from '../auth/decorators/user.decorators';
import { EDRoles } from '../auth/dto/role-enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActivateAdminsDto } from './dto/activate-admin.dto';
import { AddAdminResponseDto, CreateAdminDto } from './dto/create-admin.dto';
import { CreateSchoolDto } from './dto/create-schools.dto';
import { GetSchoolsDto } from './dto/get-schools.dto';
import { SchoolResponseWrapperDto } from './dto/school.response.dto';
import { UpdateSchoolDto } from './dto/update-schools.dto';
import { SchoolsService } from './schools.service';
import { CreateCampusDto, UpdateCampusDto } from './dto/campus-request.dto';
import {
  CreateCampusExample,
  UpdateSingleCampusExample,
  CreateCampusResponseDto,
  UpdateCampusResponseDto
} from './dto/campus-response.dto';
import {
  CreateFacilityDto,
  UpdateFacilityDto,
} from './dto/facility-request.dto';
import {
  CreateOperationDto,
  UpdateOperationDto,
} from './dto/operation.request.dto';

@ApiTags('schools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('schools')
@Authorization([EDRoles.ADMIN, EDRoles.MOD])
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({
    status: 201,
    description: 'School created successfully',
    type: SchoolResponseWrapperDto,
  })
  create(@User('id') userId: number, @Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a school by ID' })
  findOne(@Param('id') id: number) {
    return this.schoolsService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  findAll(@DefaultPagination() _unused: void, @Query() query: GetSchoolsDto) {
    return this.schoolsService.findAll(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a school' })
  update(@Param('id') id: number, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Post(':id/campuses')
  @ApiOperation({ summary: 'Create a single campus' })
  @ApiResponse({
    status: 201,
    description: 'Campus created successfully',
    type: CreateCampusResponseDto,
    example: CreateCampusExample
  })
  createCampus(@Param('id') id: number, @Body() campus: CreateCampusDto) {
    return this.schoolsService.createCampuses(id, [campus]);
  }

  @Put(':schoolId/campuses')
  @ApiOperation({ summary: 'Update a single campus' })
  @ApiResponse({
    status: 200,
    description: 'Campus updated successfully',
    type: UpdateCampusResponseDto,
    example: UpdateSingleCampusExample
  })
  updateCampus(
    @Param('schoolId') schoolId: number,
    @Body() campus: UpdateCampusDto,
  ) {
    return this.schoolsService.updateCampuses(schoolId, [campus]);
  }

  @Get(':id/facilities')
  @ApiOperation({ summary: 'Get school facilities' })
  getFacilities(@Param('id') schoolId: number) {
    return this.schoolsService.getFacilities(schoolId);
  }

  @Post(':id/facilities')
  @ApiOperation({ summary: 'Create school facilities' })
  createFacilities(
    @Param('id') schoolId: number,
    @Body() createFacilityDto: CreateFacilityDto,
    @User('id') userId: number,
  ) {
    return this.schoolsService.createFacilities(
      schoolId,
      createFacilityDto,
      userId,
    );
  }

  @Put(':id/facilities')
  @ApiOperation({ summary: 'Update school facilities' })
  updateFacilities(
    @Param('id') schoolId: number,
    @Body() updateFacilityDto: UpdateFacilityDto,
    @User('id') userId: number,
  ) {
    return this.schoolsService.updateFacilities(
      schoolId,
      updateFacilityDto,
      userId,
    );
  }

  @Get(':id/operations')
  @ApiOperation({ summary: 'Get school operations' })
  getOperations(@Param('id') schoolId: number) {
    return this.schoolsService.getOperations(schoolId);
  }

  @Post(':id/operations')
  @ApiOperation({ summary: 'Create school operations' })
  createOperations(
    @Param('id') schoolId: number,
    @Body() createOperationDto: CreateOperationDto,
    @User('id') userId: number,
  ) {
    return this.schoolsService.createOperations(
      schoolId,
      createOperationDto,
      userId,
    );
  }

  @Put(':id/operations')
  @ApiOperation({ summary: 'Update school operations' })
  updateOperations(
    @Param('id') schoolId: number,
    @Body() updateOperationDto: UpdateOperationDto,
    @User('id') userId: number,
  ) {
    return this.schoolsService.updateOperations(
      schoolId,
      updateOperationDto,
      userId,
    );
  }

  @Post(':id/admins')
  @ApiOperation({ summary: 'Add an admin to a school' })
  @ApiResponse({
    status: 201,
    description: 'Admin creation success',
    type: AddAdminResponseDto,
  })
  addAdmin(@Param('id') schoolId: number, @Body() userAdmin: CreateAdminDto) {
    return this.schoolsService.addAdmin(schoolId, userAdmin);
  }

  @Post(':schoolId/admins/activate')
  @ApiOperation({ summary: 'Activate one or multiple school admin accounts' })
  @HttpCode(HttpStatus.OK)
  async activateAdmins(
    @Param('schoolId') schoolId: number,
    @Body() body: ActivateAdminsDto,
  ) {
    return this.schoolsService.activateAdmins(
      schoolId,
      body.ids,
      body.password,
    );
  }

  @Get(':schoolId/management-and-quality')
  @ApiOperation({ summary: 'Get school management and education quality info' })
  getManagementAndQuality(@Param('schoolId') schoolId: number) {
    return {
      schoolId,
      management: {
        principalName: 'Nguyen Van A',
        principalPhone: '0123456789',
        principalEmail: 'principal@example.edu.vn',
        hasPartyCell: true,
      },
      educationQuality: {
        isNationalStandardSchool: true,
        qualityAssessmentCode: 'QA-2023-1234',
        qualityAssessmentLevel: 2,
        meetsMinimumEducationQuality: true,
      },
      regionClassification: {
        areaCode: 'KV1',
        regionCode: 'R2',
        isInExtremeDifficultRegion: false,
        difficultRegionCodes: ['R3', 'R4'],
      },
      operationFeatures: {
        hasDisabledStudents: true,
        hasSemiBoardingStudents: true,
        hasBoardingStudents: false,
        teachesTwoShiftsPerDay: true,
        teachesLifeSkills: true,
        hasBasicEducationProgram: true,
        hasSchoolCounselingDept: true,
      },
    };
  }
}
