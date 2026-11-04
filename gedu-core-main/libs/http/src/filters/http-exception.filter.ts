import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

import { FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<FastifyReply>();
    let status = exception.getStatus();

    let errorResponse: any = {
      errors: [
        {
          code: exception.getStatus(),
          message: exception.message,
        },
      ],
    };

    if (request.method === "POST" && request.url === "/auth/login") {
      errorResponse = {
        response: null,
        errors: [
          {
            code: "unauthorized",
            message: "Email hoặc mật khẩu không đúng",
          },
        ],
      };
      status = 200;
    }
    response.status(status).send(errorResponse);
  }
}
