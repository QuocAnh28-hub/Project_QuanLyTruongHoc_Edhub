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
import { AttendancesService } from './attendances.service';
import {
  AttendanceHistoryQueryDto,
  GetSessionQueryDto,
  SubmitAttendanceDto,
} from './dto/attendance.dto';

@ApiTags('attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly service: AttendancesService) {}

  @Get('classes/:classId/session')
  @ApiOperation({
    summary:
      'Lấy danh sách điểm danh của lớp theo ngày/ca/tiết (tự động trả về danh sách học sinh nếu chưa điểm danh)',
  })
  async getClassSession(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query() query: GetSessionQueryDto,
  ) {
    return this.service.getClassSession(orgId, classId, query);
  }

  @Post('classes/:classId/submit')
  @ApiOperation({ summary: 'Lưu hoặc cập nhật kết quả điểm danh của lớp' })
  async submitAttendance(
    @User('orgId') orgId: number,
    @User('id') userId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Body() dto: SubmitAttendanceDto,
  ) {
    return this.service.submitAttendance(orgId, classId, userId, dto);
  }

  @Get('classes/:classId/history')
  @ApiOperation({ summary: 'Lịch sử điểm danh của lớp theo khoảng thời gian' })
  async getClassHistory(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query() query: AttendanceHistoryQueryDto,
  ) {
    return this.service.getClassHistory(orgId, classId, query);
  }

  @Get('classes/:classId/statistics')
  @ApiOperation({ summary: 'Thống kê tỷ lệ chuyên cần của toàn lớp' })
  async getClassStatistics(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query() query: AttendanceHistoryQueryDto,
  ) {
    return this.service.getClassStatistics(orgId, classId, query);
  }

  @Get('students/:studentId/summary')
  @ApiOperation({ summary: 'Thống kê chuyên cần của 1 học sinh (cho Mobile Phụ huynh)' })
  async getStudentSummary(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.service.getStudentSummary(studentId, fromDate, toDate);
  }
}

