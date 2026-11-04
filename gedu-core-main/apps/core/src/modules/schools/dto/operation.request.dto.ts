import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { AppValidationException } from '@gedu/shared/errors';

export class CreateOperationDto {
  @ApiPropertyOptional({
    description: 'National standard status',
    example: 1,
  })
  @IsOptional()
  @IsInt({
    message: AppValidationException.INVALID_OPERATION_NATIONAL_STANDARD_STATUS,
  })
  @Type(() => Number)
  nationalStandardStatus?: number;

  @ApiPropertyOptional({
    description: 'Region',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: AppValidationException.INVALID_OPERATION_REGION })
  @Type(() => Number)
  region?: number;

  @ApiPropertyOptional({
    description: 'Zone',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: AppValidationException.INVALID_OPERATION_ZONE })
  @Type(() => Number)
  zone?: number;

  @ApiPropertyOptional({
    description: 'Has students with disabilities',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasStudentsWithDisabilities?: boolean;

  @ApiPropertyOptional({
    description: 'Has life skills education',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasLifeSkillsEducation?: boolean;

  @ApiPropertyOptional({
    description: 'Has basic education program',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasBasicEducationProgram?: boolean;
}

export class UpdateOperationDto extends PartialType(CreateOperationDto) {}

export class OperationResponseDto {
  @ApiProperty({ description: 'Operation ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'School ID', example: 1 })
  schoolId: number;

  @ApiProperty({
    description: 'National standard status',
    example: 1,
  })
  nationalStandardStatus: number;

  @ApiPropertyOptional({
    description: 'Region',
    example: 'North',
  })
  region?: number;

  @ApiPropertyOptional({
    description: 'Zone',
    example: 'Zone 1',
  })
  zone?: number;

  @ApiProperty({
    description: 'Has students with disabilities',
    example: true,
  })
  hasStudentsWithDisabilities: boolean;

  @ApiProperty({
    description: 'Has life skills education',
    example: true,
  })
  hasLifeSkillsEducation: boolean;

  @ApiProperty({
    description: 'Has basic education program',
    example: false,
  })
  hasBasicEducationProgram: boolean;

  @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Created by user ID', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ description: 'Updated by user ID', example: 1 })
  updatedBy?: number;
}
