import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { EducationLevelService } from "./education-level.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller("education-levels")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EducationLevelController {
  constructor(private readonly educationLevelService: EducationLevelService) {}

  @Get("")
  async getEducationLevels() {
    return this.educationLevelService.getEducationLevels();
  }

}
