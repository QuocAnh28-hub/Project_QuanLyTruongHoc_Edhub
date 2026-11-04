import { IsEnum, IsNumber, IsNumberString, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { AppException, GRADE_LEVEL } from '@gedu/shared';

export class GetSchoolPositionsDto {
  @ApiPropertyOptional({
    description: 'Department ID to filter by',
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  dept?: string;

  @ApiPropertyOptional({ description: 'Template ID to filter by', example: 1 })
  @IsOptional()
  @IsNumberString()
  tmpl?: string;
}

export class GetCurriculumDto {
  @ApiPropertyOptional({
    description: 'Grade level to filter by',
    example: 1,
  })
  @Transform(({ value }) => {
    return Number.isNaN(Number(value)) ? value : Number(value);
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(GRADE_LEVEL, { message: AppException.GRADE_LEVEL_INVALID })
  grd?: number;
}


