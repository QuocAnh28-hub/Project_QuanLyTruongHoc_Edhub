import {
  Body,
  Controller,
  Delete,
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
import { TeachingAssignmentsService } from './teaching-assignments.service';
import {
  BatchTeachingAssignmentDto,
  QueryTeachingAssignmentDto,
} from './dto/teaching-assignment.dto';

@ApiTags('teaching-assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teaching-assignments')
export class TeachingAssignmentsController {
  constructor(
    private readonly service: TeachingAssignmentsService,
  ) {}

  @Post('batch')
  @ApiOperation({ summary: 'Phân công giảng dạy theo lô cho các lớp học' })
  async assignBatch(
    @User('orgId') orgId: number,
    @Body() dto: BatchTeachingAssignmentDto,
  ) {
    return this.service.assignBatch(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Truy vấn danh sách phân công giảng dạy' })
  async getAssignments(
    @User('orgId') orgId: number,
    @Query() query: QueryTeachingAssignmentDto,
  ) {
    return this.service.getAssignments(orgId, query);
  }

  @Get('my-assignments')
  @ApiOperation({ summary: 'Giáo viên xem danh sách các lớp được phân công giảng dạy' })
  async getMyAssignments(
    @User('id') userId: number,
    @User('orgId') orgId: number,
  ) {
    return this.service.getMyAssignments(userId, orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phân công giảng dạy theo ID' })
  async getAssignmentById(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getAssignmentById(orgId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy phân công giảng dạy' })
  async deleteAssignment(
    @User('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.deleteAssignment(orgId, id);
  }
}

