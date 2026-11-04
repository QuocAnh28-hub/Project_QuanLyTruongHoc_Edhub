import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService, NotificationType } from './notification.service';
import type { NotificationPayload } from './notification.service';
import { EmailTemplates } from '../email/email.constants';

@Controller('notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);
  constructor(private readonly notificationService: NotificationService) {}

  // @MessagePattern('gedu.notification.send')
  // async handleSendNotification(@Payload() data: NotificationPayload) {
  //   try {
  //     await this.notificationService.sendNotification(data);
  //     return { success: true, message: 'Notification sent successfully' };
  //   } catch (error: unknown) {
  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  //     return { success: false, message: errorMessage };
  //   }
  // }

  @EventPattern('gedu.notification.send.email')
  async handleSendEmailNotification(@Payload() data: NotificationPayload) {
    try {
      this.logger.log(`Sending email to ${data.to}`);
      data.type = NotificationType.EMAIL;
      await this.notificationService.sendNotification(data);
      return { success: true, message: 'Email notification sent successfully' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }
  
  // @Get('test')
  // async testSendEmail() {
  //   await this.notificationService.sendNotification({
  //     type: NotificationType.EMAIL,
  //     to: 'sunnv.1510@gmail.com',
  //     subject: 'Test Email',
  //     message: 'This is a test email',
  //     template: EmailTemplates.ACTIVATE_SCHOOL_ADMIN,
  //     metadata: {
  //       schoolName: 'GEdu',
  //       adminName: 'Nguyễn Văn A',
  //       email: 'sunnv.1510@gmail.com',
  //       password: '123456',
  //       accessLink: 'https://gedu.vn',
  //     },
  //   });
  //   return { success: true, message: 'Email sent successfully' };
  // }

} 