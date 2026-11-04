import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MinioService } from '@gedu/minio';
import {
  SchoolImportService as SchoolImportServiceGrpc,
  SchoolImportRequest,
  ImportSchoolsRequest,
  GRPC_SERVICE,
} from '@gedu/transport';
import { EmailService } from '@gedu/email';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { arrayToObjectMapping } from '../../../../utils/common.utils';
import { SchoolImportRowDto } from '../../dto/school-import-row.dto';
import { BaseImportService } from './base-import.service';
import { BatchItem, BatchResponse } from '../../types/import.types';
import { COLUMN_MAPPING } from '../../../../constants/school.constants';
import { ImportRepository } from '../../repositories/import.repository';

@Injectable()
export class SchoolImportService extends BaseImportService<SchoolImportRequest> {
  private schoolService: SchoolImportServiceGrpc;

  constructor(
    protected readonly minioService: MinioService,
    protected readonly emailService: EmailService,
    protected readonly importRepository: ImportRepository,
    @Inject(GRPC_SERVICE) private readonly client: ClientGrpc
  ) {
    super(minioService, emailService, importRepository);
    this.schoolService = this.client.getService<SchoolImportServiceGrpc>(
      'SchoolImportService',
    );
  }

  async processRow(row: any[]): Promise<SchoolImportRequest> {
    let typedRow = arrayToObjectMapping(row, COLUMN_MAPPING);
    const schoolRow = plainToInstance(SchoolImportRowDto, typedRow);

    const validationErrors = await validate(schoolRow);
    if (validationErrors.length > 0) {
      const messages = this.parseValidationErrors(validationErrors);
      throw new Error(`Validation Error: ${messages.map((m) => `${m.key}: ${m.values.join(', ')}`).join('; ')}`);
    }

    return {
      code: schoolRow.code,
      name: schoolRow.name,
      type: schoolRow.type,
      address: schoolRow.address || "",
      dailyScheduleType: schoolRow.dailyScheduleType,
      email: schoolRow.email || "",
      website: schoolRow.website || "",
      hotline: schoolRow.hotline || "",
      principalFirstName: schoolRow.principalFirstName || "",
      principalLastName: schoolRow.principalLastName || "",
      principalPhone: schoolRow.principalPhone || "",
      ward: schoolRow.ward || "",
      isSchoolForGifted: schoolRow.isSchoolForGifted === 1,
      canPreschool: schoolRow.schoolLevel?.includes(1) ?? false,
      canPrimarySchool: schoolRow.schoolLevel?.includes(2) ?? false,
      canLowerSecondarySchool: schoolRow.schoolLevel?.includes(3) ?? false,
      canUpperSecondarySchool: schoolRow.schoolLevel?.includes(4) ?? false,
      isInternationalSchool: schoolRow.isInternational === 1,
      admin: schoolRow.adminEmail
        ? {
          firstName: schoolRow.adminFirstName || "",
          lastName: schoolRow.adminLastName || "",
          phone: schoolRow.adminPhone || "",
          email: schoolRow.adminEmail || "",
        }
        : null,
    };
  }

  async processBatch(
    jobId: string,
    orgId: number,
    batch: BatchItem<SchoolImportRequest>[],
    userId: number,
    userEmail: string,
    fileName: string,
  ): Promise<BatchResponse> {
    const batchResponse: BatchResponse = {
      successCount: 0,
      errorDetails: [],
    };
    try {
      const request: ImportSchoolsRequest = {
        jobId: jobId,
        orgId,
        schools: batch.map((item) => item.data),
        createdBy: userId,
        email: userEmail,
        fileName,
      };
      const response = await lastValueFrom(
        this.schoolService.importSchools(request),
      );

      // Handle any failures in the batch
      response.results.forEach((result, index) => {
        if (!result.success) {
          batchResponse.errorDetails.push({
            line: batch[index].line,
            error: result.message,
          });
        } else {
          batchResponse.successCount++;
        }
      });
    } catch (error) {
      this.logger.error('Entire Batch Failed', error);
      // If the entire batch fails, add all schools to error details
      batch.forEach((item) => {
        batchResponse.errorDetails.push({
          line: item.line,
          error: error.message,
        });
      });
    }
    return batchResponse;
  }
}
