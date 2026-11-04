import { DEFAULT_EMAIL_CONFIG, EmailTemplates } from './email.constants';
import { Injectable, Logger } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import {
  SendAdminAccountEmailPayload,
  SendChangePasswordEmailPayload,
  SendImportFileStatusEmailPayload,
  SendResetPasswordEmailPayload,
  SendStaffAccountEmailPayload
} from '../types/email.type';

import { MailerSendRepository } from './repositories/mailersend.repository';
import { MsGraphRepository } from './repositories/ms-graph.repository';


interface SendMailResult {
  success: boolean;
  attempts: number;
  error?: string;
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly msGraphRepository: MsGraphRepository,
    private readonly mailerSendRepository: MailerSendRepository
  ) { }

  async sendEmail(payload: EmailPayload): Promise<void> {
    const { to, subject, template = 'notification', context } = payload;

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context: {
        subject,
        ...context,
      },
    });
  }

  async sendWithRetry(
    payload: EmailPayload,
    maxAttempts = 3,
    delayMs = 10 * 1000,
    useMsGraph = false
  ): Promise<SendMailResult> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (useMsGraph) {
          await this.msGraphRepository.sendEmail(payload);
        } else {
          await this.mailerSendRepository.sendMailUsingAPI(payload);
        }
        this.logger.log(`Email sent to ${payload.to} on attempt ${attempt} by ${useMsGraph ? 'MsGraph' : 'MailerSend'}`);
        return { success: true, attempts: attempt };
      } catch (error: any) {
        this.logger.error(`Failed to send email to ${payload.to} by ${useMsGraph ? 'MsGraph' : 'MailerSend'} (attempt ${attempt}): ${error.message}`, error.stack);
        if (attempt < maxAttempts) {
          this.logger.log(`Retrying in ${delayMs / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          if (!useMsGraph) {
            await this.sendWithRetry(payload, maxAttempts, delayMs, true);
          } else {
            this.logger.error(
              `Giving up after ${maxAttempts} attempts to send email to ${payload.to}`
            );
            return {
              success: false,
              attempts: maxAttempts,
              error: error.message,
            };
          }
        }
      }
    }
    return { success: false, attempts: maxAttempts, error: 'Unknown error' };
  }

  public async sendAdminAccountEmail(
    to: string,
    context: SendAdminAccountEmailPayload
  ) {
    const payload = {
      to,
      subject: `Chào mừng đến với Gedu! Hãy cùng bắt đầu thiết lập cho Trường ${context.schoolName}`,
      template: EmailTemplates.ACTIVATE_SCHOOL_ADMIN,
      context: {
        schoolName: context.schoolName,
        adminName: context.adminName,
        email: context.email,
        password: this.escapeHtml(context.password),
        accessLink: DEFAULT_EMAIL_CONFIG.urls.accessLink,
      },
    };

    return this.sendWithRetry(payload);
  }

  public async sendStaffAccountEmail(
    to: string,
    context: SendStaffAccountEmailPayload
  ) {
    const payload = {
      to,
      subject:
        `Chào mừng Thầy/Cô ${context.staffName} đến với Gedu!`,
      template: EmailTemplates.ACTIVATE_STAFF,
      context: {
        schoolName: context.schoolName,
        staffName: context.staffName,
        email: context.email,
        password: this.escapeHtml(context.password),
        accessLink: DEFAULT_EMAIL_CONFIG.urls.accessLink
      },
    };
    return this.sendWithRetry(payload);
  }

  public async sendChangePasswordEmail(
    to: string,
    context: SendChangePasswordEmailPayload
  ) {
    const payload = {
      to,
      subject: 'Mật khẩu Gedu của bạn đã được cập nhật!',
      template: EmailTemplates.CHANGE_PASSWORD,
      context: {
        staffName: context.staffName,
      },
    };

    return this.sendWithRetry(payload);
  }

  public async sendResetPasswordEmail(
    to: string,
    context: SendResetPasswordEmailPayload
  ) {
    const payload = {
      to,
      subject: 'Mật khẩu Gedu của bạn đã được khôi phục!',
      template: EmailTemplates.RESET_PASSWORD,
      context: {
        staffName: context.staffName,
        username: context.username,
        password: this.escapeHtml(context.password),
        accessLink: DEFAULT_EMAIL_CONFIG.urls.accessLink,
        supportEmail:
          DEFAULT_EMAIL_CONFIG.support.email,
        supportPhone:
          DEFAULT_EMAIL_CONFIG.support.phone,
      },
    };

    return this.sendWithRetry(payload);
  }

  public async sendImportFileStatusEmail(
    to: string,
    context: SendImportFileStatusEmailPayload
  ) {
    const payload = {
      to,
      subject: 'Kết quả tải lên danh sách',
      template: EmailTemplates.IMPORT_FILE_STATUS,
      context: {
        fileName: context.fileName,
        totalCount: context.totalCount,
        successCount: context.successCount,
        failureCount: context.failureCount,
      },
    };

    return this.sendWithRetry(payload);
  }

  private escapeHtml(text: string): string {
    const htmlEscapeMap: Record<'&' | '<' | '>' | '"' | "'", string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(
      /[&<>"']/g,
      (char) => htmlEscapeMap[char as keyof typeof htmlEscapeMap]
    );
  }
}
