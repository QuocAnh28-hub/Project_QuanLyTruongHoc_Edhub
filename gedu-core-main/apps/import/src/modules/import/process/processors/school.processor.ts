import { BaseImportProcessor } from './base.processor';
import { ImportPayload } from '../../types/import.types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SchoolImportService } from '../services/school-import.service';
import { IMPORT_ERRORS } from '../../../../constants/errors.constant';

@Injectable()
/**
 * Processor for handling School import jobs. Validates input file and delegates
 * to SchoolImportService for actual processing.
 */
export class SchoolProcessor extends BaseImportProcessor {
  constructor(
    private readonly schoolImportService: SchoolImportService,
  ) {
    super('SCHOOL_IMPORT');
  }
  /**
   * Processes a school-import job.
   * @param jobId Unique job identifier
   * @param payload Import payload containing orgId, filePath, userId, and email
   */
  async process(jobId: string, payload: ImportPayload): Promise<void> {
    try {
      this.logStart(jobId);
      
      // Validate file exists and is accessible
      const isValid = await this.validateFile(payload.filePath);
      if (!isValid) {
        throw new BadRequestException(IMPORT_ERRORS.INVALID_FILE_FORMAT);
      }

      // Process the school import
      await this.schoolImportService.process(
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