import { EmailService } from '../email/email.service';
import { EmailTemplates } from '../email/email.constants';
import { Injectable } from '@nestjs/common';
import { SendAdminAccountEmailPayload, MailPayload, SendStaffAccountEmailPayload, SendResetPasswordEmailPayload, SendImportFileStatusEmailPayload } from '../types/email.type';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export interface NotificationPayload {
  type: NotificationType;
  to: string | string[];
  subject: string;
  message: string;
  template?: string;
  metadata?: MailPayload;
}

@Injectable()
export class NotificationService {
  constructor(private readonly emailService: EmailService) {}

  async sendNotification(payload: NotificationPayload): Promise<void> {
    switch (payload.type) {
      case NotificationType.EMAIL:
        await this.sendEmailNotification(payload);
        break;
      case NotificationType.SMS:
        await this.sendSMSNotification(payload);
        break;
      case NotificationType.PUSH:
        await this.sendPushNotification(payload);
        break;
      case NotificationType.IN_APP:
        await this.sendInAppNotification(payload);
        break;
      default:
        throw new Error(`Unsupported notification type: ${payload.type}`);
    }
  }

  private async sendEmailNotification(payload: NotificationPayload): Promise<void> {
    switch (payload.template) { 
      case EmailTemplates.ACTIVATE_SCHOOL_ADMIN:
        await this.emailService.sendAdminAccountEmail(payload.to as string, payload.metadata as SendAdminAccountEmailPayload);
        break;
      case EmailTemplates.ACTIVATE_STAFF:
        await this.emailService.sendStaffAccountEmail(payload.to as string, payload.metadata as SendStaffAccountEmailPayload);
        break;
      case EmailTemplates.RESET_PASSWORD:
        await this.emailService.sendResetPasswordEmail(payload.to as string, payload.metadata as SendResetPasswordEmailPayload);
        break;
      case EmailTemplates.IMPORT_FILE_STATUS:
        await this.emailService.sendImportFileStatusEmail(payload.to as string, payload.metadata as SendImportFileStatusEmailPayload);
        break;
      case EmailTemplates.CHANGE_PASSWORD:
        await this.emailService.sendChangePasswordEmail(payload.to as string, payload.metadata as any);
        break;
      default:
        throw new Error(`Unsupported email template: ${payload.template}`);
    }
  }

  private async sendSMSNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Implement SMS notification
    console.log('SMS notification not implemented yet', payload);
  }

  private async sendPushNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Implement push notification
    console.log('Push notification not implemented yet', payload);
  }

  private async sendInAppNotification(payload: NotificationPayload): Promise<void> {
    // TODO: Implement in-app notification
    console.log('In-app notification not implemented yet', payload);
  }
} 