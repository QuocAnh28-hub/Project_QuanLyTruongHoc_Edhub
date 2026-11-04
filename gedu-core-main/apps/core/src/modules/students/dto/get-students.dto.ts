import { GRADE_LEVEL, STUDENT_STATUS } from '@gedu/shared';
import { IsEnum, IsInt, IsOptional, IsString, } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppValidationException } from '@gedu/shared/errors';
import { SearchDto } from '@gedu/shared';
import { Transform } from 'class-transformer';

export class GetStudentsDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Search keyword',
    example: '',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Danh sách khối/lớp (grade levels). VD: 1,2,3',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsOptional()
  @Transform(({ value }) =>
    String(value ?? '')
      .split(',')
      .map((v) => Number(v.trim()))
      .filter(Boolean),
  )
  @IsEnum(GRADE_LEVEL, {
    each: true,
    message: AppValidationException.INVALID_STUDENT_GRADE_LEVEL,
  })
  grd?: number[];

  @ApiPropertyOptional({
    description: 'Danh sách lớp học (class IDs). VD: 5,6,7',
    type: [Number],
    example: [5, 6],
  })
  @Transform(({ value }) =>
    String(value ?? '')
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v)),
  )
  @IsOptional()
  @IsInt({ each: true })
  clss?: number[];

  @ApiPropertyOptional({
    description: 'Trạng thái học sinh. Example: 1,2',
    type: [Number],
  })
  @Transform(({ value }) =>
    String(value ?? '')
      .split(',')
      .map((v) => Number(v))
      .filter(Boolean),
  )
  @IsOptional()
  @IsEnum(STUDENT_STATUS, {
    each: true,
    message: AppValidationException.INVALID_STUDENT_STATUS,
  })
  status?: number[];
}
