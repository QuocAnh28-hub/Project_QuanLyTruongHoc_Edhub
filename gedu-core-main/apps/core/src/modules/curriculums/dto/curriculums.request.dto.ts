import { AppError, AppValidationException, SearchBaseDto } from '@gedu/shared';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GRADE_LEVEL } from '@gedu/shared/enums';
import { ParseIntPipe } from '@nestjs/common';

export function GradeLevelParseIntPipe(): ParseIntPipe {
  return new ParseIntPipe({
    exceptionFactory: () => {
      return new AppError(AppValidationException.INVALID_GRADE_LEVELS);
    },
  });
}

export class CreateCurriculumDto {
  @ApiProperty({
    description: 'Name of the curriculum',
    example: 'Mathematics Curriculum',
  })
  @IsString({ message: AppValidationException.INVALID_CURRICULUM_NAME })
  name: string;

  @ApiProperty({
    description: 'Description of the curriculum',
    example: 'This curriculum covers basic to advanced mathematics topics.',
  })
  @IsString({ message: AppValidationException.INVALID_CURRICULUM_CODE })
  code: string;

  @ApiProperty({
    description: 'Optional description of the curriculum',
  })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_INSTRUCTION_LANGUAGE_ID },
  )
  @Type(() => Number)
  instructionLanguageId: number;

  @ApiPropertyOptional({
    description: 'Optional code for the curriculum',
  })
  @IsString({ message: AppValidationException.INVALID_GRADUATION_DEGREE })
  @IsOptional()
  graduationDegree?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the curriculum is received',
    default: false,
    example: true,
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_RECEIVED })
  @IsOptional()
  isReceived?: boolean;

  @ApiPropertyOptional({
    description: 'Indicates if the curriculum can be applied for',
    default: false,
    example: true,
  })
  @IsBoolean({ message: AppValidationException.INVALID_CAN_APPLY })
  @IsOptional()
  canApply?: boolean;

  @ApiProperty({
    description: 'List of grade levels',
    isArray: true,
    enum: GRADE_LEVEL,
    example: [GRADE_LEVEL.GRADE_1, GRADE_LEVEL.GRADE_2],
  })
  @IsArray({ message: AppValidationException.INVALID_GRADE_LEVELS })
  @IsEnum(GRADE_LEVEL, {
    each: true,
    message: AppValidationException.INVALID_GRADE_LEVELS,
  })
  gradeLevels: number[];
}

export class GetCurriculumsDto extends PartialType(SearchBaseDto) {}

export class UpdateSubjectQuickDto {
  @ApiPropertyOptional({
    description: 'Loại môn học',
    example: 1,
  })
  @IsNumber({}, { message: AppValidationException.INVALID_TYPE_SUBJECT })
  @IsOptional()
  @Type(() => Number)
  type?: number;

  @ApiPropertyOptional({
    description: 'Số tiết trong tuần',
    example: 5,
  })
  @IsNumber({}, { message: AppValidationException.INVALID_LESSONS_PER_WEEK })
  @IsOptional()
  @Type(() => Number)
  lessonsPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Quyết định dựa trên điểm số',
    example: true,
  })
  @IsBoolean({ message: AppValidationException.INVALID_SCORING_BASED })
  @IsOptional()
  @Type(() => Boolean)
  scoringBased?: boolean;

  @ApiPropertyOptional({
    description: 'Quyết định dựa trên nhận xét',
    example: true,
  })
  @IsBoolean({ message: AppValidationException.INVALID_COMMENTS_BASED })
  @IsOptional()
  @Type(() => Boolean)
  commentsBased?: boolean;
}
