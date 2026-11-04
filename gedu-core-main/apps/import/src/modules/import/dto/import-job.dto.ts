import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
import { IMPORT_TYPE } from "../../../constants/common.constants";
import { Expose } from "class-transformer";
import { IMPORT_STATUS } from "@gedu/shared";

export class CreateImportJobDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(IMPORT_TYPE)
  type: IMPORT_TYPE;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  filePath: string;

  @IsNumber()
  @IsNotEmpty()
  orgId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ImportJobPayloadDto {
  @Expose()
  filePath: string;

  @Expose()
  userId: number;

  @Expose()
  email: string;
  
}

export class ImportJobDto {
  @Expose()
  id: string;

  @Expose()
  orgId: number;

  @Expose()
  status: number;

  @Expose()
  type: string;

  @Expose()
  payload: ImportJobPayloadDto;

  @Expose()
  totalLines: number;

  @Expose()
  processedLines: number;

  @Expose()
  failedLines: number;

  @Expose()
  errorDetails: object[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;
}