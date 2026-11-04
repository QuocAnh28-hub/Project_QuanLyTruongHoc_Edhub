import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

import { SearchDto } from '@gedu/shared';

export class GetSchoolPositionsDto extends PartialType(SearchDto) {
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
