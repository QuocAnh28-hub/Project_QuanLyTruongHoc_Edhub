import { IsEnum, IsOptional } from "class-validator";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { AppValidationException } from '@gedu/shared/errors';
import { GRADE_LEVEL } from "@gedu/shared/enums";
import { Type } from "class-transformer";

export class GetClassesQueryDto {
  @ApiPropertyOptional({
    description: "Khối lớp",
    example: 8,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(GRADE_LEVEL, { message: AppValidationException.INVALID_GRADE_LEVELS })
  grd?: number;
}
