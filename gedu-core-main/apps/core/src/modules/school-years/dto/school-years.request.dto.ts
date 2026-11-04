import { AppValidationException } from '@gedu/shared';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BaseSchoolYearDto {
  @ApiProperty({ example: 'School Year 2024-2077' })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_YEAR_TITLE })
  title: string;

  @ApiProperty({ example: '2025-09-02' })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_SCHOOL_YEAR_FROM_DATE })
  fromDate: Date;

  @ApiProperty({ example: '2026-06-30' })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_SCHOOL_YEAR_TO_DATE })
  toDate: Date;
}

export class CreateExaminationsDto {
  @ApiProperty({ example: 'Final Exam 1' })
  @IsString({ message: AppValidationException.INVALID_EXAMINATION_TITLE })
  title: string;

  @ApiPropertyOptional({ example: '2026-06-09' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_EXAMINATION_FROM_DATE })
  fromDate?: Date;

  @ApiPropertyOptional({ example: '2026-06-15' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_EXAMINATION_TO_DATE })
  toDate?: Date;
}

export class UpdateExaminationsDto extends PartialType(CreateExaminationsDto) {
  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: AppValidationException.INVALID_EXAMINATION_ID })
  id: number;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: AppValidationException.INVALID_SEMESTER_ID })
  semesterId: number;

  @ApiPropertyOptional({
    description: 'Đánh dấu rằng kỳ thi đã bị xóa',
    example: false,
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_DELETE })
  @IsOptional()
  isDeleted?: boolean;
}

export class CreateSemestersDto {
  @ApiProperty({ example: 'Semester 23' })
  @IsString({ message: AppValidationException.INVALID_SEMESTER_TITLE })
  title: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_SEMESTER_FROM_DATE })
  fromDate?: Date;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_SEMESTER_TO_DATE })
  toDate?: Date;

  @ApiProperty({
    required: false,
    type: [CreateExaminationsDto],
    example: [
      {
        title: 'Final Exam 1',
        fromDate: '2026-06-09',
        toDate: '2026-06-15',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: AppValidationException.INVALID_SCHOOL_YEAR_EXAMINATIONS })
  @Type(() => CreateExaminationsDto)
  examinations?: CreateExaminationsDto[];
}

export class UpdateSemestersDto extends CreateSemestersDto {
  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: AppValidationException.INVALID_SEMESTER_ID })
  id: number;

  @ApiPropertyOptional({
    description: 'Đánh dấu rằng học kỳ đã bị xóa',
    example: false,
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_DELETE })
  @IsOptional()
  isDeleted?: boolean;
}

export class CreateSchoolYearsDto extends BaseSchoolYearDto {
  @ApiProperty({
    required: false,
    type: [CreateSemestersDto],
    example: [
      {
        title: 'Semester 23',
        fromDate: '2026-01-01',
        toDate: '2026-06-30',
        examinations: [
          {
            title: 'Final Exam 1',
            fromDate: '2026-06-09',
            toDate: '2026-06-15',
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: AppValidationException.INVALID_SCHOOL_YEAR_SEMESTERS })
  @Type(() => CreateSemestersDto)
  semesters?: CreateSemestersDto[];
}

export class UpdateSchoolYearDto extends BaseSchoolYearDto {
  @ApiPropertyOptional({
    type: [UpdateSemestersDto],
    example: [
      {
        id: 1,
        title: 'Semester 23',
        fromDate: '2026-01-01',
        toDate: '2026-06-30',
        isDeleted: false,
        examinations: [
          {
            id: 1,
            semesterId: 1,
            title: 'Final Exam 1',
            fromDate: '2026-06-09',
            toDate: '2026-06-15',
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: AppValidationException.INVALID_SCHOOL_YEAR_SEMESTERS })
  @Type(() => UpdateSemestersDto)
  semesters?: UpdateSemestersDto[];

  @ApiPropertyOptional({
    type: [UpdateExaminationsDto],
    example: [
      {
        id: 1,
        semesterId: 1,
        title: 'Final Exam 1',
        fromDate: '2026-06-09',
        toDate: '2026-06-15',
      },
    ],
  })
  @IsOptional()
  @IsArray({ message: AppValidationException.INVALID_SCHOOL_YEAR_EXAMINATIONS })
  @Type(() => UpdateExaminationsDto)
  examinations?: UpdateExaminationsDto[];
}
