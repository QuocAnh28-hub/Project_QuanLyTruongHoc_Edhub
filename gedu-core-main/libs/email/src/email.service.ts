import { Injectable, Logger, Inject, OnModuleDestroy } from '@nestjs/common';
import {
  EmailTemplates,
  KAFKA_EMAIL_TOPIC,
} from './email.constants';
import { v4 as uuidv4 } from 'uuid';
import {
  ActivateSchoolAdminMetadata,
  ActivateStaffMetadata,
  ChangePasswordMetadata,
  EmailPayload,
  ImportFileStatusMetadata,
  ResetPasswordMetadata,
} from './email.interface';
import { KafkaService } from '@gedu/transport';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  public async sendAdminAccountEmail(
    to: string,
    context: ActivateSchoolAdminMetadata,
  ) {
    const payload = {
      to,
      template: EmailTemplates.ACTIVATE_SCHOOL_ADMIN,
      metadata: {
        schoolName: context.schoolName,
        adminName: context.adminName,
        email: context.email,
        password: context.password,
        accessLink: context.accessLink || ''
      },
    };

    return this.publishEmailEvent(payload);
  }

  public async sendStaffAccountEmail(
    to: string,
    context: ActivateStaffMetadata,
  ) {
    const payload = {
      to,
      template: EmailTemplates.ACTIVATE_STAFF,
      metadata: {
        schoolName: context.schoolName,
        staffName: context.staffName,
        email: context.email,
        password: context.password
      },
    };

    return this.publishEmailEvent(payload);
  }

  public async sendResetPasswordEmail(
    to: string,
    context: ResetPasswordMetadata,
  ) {
    const payload = {
      to,
      template: EmailTemplates.RESET_PASSWORD,
      metadata: {
        staffName: context.staffName,
        username: context.username,
        password: context.password,
      },
    };
    return this.publishEmailEvent(payload);
  }

  public async sendImportFileStatusEmail(
    to: string,
    context: ImportFileStatusMetadata,
  ) {
    const payload = {
      to,
      template: EmailTemplates.IMPORT_FILE_STATUS,
      metadata: {
        fileName: context.fileName,
        totalCount: context.totalCount,
        successCount: context.successCount,
        failureCount: context.failureCount,
      },
    };

    return this.publishEmailEvent(payload);
  }

  public async sendChangePasswordResultEmail(
    to: string,
    context: ChangePasswordMetadata,
  ) {
    const payload = {
      to,
      template: EmailTemplates.CHANGE_PASSWORD,
      metadata: {
        staffName: context.staffName
      },
    };

    return this.publishEmailEvent(payload);
  }

  private async publishEmailEvent(payload: EmailPayload): Promise<boolean> {
    try {
      const emailEvent = {
        id: uuidv4(),
        ...payload,
      };

      await this.kafkaService.emit(KAFKA_EMAIL_TOPIC, emailEvent)
      this.logger.log(`Email event published successfully for topic: ${KAFKA_EMAIL_TOPIC}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error publishing email event: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
