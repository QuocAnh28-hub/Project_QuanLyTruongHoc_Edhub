import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimetablesService } from './timetables.service';
import {
  CreatePeriodDto,
  QueryScheduleDto,
  SaveClassScheduleDto,
  UpdatePeriodDto,
} from './dto/timetable.dto';

@ApiTags('timetables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('timetables')
export class TimetablesController {
  constructor(private readonly service: TimetablesService) {}

  // --- PERIODS ---

  @Get('periods')
  @ApiOperation({ summary: 'Lấy cấu hình danh sách các tiết học' })
  async getPeriods(@User('orgId') orgId: number) {
    return this.service.getPeriods(orgId);
  }

  @Post('periods')
  @ApiOperation({ summary: 'Tạo mới một tiết học' })
  async createPeriod(
    @User('orgId') orgId: number,
    @Body() dto: CreatePeriodDto,
  ) {
    return this.service.createPeriod(orgId, dto);
  }

  @Put('periods/:id')
  @ApiOperation({ summary: 'Cập nhật giờ bắt đầu / kết thúc của tiết học' })
  async updatePeriod(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePeriodDto,
  ) {
    return this.service.updatePeriod(orgId, id, dto);
  }

  @Post('periods/init')
  @ApiOperation({ summary: 'Tự động khởi tạo 10 tiết chuẩn (Sáng 1-5, Chiều 6-10)' })
  async initDefaultPeriods(@User('orgId') orgId: number) {
    return this.service.initDefaultPeriods(orgId);
  }

  // --- SCHEDULES ---

  @Get('classes/:classId')
  @ApiOperation({ summary: 'Lấy ma trận thời khóa biểu tuần của lớp' })
  async getClassTimetable(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query() query: QueryScheduleDto,
  ) {
    return this.service.getClassTimetable(orgId, classId, query);
  }

  @Post('classes/:classId/schedules')
  @ApiOperation({ summary: 'Lưu hoặc cập nhật toàn bộ thời khóa biểu của lớp (có kiểm tra trùng lịch)' })
  async saveClassTimetable(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Body() dto: SaveClassScheduleDto,
  ) {
    return this.service.saveClassTimetable(orgId, classId, dto);
  }

  @Get('teachers/:teacherId')
  @ApiOperation({ summary: 'Lấy lịch dạy trong tuần của giáo viên' })
  async getTeacherTimetable(
    @User('orgId') orgId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @Query() query: QueryScheduleDto,
  ) {
    return this.service.getTeacherTimetable(orgId, teacherId, query);
  }

  @Get('my-schedule')
  @ApiOperation({ summary: 'Giáo viên xem lịch dạy tuần của chính mình' })
  async getMySchedule(
    @User('id') userId: number,
    @User('orgId') orgId: number,
    @Query() query: QueryScheduleDto,
  ) {
    return this.service.getMySchedule(userId, orgId, query);
  }

  @Delete('schedules/:id')
  @ApiOperation({ summary: 'Xóa một tiết khỏi thời khóa biểu' })
  async deleteScheduleItem(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.deleteScheduleItem(orgId, id);
  }
}

