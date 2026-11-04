import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateTeachingAssignmentItemDto {
  @ApiProperty({ description: 'ID lớp học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  classId: number;

  @ApiProperty({ description: 'ID môn học', example: 5 })
  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @ApiProperty({ description: 'ID giáo viên / nhân sự', example: 10 })
  @IsInt()
  @IsNotEmpty()
  staffId: number;

  @ApiProperty({ description: 'ID năm học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  schoolYearId: number;

  @ApiPropertyOptional({ description: 'ID học kỳ (null = cả năm)', example: 1 })
  @IsInt()
  @IsOptional()
  semesterId?: number;
}

export class BatchTeachingAssignmentDto {
  @ApiProperty({
    description: 'Danh sách phân công giảng dạy',
    type: [CreateTeachingAssignmentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeachingAssignmentItemDto)
  assignments: CreateTeachingAssignmentItemDto[];
}

export class QueryTeachingAssignmentDto {
  @ApiPropertyOptional({ description: 'Lọc theo lớp học' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  classId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo giáo viên' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  staffId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo năm học' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  schoolYearId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo học kỳ' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  semesterId?: number;

  @ApiPropertyOptional({ description: 'Lọc theo môn học' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  subjectId?: number;
}

