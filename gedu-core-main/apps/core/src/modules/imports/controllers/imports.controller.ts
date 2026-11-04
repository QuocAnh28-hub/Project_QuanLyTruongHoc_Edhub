import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorators/user.decorators';
import { CreateSchoolImportDto, CreateStaffImportDto } from '../dto/create-school-import.dto';
import { ImportsService } from '../imports.service';
import { CreateStudentImportDto } from "../dto/create-student-import.dto";
import { ImportJob } from '@gedu/prisma';

@Controller('imports')
@ApiTags('imports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ImportsController {
  constructor(private readonly importsService: ImportsService) { }

  @Post('schools')
  async createSchoolImportJob(
    @User("id") userId: number,
    @User("orgId") orgId: number,
    @User("email") email: string,
    @Body() createSchoolImportDto: CreateSchoolImportDto
  ): Promise<ImportJob> {
    return this.importsService.createSchoolImportJob(userId, orgId, email, createSchoolImportDto);
  }

  @Get()
  async getImportJobs(@User("id") userId: number, @User("orgId") orgId: number): Promise<ImportJob[]> {
    return this.importsService.getImportJobs(userId, orgId);
  }

  @Get(':id')
  async getImportJob(@User("id") userId: number, @Param('id') id: string): Promise<ImportJob | null> {
    return this.importsService.getImportJob(userId, id);
  }


  @Post('staffs')
  async createStaffImportJob(
    @User("id") userId: number,
    @User("orgId") orgId: number,
    @User("email") email: string,
    @Body() createStaffImportDto: CreateStaffImportDto
  ): Promise<ImportJob> {
    return this.importsService.createStaffImportJob(userId, orgId, email, createStaffImportDto);
  }

  @Post('students')
  async createStudentImportJob(
    @User("id") userId: number,
    @User("orgId") orgId: number,
    @User("email") email: string,
    @Body() createStudentImportDto: CreateStudentImportDto
  ): Promise<ImportJob> {
    return this.importsService.createStudentImportJob(userId, orgId, email, createStudentImportDto);
  }
}
