import { ClassesRepository } from '../schools/classes/repository/classes.repository';
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { PrismaModule } from "@gedu/prisma";
import { SchoolYearsController } from "./school-years.controller";
import { SchoolYearsRepository } from "./repository/school-years.repository";
import { SchoolYearsService } from "./school-years.service";

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [SchoolYearsController],
  providers: [SchoolYearsRepository, ClassesRepository, SchoolYearsService],
})
export class SchoolYearsModule {}
