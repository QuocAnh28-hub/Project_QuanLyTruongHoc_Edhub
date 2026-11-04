import { Inject, Injectable, Logger } from "@nestjs/common";
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import axios from 'axios';
import { EMAIL_CONFIG_KEY, EMAIL_MS_GRAPH_CONFIG_KEY } from "../email.constants";
import { RedisService } from "../../redis/redis.service";
import type {
  MsGraphConfig,
  SendEmailConfig,
} from "../../types/email.type";

import type {
  MsGraphAccessTokenResponse,
  MsGraphEmailMessagePayload,
} from '../../types/ms-graph.interface';  
import { MsGraphEmailSendError } from "../../types/ms-graph.interface";

import { EmailPayload } from "../email.service";

@Injectable()
export class MsGraphRepository {

  private readonly logger = new Logger(MsGraphRepository.name);

  constructor(
    @Inject(EMAIL_MS_GRAPH_CONFIG_KEY) private readonly msGraphConfig: MsGraphConfig,
    @Inject(EMAIL_CONFIG_KEY) private readonly emailConfig: SendEmailConfig,
    private readonly redisService: RedisService
  ) {}

  async getAccessToken(): Promise<MsGraphAccessTokenResponse> {
    const token = await this.redisService.getAccessToken();
    if (token) {
      return token;
    }
    const { tenantId, clientId, clientSecret } = this.msGraphConfig;
    if (!tenantId || !clientId || !clientSecret) {
      throw new MsGraphEmailSendError('Missing MS Graph app info', 500);
    }
    const response = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    this.logger.log(`Retrieved access token for clientId: ${clientId}`);
    await this.redisService.storeAccessToken(response.data);
    return response.data;
  }

  async sendEmail(
    payload: EmailPayload,
  ) {
    try { 
      // Get access token
      const token = (await this.getAccessToken()).access_token;
      const { to, subject, template = 'notification', context } = payload;
      // Render email template
      const html = await this.renderEmailTemplate(template, context || {});
      const emailMessage: MsGraphEmailMessagePayload = {
        message: {
          subject: subject || 'No subject',
          body: {
            contentType: 'html',
            content: html,
          },
          toRecipients: Array.isArray(to) ? to.map(email => ({ emailAddress: { address: email } })) : [{ emailAddress: { address: to as string } }],
        },
        saveToSentItems: true,
      }
      // Send email
      const response = await axios.post(`https://graph.microsoft.com/v1.0/users/${this.emailConfig.mailFrom}/sendMail`,
        emailMessage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      if (response.status !== 202) {
        this.logger.error(`Error sending email: ${response.statusText}`);
        throw new MsGraphEmailSendError(response.statusText, response.status);
      }
      return response.data;
    } catch (error: any) {
      console.error(error)
      this.logger.error(`Error sending email: ${error.message}`);
      if (error instanceof MsGraphEmailSendError) {
        throw error;
      }
      throw new MsGraphEmailSendError(error.message, error.status);
    }
  }

  private async renderEmailTemplate(template: string, context: Record<string, any>): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', template + '.hbs')
    if (fs.existsSync(templatePath)) {
      const templateContent = fs.readFileSync(path.join(__dirname, 'templates', template + '.hbs'), 'utf8');
      const tmpl = Handlebars.compile(templateContent);
      return tmpl(context)
    }
    throw new MsGraphEmailSendError(`Template ${template} not found`, 500);
  }  
}