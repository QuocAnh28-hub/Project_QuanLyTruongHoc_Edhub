import { BadRequestException, Injectable } from '@nestjs/common';
import { StudentImportService } from '../services/student-import.service';
import { ImportPayload } from '../../types/import.types';
import { BaseImportProcessor } from './base.processor';

@Injectable()
export class StudentProcessor extends BaseImportProcessor {
  constructor(
    private readonly studentImportService: StudentImportService,
  ) {
    super('STUDENT_IMPORT');
  }

  async process(jobId: string, payload: ImportPayload): Promise<void> {
    try {
      this.logStart(jobId);
      
      // Validate file exists and is accessible
      const isValid = await this.validateFile(payload.filePath);
      if (!isValid) {
        throw new BadRequestException(`Invalid file: ${payload.filePath}`);
      }

      // Process the student import
      await this.studentImportService.process(
        payload.orgId,
        jobId,
        payload.filePath,
        payload.userId,
        payload.email,
      );
    } catch (error) {
      this.logError(`Failed at processor from job: ${jobId}`, error);
      throw error;
    }
  }
} 