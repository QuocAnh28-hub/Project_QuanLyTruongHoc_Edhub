import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum ScoreType {
  ORAL = 1, // Điểm miệng / TX1
  SHORT_TEST = 2, // Điểm 15 phút / TX2
  LONG_TEST = 3, // Điểm 1 tiết / TX3
  MIDTERM = 4, // Điểm giữa kỳ
  FINAL = 5, // Điểm cuối kỳ
}

export class ScoreInputItemDto {
  @ApiProperty({ description: 'ID học sinh', example: 101 })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiPropertyOptional({ description: 'Điểm số (Thang điểm 10)', example: 8.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  scoreValue?: number;

  @ApiPropertyOptional({ description: 'Nhận xét của giáo viên', example: 'Nắm chắc kiến thức' })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class BulkRecordScoreDto {
  @ApiProperty({ description: 'ID môn học', example: 5 })
  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @ApiProperty({ description: 'ID năm học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  schoolYearId: number;

  @ApiProperty({ description: 'ID học kỳ', example: 1 })
  @IsInt()
  @IsNotEmpty()
  semesterId: number;

  @ApiProperty({
    description: 'Loại điểm: 1=Miệng, 2=15 phút, 3=1 tiết, 4=Giữa kỳ, 5=Cuối kỳ',
    example: 1,
    enum: [1, 2, 3, 4, 5],
  })
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
  scoreType: number;

  @ApiProperty({
    description: 'Danh sách điểm của từng học sinh',
    type: [ScoreInputItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreInputItemDto)
  scores: ScoreInputItemDto[];
}

export class CalculateSummaryDto {
  @ApiProperty({ description: 'ID năm học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  schoolYearId: number;

  @ApiProperty({ description: 'ID học kỳ', example: 1 })
  @IsInt()
  @IsNotEmpty()
  semesterId: number;

  @ApiPropertyOptional({ description: 'ID môn học (bỏ trống nếu tính toàn bộ môn)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  subjectId?: number;
}

export class QueryScoreDto {
  @ApiProperty({ description: 'ID năm học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  schoolYearId: number;

  @ApiProperty({ description: 'ID học kỳ', example: 1 })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  semesterId: number;
}

