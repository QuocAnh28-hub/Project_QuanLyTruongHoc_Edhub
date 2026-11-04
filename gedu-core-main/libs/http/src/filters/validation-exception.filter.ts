import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

import { AppExceptionDetail } from '@gedu/shared/errors';
import { ClassValidationException } from '../exceptions';
import { FastifyReply } from 'fastify';

@Catch(ClassValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = 200;

    const rawMessages = exception?.response?.message;
    const messages: string[] = Array.isArray(rawMessages)
      ? rawMessages
      : typeof rawMessages === 'string'
        ? [rawMessages]
        : [];

    const errors = messages.map((msg) => {
      const [fieldName, rawKey] = msg.split(':').map((s) => s.trim());

      const key = rawKey || fieldName;

      const detail = AppExceptionDetail[key as keyof typeof AppExceptionDetail];

      if (!detail) {
        return {
          code: `${key}.invalid_format`,
          message: `${fieldName || key} không hợp lệ`,
          fieldName,
        };
      }

      return {
        ...detail,
        fieldName,
      };
    });

    response.status(status).send({ errors });
  }
}
