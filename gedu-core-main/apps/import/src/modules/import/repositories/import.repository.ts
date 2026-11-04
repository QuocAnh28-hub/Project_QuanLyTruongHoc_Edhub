import { Injectable } from "@nestjs/common";
import { IMPORT_STATUS } from "@gedu/shared";
import { CreateImportJobDto, ImportJobDto } from "../dto/import-job.dto";
import { PrismaService } from "@gedu/prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ImportRepository {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async updateJobStatus(
    jobId: string,
    data: {
      status?: IMPORT_STATUS;
      processedLines?: number;
      failedLines?: number;
      errorDetails?: object[];
      totalLines?: number;
    }
  ): Promise<void> {
    try {
      await this.prisma.importJob.update({
        where: { id: jobId },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update job status for ${jobId}: ${error.message}`, { cause: error });
    }
  }

  async updateJobFailedBeforeProcessing(jobId: string, message?: string) {
    try {
      await this.prisma.importJob.update({
        where: { id: jobId, status: { in: [IMPORT_STATUS.PENDING, IMPORT_STATUS.PROCESSING] } },
        data: { status: IMPORT_STATUS.FAILED, errorDetails: [{ message }] },
      });
    } catch (error) {
      throw new Error(
        `Failed to mark job as failed for ${jobId}: ${error.message}`,
        { cause: error }
      );
    }
  }

  async isPendingJobExists(jobId: string): Promise<boolean> {
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId, status: IMPORT_STATUS.PENDING },
    });
    return job !== null;
  }

  async createImportJob(createImportJobDto: CreateImportJobDto): Promise<ImportJobDto> {
    const { type, filePath, orgId, userId, email } = createImportJobDto;
    const job = await this.prisma.importJob.create({
      data: {
        type,
        payload: {
          filePath,
          orgId,
          userId,
          email,
        },
        orgId,
        createdBy: userId,
      },
    });
    return plainToInstance(ImportJobDto, job, { excludeExtraneousValues: true });
  }

  async getImportJob(id: string, orgId: number): Promise<ImportJobDto> {
    const job = await this.prisma.importJob.findFirst({
      where: { id, orgId },
    });
    return plainToInstance(ImportJobDto, job, { excludeExtraneousValues: true });
  }

  async getImportJobs(orgId: number, userId: number): Promise<ImportJobDto[]> {
    const jobs = await this.prisma.importJob.findMany({
      where: { orgId, createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map(job => plainToInstance(ImportJobDto, job, { excludeExtraneousValues: true }));
  }

  async getImportJobsByUserId(userId: number): Promise<ImportJobDto[]> {
    const jobs = await this.prisma.importJob.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map(job => plainToInstance(ImportJobDto, job, { excludeExtraneousValues: true }));
  }
} 