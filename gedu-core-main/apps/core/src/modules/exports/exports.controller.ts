import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { User } from '../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExportsService } from './exports.service';

@ApiTags('exports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exports')
export class ExportsController {
  constructor(private readonly service: ExportsService) {}

  @Get('classes/:classId/students')
  @ApiOperation({ summary: 'Xuất danh sách học sinh của lớp ra file CSV/Excel UTF-8' })
  async exportClassStudents(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Res() res: FastifyReply,
  ) {
    const { filename, content } = await this.service.exportClassStudents(
      orgId,
      classId,
    );
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );
    return res.send(content);
  }

  @Get('classes/:classId/scoreboard')
  @ApiOperation({ summary: 'Xuất sổ điểm lớp theo môn học ra file CSV/Excel UTF-8' })
  async exportScoreboard(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query('subjectId', ParseIntPipe) subjectId: number,
    @Query('schoolYearId', ParseIntPipe) schoolYearId: number,
    @Query('semesterId', ParseIntPipe) semesterId: number,
    @Res() res: FastifyReply,
  ) {
    const { filename, content } = await this.service.exportScoreboard(
      orgId,
      classId,
      subjectId,
      schoolYearId,
      semesterId,
    );
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );
    return res.send(content);
  }

  @Get('classes/:classId/attendance')
  @ApiOperation({ summary: 'Xuất báo cáo tổng hợp chuyên cần của lớp ra file CSV/Excel UTF-8' })
  async exportAttendance(
    @User('orgId') orgId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Res() res: FastifyReply,
  ) {
    const { filename, content } = await this.service.exportAttendance(
      orgId,
      classId,
      fromDate,
      toDate,
    );
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );
    return res.send(content);
  }
}

