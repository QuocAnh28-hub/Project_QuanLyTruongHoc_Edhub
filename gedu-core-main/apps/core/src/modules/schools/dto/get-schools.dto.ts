import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  EDUCATION_LEVEL,
  SCHOOL_EXTEND_STATUS,
  SCHOOL_TYPE,
} from '@gedu/shared/enums';

import { SearchDto } from '@gedu/shared/dtos';
import { Transform } from 'class-transformer';

export class GetSchoolsDto extends SearchDto {
  @ApiPropertyOptional({
    description: 'Loại trường. Example: 1,2',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return String(value)
      .split(',')
      .map(Number)
      .filter(Boolean);
  })
  @IsEnum(SCHOOL_TYPE, { each: true })
  type?: number[];

  @ApiPropertyOptional({
    description: 'Cấp học. Example: 1,2',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return String(value)
      .split(',')
      .map(Number)
      .filter(Boolean);
  })
  @IsEnum(EDUCATION_LEVEL, { each: true })
  level?: number[];

  @ApiPropertyOptional({
    description: 'Trạng thái. Example: 1,2',
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => {
    const values = String(value ?? '')
      .split(',')
      .map(Number)
      .filter(Boolean);
    return values;
  })
  @IsEnum(SCHOOL_EXTEND_STATUS, { each: true })
  status?: number[];

  @ApiPropertyOptional({ description: 'Trường quốc tế: 1 = có, 0 = không' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  intl?: number;

  @ApiPropertyOptional({
    description: 'Trường có admin hay không: 1 = có, 0 = không',
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  hasAdmin?: number;
}
