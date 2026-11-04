import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GradesService } from './grades.service';
import {
  BulkRecordScoreDto,
  CalculateSummaryDto,
  QueryScoreDto,
} from './dto/grade.dto';

@ApiTags('grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Post('classes/:classId/bulk')
  @ApiOperation({ summary: 'Nhập điểm theo lô cho danh sách học sinh theo môn học và đầu điểm' })
  async bulkRecordScores(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Body() dto: BulkRecordScoreDto,
  ) {
    return this.service.bulkRecordScores(orgId, classId, dto);
  }

  @Get('classes/:classId/subjects/:subjectId')
  @ApiOperation({ summary: 'Lấy sổ điểm chi tiết môn học của lớp theo học kỳ' })
  async getClassSubjectScoreboard(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('subjectId', ParseIntPipe) subjectId: number,
    @Query() query: QueryScoreDto,
  ) {
    return this.service.getClassSubjectScoreboard(
      orgId,
      classId,
      subjectId,
      query.schoolYearId,
      query.semesterId,
    );
  }

  @Post('classes/:classId/calculate-summary')
  @ApiOperation({ summary: 'Tính tự động điểm trung bình học kỳ theo quy chế Bộ GD&ĐT' })
  async calculateSummary(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Body() dto: CalculateSummaryDto,
  ) {
    return this.service.calculateSummary(orgId, classId, dto);
  }

  @Get('students/:studentId/transcript')
  @ApiOperation({ summary: 'Bảng điểm tổng hợp các môn của học sinh (Học bạ điện tử)' })
  async getStudentTranscript(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('schoolYearId', ParseIntPipe) schoolYearId: number,
    @Query('semesterId') semesterId?: number,
  ) {
    return this.service.getStudentTranscript(
      studentId,
      schoolYearId,
      semesterId ? Number(semesterId) : undefined,
    );
  }
}

