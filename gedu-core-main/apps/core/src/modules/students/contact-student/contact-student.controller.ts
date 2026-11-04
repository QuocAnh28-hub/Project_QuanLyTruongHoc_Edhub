import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateMedicalInfoRequestDto } from '../dto/students.request.dto';
import { ContactStudentService } from './contact-student.service';
import { GetStudentByIdResponse } from '../dto/students.response.dto';
import { SyncStudentFoldersRequestDto } from './dto/contact-student.request.dto';
import { GetStudentFoldersResponseDto } from './dto/get-student-folders.response.dto';

@ApiTags('student-contacts')
@Controller('student-contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ContactStudentController {
  constructor(private readonly contactStudentService: ContactStudentService) {}

  @Get(':contactId/students')
  async findContactByIdStudent(
    @Param('contactId', ParseIntPipe) contactId: number,
  ) {
    return this.contactStudentService.findStudentsByContactId(contactId);
  }

  @Get(':contactId/students/:studentId')
  @ApiOperation({ summary: 'Get student details by contact ID and student ID' })
  @ApiOkResponse({
    description: 'Student details by ID',
    type: GetStudentByIdResponse,
  })
  async getStudentDetails(
    @User('id') userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.contactStudentService.getStudentDetails(
      userId,
      contactId,
      studentId,
    );
  }

  @Get(':contactId/students/:studentId/folders')
  @ApiOperation({
    summary: 'Get folders and files for a student (by contact link)',
  })
    @ApiOkResponse({
      description: 'Folders and files for a student',
      type: GetStudentFoldersResponseDto,
    })
  async getStudentFolders(
    @User('id') userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.contactStudentService.getStudentFolders(
      userId,
      contactId,
      studentId,
    );
  }

  @Put(':contactId/students/:studentId/folders')
  @ApiOperation({
    summary: 'Update folder and files for a student (by contact link)',
  })
  async updateStudentFolder(
    @User('id') userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() body: SyncStudentFoldersRequestDto,
  ) {
    return this.contactStudentService.syncFolderWithFiles(
      userId,
      contactId,
      studentId,
      body
    );
  }

  @Patch(':contactId/students/:studentId/medical-info')
  @ApiOperation({ summary: 'Parent update student medical information' })
  async updateMedicalInfo(
    @User('id') userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() request: UpdateMedicalInfoRequestDto,
  ) {
    return this.contactStudentService.updateMedicalInfo(
      userId,
      contactId,
      studentId,
      request,
    );
  }

  @Patch(':contactId/students/:studentId/confirm-info')
  async confirmStudentInformation(
    @User('id') userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.contactStudentService.confirmStudentInformation(
      userId,
      contactId,
      studentId,
    );
  }
}
