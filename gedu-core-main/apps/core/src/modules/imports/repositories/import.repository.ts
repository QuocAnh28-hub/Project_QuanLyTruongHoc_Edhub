import { Injectable } from "@nestjs/common";
import { ImportJob, PrismaService } from "@gedu/prisma";
import { CreateBaseImportDto } from "../dto/create-school-import.dto";
import { IMPORT_STATUS } from "@gedu/shared/enums";

@Injectable()
export class ImportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createImportJob(
    type: string,
    userId: number,
    orgId: number,
    email: string,
    dto: CreateBaseImportDto
  ): Promise<ImportJob> {
    return this.prisma.importJob.create({
      data: {
        type: type,
        payload: {
          filePath: dto.filePath,
          userId: userId,
          orgId: orgId,
          email: email,
        },
        createdBy: userId,
        orgId: orgId,
      },
    });
  }

  async getImportJobs(userId: number, orgId: number): Promise<ImportJob[]> {
    return this.prisma.importJob.findMany({
      where: {
        orgId: orgId,
        createdBy: userId,
      },
    });
  }

  async getImportJob(userId: number, id: string): Promise<ImportJob | null> {
    return this.prisma.importJob.findUnique({
      where: {
        id: id,
        createdBy: userId,
      },
    });
  }

  async updateImportJob(
    userId: number,
    id: string,
    data: Partial<{
      status: IMPORT_STATUS;
      processedLines: number;
      failedLines: number;
      errorDetails: object[];
      totalLines: number;
    }>
  ): Promise<ImportJob> {
    return this.prisma.importJob.update({
      where: {
        id: id,
        createdBy: userId,
      },
      data: data,
    });
  }
}