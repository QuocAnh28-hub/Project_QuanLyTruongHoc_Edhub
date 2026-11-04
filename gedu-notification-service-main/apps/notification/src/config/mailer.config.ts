import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  defaults: {
    from: `Hệ thống Gedu <${process.env.MAIL_FROM || "no-reply@gedu.vn"}>`,
  },
  template: {
    dir: join(__dirname, 'templates'),
    adapter: new HandlebarsAdapter(
      {}, // helpers
      {
        inlineCssEnabled: false, // Disable CSS inlining to avoid css-inline dependency
      }
    ),
    options: {
      strict: true,
    },
  },
};