import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  async getHealth() {
    return {
      status: 'ok',
    };
  }
}