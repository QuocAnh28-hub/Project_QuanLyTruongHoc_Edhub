import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FastifyReply } from 'fastify';
import { StaticService } from "./static.service";

@ApiTags('static')
@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('/:bucketName/:filename')
  async getStaticFile(
    @Param('bucketName') bucketName: string, 
    @Param('filename') filename: string, 
    @Res() res: FastifyReply
  ) {
    return false;
  }
}