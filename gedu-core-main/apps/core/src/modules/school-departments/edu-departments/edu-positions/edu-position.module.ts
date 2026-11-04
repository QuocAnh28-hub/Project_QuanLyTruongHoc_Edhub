import { PrismaModule } from '@gedu/prisma';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EdPositionsController } from './edu-position.controller';
import { EdPositionsService } from './edu-position.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [EdPositionsController],
  providers: [EdPositionsService],
})
export class EdPositionsModule {}
