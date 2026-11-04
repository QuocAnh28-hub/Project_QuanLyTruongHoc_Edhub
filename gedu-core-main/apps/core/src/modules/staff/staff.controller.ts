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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Authorization } from '../auth/decorators/authorization.decorators';
import { User } from '../auth/decorators/user.decorators';
import { ScRoles } from '../auth/dto/role-enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ActivateStaffDto,
  CreateStaffDto,
  GetStaffDto,
  SyncStaffFoldersRequestDto,
  UpdateDepartmentDto,
  UpdateStaffDto,
} from './dto/staff.request.dto';
import { StaffService } from './staff.service';
import {
  SchoolStaffPositionAuthorityResponseExample,
  StaffFolderResponseExample,
} from './dto/staff.response.dto';

@ApiTags('staffs')
@Controller('staffs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Authorization([ScRoles.STAFF_ALL])
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @Authorization([ScRoles.STAFF_READ])
  @ApiOperation({ summary: 'Get a list of staff by organization' })
  getStaff(
    @DefaultPagination() _unused: void,
    @User('orgId') orgId: number,
    @Query() query: GetStaffDto,
  ) {
    return this.staffService.findAll(orgId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new staff member' })
  createStaff(@User('orgId') orgId: number, @Body() request: CreateStaffDto) {
    return this.staffService.create(orgId, request);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update staff information by ID' })
  updateStaff(
    @User('orgId') orgId: number,
    @Param('id') id: number,
    @Body() request: UpdateStaffDto,
  ) {
    return this.staffService.updateStaff(id, orgId, request);
  }

  @Get(':id')
  @Authorization([ScRoles.STAFF_READ])
  @ApiOperation({ summary: 'Get staff details by ID' })
  findOne(@User('orgId') orgId: number, @Param('id') id: number) {
    return this.staffService.getStaffById(orgId, id);
  }

  @Get(':id/authorities')
  @Authorization([ScRoles.STAFF_READ])
  @ApiOperation({ summary: 'Get staff authorities by ID' })
  @ApiOkResponse({
    description: 'Staff authorities retrieved successfully',
    schema: { example: SchoolStaffPositionAuthorityResponseExample },
  })
  getStaffAuthorities(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.staffService.getStaffAuthorities(orgId, id);
  }

  @Get(':id/folders')
  @ApiOperation({ summary: 'Get staff folders by ID' })
  @ApiOkResponse({
    description: 'List of staff folders with files',
    schema: { example: StaffFolderResponseExample },
  })
  findStaffFolders(@User('orgId') orgId: number, @Param('id') id: number) {
    return this.staffService.getStaffFolders(orgId, id);
  }

  @Put(':id/folders')
  @ApiOperation({ summary: 'Update staff folder by ID' })
  @ApiOkResponse({
    description: 'Updated staff folder with files',
    schema: { example: { response: true } },
  })
  updateStaffFolder(
    @User('orgId') orgId: number,
    @User('id') userId: number,
    @Param('id') staffId: number,
    @Body() body: SyncStaffFoldersRequestDto,
  ) {
    return this.staffService.syncFolderWithFiles(orgId, userId, staffId, body);
  }

  @Patch('/activate')
  @ApiOperation({ summary: 'Activate one or multiple staff accounts' })
  activateStaff(@User('orgId') orgId: number, @Body() dto: ActivateStaffDto) {
    return this.staffService.activeStaff(orgId, dto.ids);
  }

  @Get(':id/contracts-benefits')
  @Authorization([ScRoles.STAFF_READ])
  @ApiOperation({
    summary: 'Get contracts and benefits info of a staff member',
  })
  getContractAndBenefits(
    @User('orgId') orgId: number,
    @Param('id') id: number,
  ) {
    return this.staffService.getContractAndBenefits(orgId, id);
  }

  @Patch(':staffId/assign-department')
  @ApiOperation({ summary: 'Assign department and position to a staff member' })
  assignDepartment(
    @User('orgId') orgId: number,
    @Param('staffId') id: number,
    @Body() request: UpdateDepartmentDto,
  ) {
    return this.staffService.assignDepartmentAndPosition(orgId, id, request);
  }

  @Get(':id/specialization-and-teaching')
  @Authorization([ScRoles.STAFF_READ])
  @ApiOperation({
    summary: 'Get specialization and teaching information of a staff member',
  })
  getSpecializationAndTeaching(
    @User('orgId') orgId: number,
    @Param('id') id: number,
  ) {
    return this.staffService.getSpecializationAndTeaching(orgId, id);
  }

  @Get(':id/expertise-and-teaching')
  @ApiOperation({
    summary: 'Get expertise and teaching info of a staff member',
  })
  getExpertiseAndTeaching(@Param('id') id: number) {
    return {
      staffId: id,
      expertiseAndTeaching: {
        teachingAssignments: [
          {
            schoolYear: '2023–2024',
            positionTitle: 'Giáo viên',
            subjects: [
              {
                subjectName: 'Toán',
                teachingClasses: ['6A', '6B', '7A'],
              },
              {
                subjectName: 'Tin học',
                teachingClasses: ['7B', '8A'],
              },
            ],
            additionalResponsibilities: 'Tổ trưởng chuyên môn',
            homeroomClass: '9A',
          },
          {
            schoolYear: '2022–2023',
            positionTitle: 'Giáo viên',
            subjects: [
              {
                subjectName: 'Toán',
                teachingClasses: ['6C', '7C'],
              },
            ],
            additionalResponsibilities: 'Không',
            homeroomClass: '9B',
          },
        ],
        qualifications: {
          highestAcademicDegree: 'Đại học',
          professionalQualification: 'Cử nhân Sư phạm Toán',
          major: 'Giáo dục Toán học',
          foreignLanguageLevel: 'B1 tiếng Anh',
          itLevel: 'Chứng chỉ ứng dụng CNTT cơ bản',
          politicalTheoryLevel: 'Trung cấp lý luận chính trị',
          educationManagementLevel: 'Chứng chỉ bồi dưỡng cán bộ quản lý',
        },
        trainings: [
          {
            year: 2023,
            description: 'Tập huấn triển khai chương trình mới',
          },
          {
            year: 2022,
            description: 'Tập huấn giáo dục STEM',
          },
        ],
        professionalAchievements: {
          annualEvaluationResult: 'Hoàn thành tốt nhiệm vụ',
          excellentTeacherCode: 'GVG2023-TOAN',
        },
      },
    };
  }

  @Get(':id/rewards-and-discipline')
  @ApiOperation({
    summary: 'Get rewards and disciplinary records of a staff member',
  })
  getRewardsAndDiscipline(@Param('id') id: number) {
    return {
      staffId: id,
      rewardsAndDiscipline: {
        rewards: [
          {
            date: '2023-11-20',
            title: 'Bằng khen giáo viên xuất sắc cấp thành phố',
          },
          {
            date: '2021-09-05',
            title: 'Giấy khen hoàn thành tốt nhiệm vụ',
          },
        ],
        disciplines: [
          {
            date: '2019-03-15',
            title: 'Khiển trách do vi phạm quy chế thi',
          },
        ],
      },
    };
  }

  @Get(':id/records-and-documents')
  @ApiOperation({ summary: 'Get records and documents of a staff member' })
  getRecordsAndDocuments(@Param('id') id: number) {
    return {
      staffId: id,
      recordsAndDocuments: [
        {
          name: 'Chứng chỉ bồi dưỡng nghiệp vụ quản lý giáo dục',
          issuer: 'Trường ĐH Sư phạm Hà Nội',
          issuedYear: 2022,
          referenceNumber: 'CC-QLGD-2022-001',
          attachmentUrl: 'https://example.com/files/qlgd-cert-2022.pdf',
        },
        {
          name: 'Bằng tốt nghiệp đại học',
          issuer: 'Trường ĐH Sư phạm TP.HCM',
          issuedYear: 2015,
          referenceNumber: 'BANG-DH-2015-055',
          attachmentUrl: 'https://example.com/files/daihoc-2015.pdf',
        },
        {
          name: 'Chứng chỉ ứng dụng CNTT cơ bản',
          issuer: 'Sở GD&ĐT Hà Nội',
          issuedYear: 2020,
          referenceNumber: 'CNTT-CB-2020-033',
          attachmentUrl: 'https://example.com/files/chungchi-cntt.pdf',
        },
      ],
    };
  }
}
