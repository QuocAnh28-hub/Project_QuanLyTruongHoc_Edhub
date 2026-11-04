import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gedu/prisma';
import { CreateNotificationDto } from '../dto/notification.dto';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        content: dto.content,
        type: dto.type ?? 'general',
        metadata: dto.metadata ?? undefined,
      },
    });
  }

  async createMany(items: { userId: number; title: string; content: string; type?: string }[]) {
    return this.prisma.notification.createMany({
      data: items.map((item) => ({
        userId: item.userId,
        title: item.title,
        content: item.content,
        type: item.type ?? 'general',
      })),
    });
  }

  async findByUserId(userId: number, limit = 20, offset = 0, isRead?: boolean) {
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { items, total };
  }

  async countUnread(userId: number) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markRead(userId: number, id: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

