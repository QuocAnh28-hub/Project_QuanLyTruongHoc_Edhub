import * as Papa from "papaparse";

import { BatchItem, BatchResponse, ImportResult } from "../../types/import.types";
import { IMPORT_STATUS } from "@gedu/shared";
import { Logger } from "@nestjs/common";
import { EmailService } from "@gedu/email";
import { MinioService } from "@gedu/minio";
import * as Stream from "stream";
import { getExt, parseFilePathFromUrl } from "../../../../utils/common.utils";
import { ImportRepository } from "../../repositories/import.repository";
import { readXLSXAsStream } from "../../../../utils/excel.utils";
import {Row as ExcelJSRow, stream as ExcelJSStream} from "exceljs";
import { ValidationError } from "class-validator";
import path from "path";

export interface ImportProcess<T> {
  processRow(row: any[]): Promise<T>;
  processBatch(
    jobId: string,
    orgId: number,
    batch: BatchItem<T>[],
    userId: number,
    userEmail: string,
    fileName: string
  ): Promise<BatchResponse>;
}

const BATCH_SIZE = 500;

export abstract class BaseImportService<T> implements ImportProcess<T> {
  protected readonly logger: Logger;

  constructor(
    protected readonly minioService: MinioService,
    protected readonly emailService: EmailService,
    protected readonly importRepository: ImportRepository
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  protected async parseFile(filePath: string): Promise<Stream.Duplex | ExcelJSStream.xlsx.WorksheetReader> {
    const { bucketName, objectName } = parseFilePathFromUrl(filePath);
    const fileStream = await this.minioService.getObject(
      bucketName,
      objectName
    );
    const ext = getExt(filePath);
    if (ext === 'csv') {
      const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
        header: false,
        skipEmptyLines: true,
      });

      fileStream.pipe(parseStream);
      return parseStream;
    } else if (ext === 'xlsx' || ext === 'xls') {
      return readXLSXAsStream(fileStream);
    } else {
      throw new Error(`Invalid file format: "${ext}". Supported: csv, xlsx, xls`);
    }
  }



  async process(
    orgId: number,
    jobId: string,
    filePath: string,
    userId: number,
    userEmail: string
  ): Promise<void> {
    this.logger.log(`Processing import job ${jobId} with file ${filePath}`);
    let jobExists = false;
    const progress: ImportResult = {
      processedLines: 0,
      successCount: 0,
      errorDetails: [],
    };
    let elapsedTime = Date.now();
    let currentBatch: BatchItem<T>[] = [];
    const fileName = path.basename(filePath);

    try {
      // This is to prevent duplicate jobs from being processed
      jobExists = await this.importRepository.isPendingJobExists(jobId);
      if (!jobExists) {
        this.logger.error(`Import job ${jobId} does not exist`);
        return;
      }
      await this.importRepository.updateJobStatus(jobId, {
        status: IMPORT_STATUS.PROCESSING,
      });
      jobExists = true;

      const parsedStream = await this.parseFile(filePath);

      for await (const row of parsedStream) {
        if (progress.processedLines === 0) {
          progress.processedLines++;
          continue;
        }
        
        const lineNumber = progress.processedLines;
        progress.processedLines++;

        try {
          // Normalize row to a plain array of values
          const rowValues = Array.isArray(row)
            ? row
            : (row && (row as ExcelJSRow).values) || [];
          const normalizedRow =
            Array.isArray(rowValues) && rowValues[0] === undefined
              ? rowValues.slice(1) // ExcelJS rows are 1-based; create a new array without mutating
              : rowValues;
          const data = await this.processRow(normalizedRow as any[], orgId);
          currentBatch.push({
            line: lineNumber,
            data,
          });
          if (currentBatch.length >= BATCH_SIZE) {
            const batchResponse = await this.processBatch(
              jobId,
              orgId,
              currentBatch,
              userId,
              userEmail,
              fileName
            );
            progress.successCount += batchResponse.successCount;
            progress.errorDetails.push(...batchResponse.errorDetails);
            currentBatch = [];
          }
        } catch (error) {
          this.logger.error(`Error processing row ${lineNumber}`, error);
          progress.errorDetails.push({
            line: lineNumber,
            error: error.message,
          });
        } finally {
          // Update progress every BATCH_SIZE lines
          if (progress.processedLines % BATCH_SIZE === 0) {
            await this.importRepository.updateJobStatus(jobId, {
              processedLines: progress.processedLines,
              failedLines: progress.errorDetails.length,
              errorDetails: progress.errorDetails,
            });
          }
        }
      }

      // Process remaining schools in the last batch
      if (currentBatch.length > 0) {
        const batchResponse = await this.processBatch(
          jobId,
          orgId,
          currentBatch,
          userId,
          userEmail,
          fileName
        );
        progress.successCount += batchResponse.successCount;
        progress.errorDetails.push(...batchResponse.errorDetails);
      }

      // Update job status COMPLETED and update total lines
      await this.importRepository.updateJobStatus(jobId, {
        status: IMPORT_STATUS.COMPLETED,
        totalLines: progress.processedLines - 1,
        processedLines: progress.processedLines - 1,
        failedLines: progress.errorDetails.length,
        errorDetails: progress.errorDetails
      });

      elapsedTime = Date.now() - elapsedTime;

      this.logger.log(
        `Elapsed time processing import job ${jobId} in ${elapsedTime}ms, success: ${progress.successCount}, failure: ${progress.errorDetails.length}`
      );
    } catch (error) {
      elapsedTime = Date.now() - elapsedTime;

      this.logger.error(
        `Error processing import job ${jobId} in ${elapsedTime}ms, ${error.message}`,
        error.stack
      );

      if (jobExists) {
        await this.importRepository.updateJobStatus(jobId, {
          status: IMPORT_STATUS.FAILED,
          errorDetails: [error.message],
        });
      }
    } finally {
      this.sendNotificationAsync(userEmail, {
        fileName,
        totalCount: progress.successCount + progress.errorDetails.length,
        successCount: progress.successCount,
        failureCount: progress.errorDetails.length,
      });
    }
  }

  protected sendNotificationAsync(
    email: string,
    result: {
      fileName: string;
      totalCount: number;
      successCount: number;
      failureCount: number;
    }
  ): void {
    (async () => {
      const res = await this.emailService.sendImportFileStatusEmail(
        email!,
        result
      );
      if (res) {
        this.logger.log(`Import result email sent to ${email} for file "${result.fileName}"`);
      } else {
        this.logger.error(`Failed to send import result email to ${email}"`);
      }
    })();
  }

  protected parseValidationErrors(errors: ValidationError[]): { key: string, values: string[] }[] {
    // console.error(errors);
    return errors.flatMap((error: ValidationError) => {
      if (error.children && error.children.length > 0) {
        return this.parseValidationErrors(error.children);
      }
      return { key: error.property, values: Object.values(error.constraints || {}) };
    });
  }

  /**
   * Processes a single row of import data (to be implemented by subclasses)
   * @param row - Array of values from the import file
   * @param orgId - Optional organization ID
   * @returns Processed data of type T
   */
  abstract processRow(row: any[], orgId?: number): Promise<T>;
  /**
   * Processes a batch of import items (to be implemented by subclasses)
   * @param jobId - Import job identifier
   * @param orgId - Organization ID
   * @param batch - Array of batch items to process
   * @param userId - User ID performing the import
   * @param userEmail - User email for notifications
   * @param fileName - Name of the import file
   * @returns Batch processing response with success/error counts
   */
  abstract processBatch(
    jobId: string,
    orgId: number,
    batch: BatchItem<T>[],
    userId: number,
    userEmail: string,
    fileName: string
  ): Promise<BatchResponse>;
}
