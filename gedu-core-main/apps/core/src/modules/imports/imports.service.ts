import { Injectable, Logger } from "@nestjs/common";
import { ImportJob } from "@gedu/prisma";
import { KafkaService } from "@gedu/transport";

import { CreateBaseImportDto, CreateSchoolImportDto, CreateStaffImportDto } from "./dto/create-school-import.dto";
import {CreateStudentImportDto} from "./dto/create-student-import.dto";
import { ImportRepository } from "./repositories/import.repository";
import { IMPORT_TOPIC, IMPORT_TYPE } from "./constants/import.constants";


@Injectable()
export class ImportsService {
  private readonly logger = new Logger(ImportsService.name);
  constructor(
    private readonly importRepository: ImportRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async createSchoolImportJob(
    userId: number,
    orgId: number,
    email: string,
    createSchoolImportDto: CreateSchoolImportDto
  ): Promise<ImportJob> {
    return this.createImportJob(
      IMPORT_TYPE.SCHOOL_IMPORT,
      userId,
      orgId, email, createSchoolImportDto);
  }

  async createStaffImportJob(
    userId: number,
    orgId: number,
    email: string,
    createStaffImportDto: CreateStaffImportDto
  ): Promise<ImportJob> {
    return this.createImportJob(
      IMPORT_TYPE.STAFF_IMPORT,
      userId,
      orgId, email, createStaffImportDto);
  }

  async createStudentImportJob(
      userId: number,
      orgId: number,
      email: string,
      createStudentImportDto: CreateStudentImportDto
  ): Promise<ImportJob> {
    return this.createImportJob(
      IMPORT_TYPE.STUDENT_IMPORT,
      userId,
      orgId, email, createStudentImportDto);
  }

  protected async createImportJob(
    type: string,
    userId: number,
    orgId: number,
    email: string,
    createImportDto: CreateBaseImportDto
  ): Promise<ImportJob> {
    const job = await this.importRepository.createImportJob(
      type,
      userId,
      orgId,
      email,
      createImportDto
    );
    await this.publishImportJobMessage(job);
    return job;
  }

  protected async publishImportJobMessage(job: ImportJob): Promise<void> {
    const message = {
      op: 'c',
      after: job,
    };
    await this.kafkaService.emit(IMPORT_TOPIC, message);
  }

  async getImportJobs(userId: number, orgId: number): Promise<ImportJob[]> {
    return this.importRepository.getImportJobs(userId, orgId);
  }

  async getImportJob(userId: number, id: string): Promise<ImportJob | null> {
    return this.importRepository.getImportJob(userId, id);
  }
}
