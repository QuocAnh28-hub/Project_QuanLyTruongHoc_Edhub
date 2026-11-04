import {
  Body,
  Controller,
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
import { StudentRequestsService } from './student-requests.service';
import {
  CreateStudentRequestDto,
  QueryStudentRequestDto,
  ReviewStudentRequestDto,
} from './dto/student-request.dto';

@ApiTags('student-requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-requests')
export class StudentRequestsController {
  constructor(private readonly service: StudentRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Phụ huynh gửi yêu cầu chỉnh sửa/cập nhật thông tin học sinh' })
  async createRequest(
    @User('orgId') orgId: number,
    @User('id') userId: number,
    @Body() dto: CreateStudentRequestDto,
  ) {
    return this.service.createRequest(orgId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Nhà trường tra cứu danh sách yêu cầu cần xử lý' })
  async getRequests(
    @User('orgId') orgId: number,
    @Query() query: QueryStudentRequestDto,
  ) {
    return this.service.getRequests(orgId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một yêu cầu chỉnh sửa thông tin' })
  async getRequestById(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getRequestById(orgId, id);
  }

  @Put(':id/review')
  @ApiOperation({ summary: 'Nhà trường duyệt (Approve) hoặc từ chối (Reject) yêu cầu' })
  async reviewRequest(
    @User('orgId') orgId: number,
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewStudentRequestDto,
  ) {
    return this.service.reviewRequest(orgId, id, userId, dto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Lịch sử các yêu cầu chỉnh sửa của một học sinh' })
  async getStudentRequests(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.service.getStudentRequests(studentId);
  }
}

