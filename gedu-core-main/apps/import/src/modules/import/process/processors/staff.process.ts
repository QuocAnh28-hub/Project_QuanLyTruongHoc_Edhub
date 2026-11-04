import { Injectable } from '@nestjs/common';
import { StaffImportService } from '../services/staff-import.service';
import { ImportPayload } from '../../types/import.types';
import { BaseImportProcessor } from './base.processor';

@Injectable()
export class StaffProcessor extends BaseImportProcessor {
  constructor(
    private readonly staffImportService: StaffImportService,
  ) {
    super('STAFF_IMPORT');
  }

  async process(jobId: string, payload: ImportPayload): Promise<void> {
    try {
      this.logStart(jobId);
      
      // Validate file exists and is accessible
      const isValid = await this.validateFile(payload.filePath);
      if (!isValid) {
        throw new Error(`Invalid file: ${payload.filePath}`);
      }

      // Process the school import
      await this.staffImportService.process(
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