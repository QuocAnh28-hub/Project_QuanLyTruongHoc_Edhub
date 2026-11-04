import { EmailService } from '@gedu/email';
import { GRPC_SERVICE } from '@gedu/transport';
import {
  ImportStaffRequest,
  StaffImportRequest,
  StaffImportService as StaffImportServiceGrpc,
} from '@gedu/transport';
import { MinioService } from '@gedu/minio';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { lastValueFrom } from 'rxjs';
import { arrayToObjectMapping } from '../../../../utils/common.utils';
import { CreateStaffRowDto } from '../../dto/staff-import-row.dto';
import { BatchItem, BatchResponse } from '../../types/import.types';
import { BaseImportService } from './base-import.service';
import { ImportRepository } from '../../repositories/import.repository';

const COLUMN_MAPPING = [
  'code',
  'lastName',
  'firstName',
  'citizenId',
  'dateOfIssue',
  'dateOfExpiry',
  'placeOfIssue',
  'dateOfBirth',
  'sex',
  'nationality',
  'religion',
  'permanentResidenceProvince',
  'permanentResidenceWard',
  'permanentAddress',
  'temporaryResidenceProvince',
  'temporaryResidenceWard',
  'temporaryResidenceAddress',
  'email',
  'phone',
  'contactPhone',
  'contactPhone2',
  'department',
  'position',
  'schoolPosition',
];

@Injectable()
export class StaffImportService extends BaseImportService<StaffImportRequest> {
  private staffService: StaffImportServiceGrpc;
  protected readonly logger = new Logger(StaffImportService.name);

  constructor(
    protected readonly minioService: MinioService,
    protected readonly emailService: EmailService,
    protected readonly importRepository: ImportRepository,
    @Inject(GRPC_SERVICE) private readonly client: ClientGrpc
  ) {
    super(minioService, emailService, importRepository);

    this.staffService =
      this.client.getService<StaffImportServiceGrpc>('StaffImportService');
  }

  async processRow(row: any[]): Promise<StaffImportRequest> {
    let typedRow = arrayToObjectMapping(row, COLUMN_MAPPING);
    const staffRow = plainToInstance(CreateStaffRowDto, typedRow);

    const validationErrors = await validate(staffRow);
    if (validationErrors.length > 0) {
      const messages = this.parseValidationErrors(validationErrors);
      throw new Error(`Validation Error: ${messages.map((m) => `${m.key}: ${m.values.join(', ')}`).join('; ')}`);
    }

    return {
      code: staffRow.code,
      firstName: staffRow.firstName,
      lastName: staffRow.lastName,
      citizenId: staffRow.citizenId,
      email: staffRow.email,
      dateOfBirth: staffRow.dateOfBirth,
      dateOfIssue: staffRow.dateOfIssue,
      dateOfExpiry: staffRow.dateOfExpiry,
      placeOfIssue: staffRow.placeOfIssue,
      permanentResidenceProvince: staffRow.permanentResidenceProvince,
      permanentResidenceWard: staffRow.permanentResidenceWard,
      permanentResidenceAddress: staffRow.permanentAddress,
      temporaryResidenceProvince: staffRow.temporaryResidenceProvince,
      temporaryResidenceWard: staffRow.temporaryResidenceWard,
      temporaryResidenceAddress: staffRow.temporaryResidenceAddress,
      sex: staffRow.sex,
      contactPhone: staffRow.contactPhone,
      contactPhone2: staffRow.contactPhone2,
      position: staffRow.position,
      department: staffRow.department,
      nationality: staffRow.nationality,
      religion: staffRow.religion,
      phone: staffRow.phone,
      schoolPosition: staffRow.schoolPosition,
    };
  }

  async processBatch(
    jobId: string,
    orgId: number,
    batch: BatchItem<StaffImportRequest>[],
    userId: number,
    userEmail: string,
    fileName: string,
  ): Promise<BatchResponse> {
    const batchResponse: BatchResponse = {
      successCount: 0,
      errorDetails: [],
    };
    try {
      const request: ImportStaffRequest = {
        orgId,
        staffs: batch.map((item) => item.data),
        createdBy: userId,
        email: userEmail,
        fileName,
      };

      const response = await lastValueFrom(
        this.staffService.importStaffs(request),
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
