import { PRISMA_ERROR_MESSAGE, PrismaErrorCode } from './constants/errors.constant';
import { Prisma } from '../generated/client/client';

export interface PrismaErrorResult {
  field: string;
  reason: string;
  code?: string;
}

export const prismaErrorTransform = (error: unknown): PrismaErrorResult => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case PrismaErrorCode.DUPLICATE:
        // Unique constraint failed
        const target = Array.isArray(error.meta?.['target'])
          ? error.meta['target'][0]
          : error.meta?.['target'];
        return {
          field: (target as string) || 'unknown',
          reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.DUPLICATE],
          code: error.code,
        };

      case PrismaErrorCode.FOREIGN_KEY_CONSTRAINT:
        // Foreign key constraint failed
        return {
          field: (error.meta?.['field_name'] as string) || 'unknown',
          reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.FOREIGN_KEY_CONSTRAINT],
          code: error.code,
        };

      case PrismaErrorCode.VALUE_TOO_LONG:
        // Value too long for column
        return {
          field: (error.meta?.['column_name'] as string) || 'unknown',
          reason: `${PRISMA_ERROR_MESSAGE[PrismaErrorCode.VALUE_TOO_LONG]} là [${error.meta?.['column_length'] || 'unknown'}] ký tự`,
          code: error.code,
        };

      case PrismaErrorCode.RECORD_NOT_FOUND:
        // Record not found
        return {
          field: 'unknown',
          reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.RECORD_NOT_FOUND],
          code: error.code,
        };

      case PrismaErrorCode.RELATION_VIOLATION:
        // Invalid ID
        return {
          field: (error.meta?.['field_name'] as string) || 'unknown',
          reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.RELATION_VIOLATION],
          code: error.code,
        };

      case PrismaErrorCode.NULL_CONSTRAINT:
        // Null constraint violation
        return {
          field: (error.meta?.['field_name'] as string) || 'unknown',
          reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.NULL_CONSTRAINT],
          code: error.code,
        };

      case PrismaErrorCode.MISSING_REQUIRED_VALUE:
        // Missing required field
        return {
          field: (error.meta?.['field_name'] as string) || 'unknown',
          reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.MISSING_REQUIRED_VALUE],
          code: error.code,
        };

      default:
        return {
          field: 'unknown',
          reason: error.message,
          code: error.code,
        };
    } 
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      field: 'unknown',
      reason: error.message,
      code: PrismaErrorCode.VALIDATION_ERROR,
    };
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return {
      field: 'unknown',
      reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.RUST_PANIC],
      code: PrismaErrorCode.RUST_PANIC,
    };
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      field: 'unknown',
      reason: PRISMA_ERROR_MESSAGE[PrismaErrorCode.INITIALIZATION_ERROR],
      code: PrismaErrorCode.INITIALIZATION_ERROR,
    };
  } else {
    return {
      field: 'unknown',
      reason:
        error instanceof Error ? error.message : PRISMA_ERROR_MESSAGE[PrismaErrorCode.UNKNOWN_ERROR],
      code: PrismaErrorCode.UNKNOWN_ERROR,
    };
  }
};