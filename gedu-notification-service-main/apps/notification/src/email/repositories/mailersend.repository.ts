import { Inject, Injectable } from "@nestjs/common";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { EMAIL_CONFIG_KEY, EMAIL_MAILERSEND_API_KEY } from "../email.constants";
import type {
  SendEmailConfig,
 MailerSendAPIConfig
} from "../../types/email.type";

import type { EmailPayload } from "../email.service";


@Injectable()
export class MailerSendRepository {

  private readonly mailerSend: MailerSend;


  constructor(
    @Inject(EMAIL_MAILERSEND_API_KEY) private readonly mailerSendApiConfig: MailerSendAPIConfig,
    @Inject(EMAIL_CONFIG_KEY) private readonly emailConfig: SendEmailConfig,
  ) {
    this.mailerSend = new MailerSend({
      apiKey: this.mailerSendApiConfig.apiKey,
    });
  }

  async sendMailUsingAPI(payload: EmailPayload) {
    const { to, subject, template, context } = payload;
    const sendFrom = new Sender(this.emailConfig.mailFrom, "Hệ Thống Gedu");
    const recipients = Array.isArray(to) ? to.map((email) => new Recipient(email)) : [new Recipient(to)];
    const emailParams = new EmailParams()
      .setFrom(sendFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(await this.renderEmailTemplate(template!, context || {}));

    await this.mailerSend.email.send(emailParams);
  }

  private async renderEmailTemplate(template: string, context: Record<string, any>): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', `${template}.hbs`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const content = Handlebars.compile(templateContent);
    return content(context);
  }
}   