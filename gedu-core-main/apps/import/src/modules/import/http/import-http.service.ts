import { BadRequestException, Injectable } from "@nestjs/common";
import { ImportRepository } from "../repositories/import.repository";
import { CreateImportJobDto, ImportJobDto } from "../dto/import-job.dto";
import { IMPORT_TOPIC } from "@gedu/shared";

import { KafkaService } from "@gedu/transport";


@Injectable()
export class ImportHttpService {
  constructor(
    private readonly importRepository: ImportRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async create(createImportJobDto: CreateImportJobDto): Promise<ImportJobDto> {
    const job = await this.importRepository.createImportJob(createImportJobDto);
    await this.publishImportJob(job);
    return job;
  }

  async getById(id: string, orgId: number): Promise<ImportJobDto> {
    if (!id || !orgId) {
      throw new BadRequestException('id và orgId là bắt buộc');
    }
    return this.importRepository.getImportJob(id, orgId);
  }

  async getByOrgId(orgId: number, userId: number): Promise<ImportJobDto[]> {
    if (!orgId || !userId) {
      throw new BadRequestException('orgId và userId là bắt buộc');
    }
    return this.importRepository.getImportJobs(orgId, userId);
  }

  async getByUserId(userId: number): Promise<ImportJobDto[]> {
    if (!userId) {
      throw new BadRequestException('userId là bắt buộc');
    }
    return this.importRepository.getImportJobsByUserId(userId);
  }

  async publishImportJob(job: ImportJobDto) {
    const message = {
      op: 'c',
      after: job,
    };
    await this.kafkaService.emit(IMPORT_TOPIC, message);
  }
}