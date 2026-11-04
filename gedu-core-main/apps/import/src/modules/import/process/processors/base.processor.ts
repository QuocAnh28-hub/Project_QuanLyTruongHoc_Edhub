import { Logger } from '@nestjs/common';
import { ImportType, ImportPayload, ImportProcessor } from '../../types/import.types';
import { getExt } from '../../../../utils/common.utils';

export abstract class BaseImportProcessor implements ImportProcessor {
  protected readonly logger: Logger;
  
  constructor(
    public readonly type: ImportType,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  abstract process(jobId: string, payload: ImportPayload): Promise<void>;

  protected async validateFile(filePath: string): Promise<boolean> {
    // Accept .csv, .xlsx, .xls (case-insensitive), even when filePath is a URL with query params
    const ext = getExt(filePath);
    return new Set(['csv', 'xlsx', 'xls']).has(ext);
  }

  protected parseFilePathFromUrl(filePath: string): { bucketName: string; objectName: string } {
    const urlObj = new URL(filePath);
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    return { bucketName: pathParts[0], objectName: pathParts.slice(1).join('/') };
  }

  protected logStart(jobId: string): void {
    this.logger.log(`Starting import job ${jobId} of type ${this.type}`);
  }

  protected logEnd(jobId: string): void {
    this.logger.log(`Completed import job ${jobId} of type ${this.type}`);
  }

  protected logError(jobId: string, error: Error): void {
    this.logger.error(`Error processing import job ${jobId}: ${error.message}`, error.stack);
  }
} 