import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { AppValidationException } from '@gedu/shared/errors';

export class CreateFacilityDto {
  @ApiPropertyOptional({
    description: 'Total area in square meters',
    example: 5000.5,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : value))
  totalArea?: number;

  @ApiPropertyOptional({
    description: 'Has minimum teaching equipment',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasMinimumTeachingEquipment?: boolean;

  @ApiPropertyOptional({
    description: 'Has computers',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasComputers?: boolean;

  @ApiPropertyOptional({
    description: 'Has internet access',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasInternetAccess?: boolean;

  @ApiPropertyOptional({
    description: 'Has power grid connection',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasPowerGrid?: boolean;

  @ApiPropertyOptional({
    description: 'Has clean water source',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasCleanWaterSource?: boolean;

  @ApiPropertyOptional({
    description: 'Has restrooms',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasRestrooms?: boolean;

  @ApiPropertyOptional({
    description: 'Has clean hygiene education program',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasCleanHygieneEducationProgram?: boolean;

  @ApiPropertyOptional({
    description: 'Has student service unit',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_BOOLEAN_VALUE })
  @Type(() => Boolean)
  hasStudentServiceUnit?: boolean;
}

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {}

export class FacilityResponseDto {
  @ApiProperty({ description: 'Facility ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'School ID', example: 1 })
  schoolId: number;

  @ApiPropertyOptional({
    description: 'Total area in square meters',
    example: 5000.5,
  })
  totalArea?: number;

  @ApiProperty({
    description: 'Has minimum teaching equipment',
    example: true,
  })
  hasMinimumTeachingEquipment: boolean;

  @ApiProperty({
    description: 'Has computers',
    example: true,
  })
  hasComputers: boolean;

  @ApiProperty({
    description: 'Has internet access',
    example: true,
  })
  hasInternetAccess: boolean;

  @ApiProperty({
    description: 'Has power grid connection',
    example: true,
  })
  hasPowerGrid: boolean;

  @ApiProperty({
    description: 'Has clean water source',
    example: true,
  })
  hasCleanWaterSource: boolean;

  @ApiProperty({
    description: 'Has restrooms',
    example: true,
  })
  hasRestrooms: boolean;

  @ApiProperty({
    description: 'Has clean hygiene education program',
    example: true,
  })
  hasCleanHygieneEducationProgram: boolean;

  @ApiProperty({
    description: 'Has student service unit',
    example: false,
  })
  hasStudentServiceUnit: boolean;

  @ApiProperty({ description: 'Created at', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Created by user ID', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ description: 'Updated by user ID', example: 1 })
  updatedBy?: number;
}
