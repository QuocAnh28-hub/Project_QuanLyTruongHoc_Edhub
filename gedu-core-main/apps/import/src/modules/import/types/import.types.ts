import * as Joi from 'joi';

export type ImportType = 'SCHOOL_IMPORT' | 'STUDENT_IMPORT' | 'TEACHER_IMPORT' | 'STAFF_IMPORT';

export enum ImportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ImportJob {
  id: string;
  type: ImportType;
  payload: string;
  status: ImportStatus;
}

export interface ImportPayload {
  orgId: number;
  filePath: string;
  userId: number;
  email: string;
}

// Joi schema for validation
export const importPayloadSchema = Joi.object({
  filePath: Joi.string().required(),
  userId: Joi.number().required(),
  email: Joi.string().required(),
  orgId: Joi.number().required(),
});

export interface ImportProcessor {
  type: ImportType;
  process(jobId: string, payload: ImportPayload): Promise<void>;
} 

export interface BatchItem<T> {
  line: number;
  data: T;
}

export interface BatchResponse {
  successCount: number;
  errorDetails: object[];
}

export interface ImportResult {
  processedLines: number;
  successCount: number;
  errorDetails: object[];
}