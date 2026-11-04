import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateImportJobDto } from "../dto/import-job.dto";
import { ImportHttpService } from "./import-http.service";

@Controller('import')
export class ImportHttpController {
  constructor(private readonly importService: ImportHttpService) {}

  @Post()
  async createImport(
    @Body() createImportDto: CreateImportJobDto) {
    return this.importService.create(createImportDto);
  }

  @Get(':id')
  async getImport(@Param('id') id: string, @Query('orgId') orgId: number) {
    return this.importService.getById(id, orgId);
  }

  @Get()
  async getImports(@Query('orgId') orgId: number, @Query('userId') userId: number) {
    return this.importService.getByOrgId(orgId, userId);
  }
}