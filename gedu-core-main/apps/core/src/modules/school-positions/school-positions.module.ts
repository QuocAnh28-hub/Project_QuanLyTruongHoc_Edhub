import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@gedu/prisma';
import { SchoolPositionsController } from './school-positions.controller';
import { SchoolPositionsService } from './school-positions.service';
import { SharesModule } from '../shares/shares.module';

@Module({
  imports: [PrismaModule, JwtModule, SharesModule],
  controllers: [SchoolPositionsController],
  providers: [SchoolPositionsService],
})
export class SchoolPositionsModule {}
