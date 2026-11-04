import { Module } from "@nestjs/common";
import { PrismaModule } from "@gedu/prisma";
import { EducationLevelService } from "./education-level.service";
import { EducationLevelController } from "./education-level.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule],
  controllers: [EducationLevelController],
  providers: [EducationLevelService, JwtService],
  exports: [],
})
export class EducationLevelModule {}
