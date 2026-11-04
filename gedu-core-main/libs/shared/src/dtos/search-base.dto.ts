import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { ORDER_ENUM } from '../enums';
import { Type } from 'class-transformer';

const DEFAULT_SEARCH_BASE = {
  PAGE: 1,
  PAGE_SIZE: 10,
  KEYWORD: undefined,
  TAKE: undefined,
  SKIP: undefined,
};

export class SearchBaseDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number (default: 1)' })
  @IsOptional()
  @Type(() => Number)
  page: number = DEFAULT_SEARCH_BASE.PAGE;

  @ApiPropertyOptional({ example: 10, description: 'Page size (default: 10)' })
  @IsOptional()
  @Type(() => Number)
  size: number = DEFAULT_SEARCH_BASE.PAGE_SIZE;

  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  q?: string;
}

export class SearchDto extends SearchBaseDto {
  @ApiPropertyOptional({
    enum: ORDER_ENUM,
    example: ORDER_ENUM.DESC,
    description: 'Sort order (ASC or DESC)',
  })
  @IsOptional()
  @IsEnum(ORDER_ENUM)
  order?: ORDER_ENUM = ORDER_ENUM.DESC;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;
}
