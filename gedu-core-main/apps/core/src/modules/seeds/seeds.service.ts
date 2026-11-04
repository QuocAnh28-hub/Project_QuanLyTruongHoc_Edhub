import { AppError, AppException } from '@gedu/shared/errors';
import { CommonSeedDataDto, SeedDataDto } from './dtos/seed.dto';

import { Injectable } from '@nestjs/common';
import { SeedRepository } from './repository/seed.repository';
import { SharesService } from '../shares/shares.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly seedRepository: SeedRepository,
    private readonly sharesService: SharesService,
  ) {}

  async seedData(seedDataDto: SeedDataDto) {
    let doet = await this.seedRepository.getDOET();
    if (doet) {
      throw new AppError(AppException.ALREADY_SEED_DATA);
    }
    await this.seedRepository.seedData(seedDataDto);
    await this.sharesService.warmUpCache();
  }

  async appendSeedData() {
    await this.seedRepository.seedRoles(true);
    await this.seedRepository.seedPermissions(true);
    await this.seedRepository.seedRolePermissions();
    await this.seedRepository.seedPositionRoles();
    await this.sharesService.warmUpCache();
  }
}
