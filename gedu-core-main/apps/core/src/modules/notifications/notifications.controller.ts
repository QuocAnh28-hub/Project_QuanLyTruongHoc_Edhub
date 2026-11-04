import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  SendBulkNotificationDto,
} from './dto/notification.dto';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của tài khoản đang đăng nhập' })
  async getNotifications(
    @User('id') userId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('isRead') isRead?: boolean,
  ) {
    return this.service.getUserNotifications(
      userId,
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
      isRead !== undefined ? String(isRead) === 'true' : undefined,
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Đếm số lượng thông báo chưa đọc (để hiển thị badge)' })
  async getUnreadCount(@User('id') userId: number) {
    return this.service.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu 1 thông báo là đã đọc' })
  async markAsRead(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.markAsRead(userId, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Đánh dấu toàn bộ thông báo là đã đọc' })
  async markAllAsRead(@User('id') userId: number) {
    return this.service.markAllAsRead(userId);
  }

  @Post('send')
  @ApiOperation({ summary: 'Gửi thông báo đến 1 người dùng' })
  async sendNotification(@Body() dto: CreateNotificationDto) {
    return this.service.sendNotification(dto);
  }

  @Post('send-bulk')
  @ApiOperation({ summary: 'Gửi thông báo đồng loạt tới nhiều người dùng' })
  async sendBulkNotifications(@Body() dto: SendBulkNotificationDto) {
    return this.service.sendBulkNotifications(dto);
  }
}

