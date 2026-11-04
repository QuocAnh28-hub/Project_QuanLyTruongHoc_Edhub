import { DefaultPagination } from '@gedu/http/decorators/pagination.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { GetStudentsDto } from './dto/get-students.dto';
import {
  ArrangeBatchStudentClassDto,
  ArrangeStudentClassDto,
  CreateContactDto,
  CreateStudentRequestDto,
  TransferStudentClassDto,
  UpdateContactDto,
  UpdateGrantContactAccessDto,
  UpdateMedicalInfoRequestDto,
  UpdatePriorityPoliciesDto,
  UpdateStudentContactsDto,
  UpdateStudentRequestDto,
} from './dto/students.request.dto';
import { StudentsService } from './students.service';
import { GetStudentByIdResponse } from './dto/students.response.dto';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
@Authorization([ScRoles.STUDENT_ALL])
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('')
  @Authorization([ScRoles.STUDENT_READ])
  @ApiOperation({ summary: 'Get all students for the current organization' })
  getStudents(
    @DefaultPagination() _unused: void,
    @User('orgId') orgId: number,
    @Query() query: GetStudentsDto,
  ) {
    return this.studentsService.getAllStudents(orgId, query);
  }

  @Get(':studentId')
  @Authorization([ScRoles.STUDENT_READ])
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiOkResponse({
    description: 'Student details by ID',
    type: GetStudentByIdResponse,
  })
  getStudentById(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.studentsService.getStudentById(orgId, studentId);
  }

  @Post('')
  @ApiOperation({ summary: 'STEP 1: Create a new student' })
  createStudent(
    @User('orgId') orgId: number,
    @Body() body: CreateStudentRequestDto,
  ) {
    return this.studentsService.createStudent(orgId, body);
  }

  @Put('/:studentId')
  @ApiOperation({
    summary: 'Update student personal information',
  })
  updateStudentInfo(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() body: UpdateStudentRequestDto,
  ) {
    return this.studentsService.updateStudentInfo(orgId, studentId, body);
  }

  @Get(':studentId/student-contacts')
  @Authorization([ScRoles.STUDENT_READ])
  @ApiOperation({ summary: 'Get student contacts' })
  getStudentContacts(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.studentsService.findContactByIdStudent(orgId, studentId);
  }

  @Put(':studentId/contacts/:contactId')
  @ApiOperation({ summary: 'Update student contacts' })
  updateStudentContacts(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() body: UpdateContactDto,
  ) {
    return this.studentsService.updateContact(
      orgId,
      studentId,
      contactId,
      body,
    );
  }

  @Patch(':studentId/arrange-class')
  @ApiOperation({ summary: 'Arrange class for student' })
  @ApiOkResponse({
    schema: {
      example: { response: true },
    },
  })
  arrangeClass(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() body: ArrangeStudentClassDto,
  ) {
    return this.studentsService.arrangeClass(orgId, studentId, body);
  }

  @Patch('arrange-class/batch')
  @ApiOperation({ summary: 'Arrange class for multiple students' })
  @ApiOkResponse({
    schema: {
      example: {
        success: 2,
        failed: [
          { id: 3, message: 'Student not found' },
          { id: 4, message: 'Student already in class' },
        ],
      },
    },
  })
  arrangeClassBatch(
    @User('orgId') orgId: number,
    @Body() body: ArrangeBatchStudentClassDto,
  ) {
    return this.studentsService.arrangeClassBatch(orgId, body);
  }

  @Patch('/:studentId/transfer-class')
  @ApiOperation({ summary: 'Transfer class for student' })
  @ApiOkResponse({
    schema: {
      example: { response: true },
    },
  })
  transferClass(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() body: TransferStudentClassDto,
  ) {
    return this.studentsService.transferClass(orgId, studentId, body);
  }

  @Post(':studentId/student-contacts/batch')
  @ApiOperation({
    summary: 'STEP 2: Update student contacts for a specific student',
  })
  updateStudentContact(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() request: UpdateStudentContactsDto,
  ) {
    return this.studentsService.updateStudentContact(orgId, studentId, request);
  }

  @Post(':studentId/student-contacts/')
  @ApiOperation({
    summary: 'create student contacts for a specific student',
  })
  createStudentContact(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() request: CreateContactDto,
  ) {
    return this.studentsService.createStudentContact(orgId, studentId, request);
  }

  @Patch(':studentId/academic-info-and-policies')
  @ApiOperation({
    summary: 'STEP 3: Set academic and policy info for a student',
  })
  setPriorityPolicy(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() request: UpdatePriorityPoliciesDto,
  ) {
    return this.studentsService.updateAcademicAndPolicyInfo(
      orgId,
      studentId,
      request,
    );
  }

  @Patch(':studentId/medical-info')
  @ApiOperation({ summary: 'STEP 4: Update student medical information' })
  updateMedicalInfo(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() request: UpdateMedicalInfoRequestDto,
  ) {
    return this.studentsService.updateMedicalInfo(orgId, studentId, request);
  }

  @Post(':studentId/student-contacts/grant-access')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'STEP 5: Grant access to student contact',
  })
  async grantAccessStudentContact(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() request: UpdateGrantContactAccessDto,
  ) {
    return this.studentsService.grantAccessStudentContact(
      orgId,
      studentId,
      request,
    );
  }

  @Put(':studentId/contacts/:contactId/activate')
  @ApiOperation({
    summary: 'Activate the G-Edu app account of a student’s contact',
  })
  async activateContactAccount(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    return this.studentsService.activateContactAccount(
      orgId,
      studentId,
      contactId,
    );
  }

  @Delete(':studentId/contacts/:contactId')
  @ApiOperation({ summary: 'Delete a contact from student' })
  deleteStudentContact(
    @User('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    return this.studentsService.deleteStudentContact(
      orgId,
      studentId,
      contactId,
    );
  }
}
