import { PrismaModule } from "@gedu/prisma";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SeedService } from "./seeds.service";
import { SeedRepository } from "./repository/seed.repository";
import { SeedController } from "./seeds.controller";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [SeedController],
  providers: [SeedService, SeedRepository],
})
export class SeedModule {}
