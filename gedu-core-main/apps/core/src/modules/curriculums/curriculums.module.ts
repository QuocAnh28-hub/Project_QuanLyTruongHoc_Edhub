import { PrismaModule } from '@gedu/prisma';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CurriculumsController } from './curriculums.controller';
import { CurriculumsService } from './curriculums.service';
import { CurriculumRepository } from './repository/curriculums.repository';

@Module({
  imports: [PrismaModule, JwtModule ],
  controllers: [CurriculumsController],
  providers: [CurriculumsService , CurriculumRepository],
})
export class CurriculumsModule {}
