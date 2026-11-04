import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisModule } from '../redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { EMAIL_CONFIG_KEY, EMAIL_MAILERSEND_API_KEY, EMAIL_MS_GRAPH_CONFIG_KEY, EMAIL_SMTP_CONFIG_KEY } from './email.constants';
import { MailerSendRepository } from './repositories/mailersend.repository';
import { MsGraphRepository } from './repositories/ms-graph.repository';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: EMAIL_MAILERSEND_API_KEY,
      useFactory(configService: ConfigService) {
        return {
          apiKey: configService.get('MAILERSEND_API'),
        }
      },
      inject: [ConfigService],
    },
    {
      provide: EMAIL_SMTP_CONFIG_KEY,
      useFactory(configService: ConfigService) {
        return {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: configService.get('SMTP_SECURE'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        }
      },
      inject: [ConfigService],
    },
    {
      provide: EMAIL_MS_GRAPH_CONFIG_KEY,
      useFactory(configService: ConfigService) {
        return {
          tenantId: configService.get('MS_GRAPH_TENANT_ID'),
          clientId: configService.get('MS_GRAPH_CLIENT_ID'),
          clientSecret: configService.get('MS_GRAPH_CLIENT_SECRET'),
        }
      },
      inject: [ConfigService],
    },
    {
      provide: EMAIL_CONFIG_KEY,
      useFactory(configService: ConfigService) {
        return {
          mailFrom: configService.get('MAIL_FROM', 'no-reply@gedu.vn'),
          accessLink: configService.get('WEB_ACCESS_LINK', 'https://gedu.vn'),
          supportEmail: configService.get('WEB_SUPPORT_EMAIL', 'hotro@gedu.vn'),
          supportPhone: configService.get('WEB_SUPPORT_PHONE', '0931 441 213')
        };
      },
      inject: [ConfigService],
    },
    EmailService,
    MsGraphRepository,
    MailerSendRepository,
  ],
  exports: [EmailService],
})
export class EmailModule { } 