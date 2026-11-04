import { Global, Module } from '@nestjs/common';

import { ClassesRepository } from '../schools/classes/repository/classes.repository';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@gedu/prisma';
import { RedisModule } from '@gedu/redis';
import { SchoolRepository } from '../schools/repository/school.repository';
import { SchoolsModule } from '../schools/schools.module';
import { SharesController } from './shares.controller';
import { SharesRepository } from './repository/shares.repository';
import { SharesService } from './shares.service';

@Global()
@Module({
  imports: [
    PrismaModule, 
    JwtModule, 
    RedisModule, 
    SchoolsModule
  ],
  controllers: [SharesController],
  providers: [
    SharesService,
    SharesRepository,
    ClassesRepository,
    SchoolRepository,
  ],
  exports: [SharesService, SharesRepository, ClassesRepository],
})
export class SharesModule {}
