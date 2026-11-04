import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma, PrismaErrorCode } from '@gedu/prisma';

import { FastifyReply } from 'fastify';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    let statusCode = 409;

    const target = exception.meta?.['target'];
    const fields = Array.isArray(target) ? target : target ? [target] : [];

    let errors: { message: string; code: string }[] = [];

    switch (exception.code) {
      case PrismaErrorCode.DUPLICATE:
        errors = fields.length
          ? fields.map((field) => ({
              message: `${field} đã tồn tại`,
              code: `${field}.exists`,
            }))
          : [
              {
                message: 'Bản ghi đã tồn tại',
                code: 'record.exists',
              },
            ];
        statusCode = 200;
        break;

      case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT:
        errors = fields.length
          ? fields.map((field) => ({
              message: `${field} không hợp lệ hoặc không tồn tại`,
              code: `${field}.foreign_key`,
            }))
          : [
              {
                message: 'Tham chiếu không hợp lệ hoặc không tồn tại',
                code: 'foreign_key.invalid',
              },
            ];
        statusCode = 200;
        break;

      case PrismaErrorCode.RECORD_NOT_FOUND:
        errors = fields.length
          ? fields.map((field) => ({
              message: `${field} không tồn tại hoặc đã bị xoá`,
              code: `${field}.not_found`,
            }))
          : [
              {
                message: 'Bản ghi không tồn tại hoặc đã bị xoá',
                code: 'record.not_found',
              },
            ];
        statusCode = 200;
        break;

      default:
        errors = [
          {
            message: exception.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
            code: 'unknown.error',
          },
        ];
        statusCode = 200;
        break;
    }

    response.status(200).send({
      errors,
    });
  }
}
