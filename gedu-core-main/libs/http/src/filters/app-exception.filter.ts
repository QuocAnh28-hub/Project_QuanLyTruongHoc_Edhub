import {instanceToPlain} from "class-transformer";
import {FastifyReply} from "fastify";
import {ArgumentsHost, Catch, ExceptionFilter, Injectable,} from "@nestjs/common";
import {AppError} from "@gedu/shared/errors";

@Injectable()
@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {

  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    response.status(200).send(instanceToPlain(exception));
  }
}
