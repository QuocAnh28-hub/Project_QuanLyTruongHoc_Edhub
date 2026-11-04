import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { AppValidationException } from '@gedu/shared/errors';
import { SearchDto } from '@gedu/shared';

export class CreateAccountContactDto {
  @ApiProperty({
    example: 123,
    description: 'ID của người dùng để tạo tài khoản liên hệ',
  })
  @IsNumber({}, { message: AppValidationException.INVALID_USER_ID })
  userId: number;
}

export class GetStudentByClassIdDto extends SearchDto {}

export class FileDto {
  @ApiPropertyOptional({
    description: 'File id (if provided = update, else = create)',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'File name' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'File link (URL or storage path)' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(2000)
  link: string;

  @ApiPropertyOptional({ description: 'File type', example: 1 })
  @IsOptional()
  @IsInt()
  type?: number;
  @ApiPropertyOptional({
    description: 'Mark file as deleted (true = delete this file on update)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class SyncStudentFoldersRequestDto {
  @ApiPropertyOptional({
    description: 'Folder id (if provided = update, else = create)',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'Folder name' })
  @IsString()
  folderName: string;

  @ApiProperty({ description: 'Issuing authority' })
  @IsString()
  issuingAuthority: string;

  @ApiPropertyOptional({ description: 'Date of issue (ISO string)' })
  @IsOptional()
  @IsDateString()
  dateOfIssue?: string;

  @ApiPropertyOptional({ description: 'Record number' })
  @IsOptional()
  @IsString()
  recordNumber?: string;

  @ApiPropertyOptional({ description: 'Folder type', example: 1 })
  @IsOptional()
  @IsInt()
  type?: number;

  @ApiPropertyOptional({
    description: 'Mark folder as deleted',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    type: [FileDto],
    description: 'List of files to create/update',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}
