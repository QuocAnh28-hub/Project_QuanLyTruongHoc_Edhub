import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonSeedDataDto, SeedDataDto } from './dtos/seed.dto';
import { SeedService } from './seeds.service';

@ApiTags('seeds')
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedsService: SeedService) {}

  @Post('seed-data')
  @ApiOperation({ summary: 'Seed data, first initial data for application' })
  async seedData(@Body() seedDataDto: SeedDataDto) {
    const resp = await this.seedsService.seedData(seedDataDto);
    return {
      message: 'Seed data successfully',
      data: resp,
    };
  }

  @Post('seed-data/append-role-permissions')
  @ApiOperation({ summary: 'Seed role permissions' })
  async appendSeedData() {
    const resp = await this.seedsService.appendSeedData();
    return {
      message: 'Seed role permissions successfully',
      data: resp,
    };
  }
}
