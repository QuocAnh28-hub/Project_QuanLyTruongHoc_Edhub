import { Injectable } from "@nestjs/common";
import { PrismaService } from "@gedu/prisma";

@Injectable()
export class EducationLevelService {
  constructor(private readonly prismaService: PrismaService) {}

  async getEducationLevels() {
    return this.prismaService.educationLevels.findMany();
  }
}
