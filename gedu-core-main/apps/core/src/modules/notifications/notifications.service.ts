import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';
import {
  CreateNotificationDto,
  SendBulkNotificationDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly repository: NotificationRepository) {}

  async getUserNotifications(
    userId: number,
    limit = 20,
    offset = 0,
    isRead?: boolean,
  ) {
    return this.repository.findByUserId(userId, limit, offset, isRead);
  }

  async getUnreadCount(userId: number) {
    const count = await this.repository.countUnread(userId);
    return { unreadCount: count };
  }

  async markAsRead(userId: number, id: number) {
    await this.repository.markRead(userId, id);
    return { success: true, message: 'Đã đánh dấu thông báo là đã đọc' };
  }

  async markAllAsRead(userId: number) {
    await this.repository.markAllRead(userId);
    return { success: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc' };
  }

  async sendNotification(dto: CreateNotificationDto) {
    return this.repository.create(dto);
  }

  async sendBulkNotifications(dto: SendBulkNotificationDto) {
    const items = dto.userIds.map((uid) => ({
      userId: uid,
      title: dto.title,
      content: dto.content,
      type: dto.type,
    }));
    return this.repository.createMany(items);
  }
}

