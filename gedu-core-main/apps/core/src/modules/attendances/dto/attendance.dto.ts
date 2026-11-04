import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum AttendanceStatus {
  PRESENT = 1,
  EXCUSED_ABSENCE = 2,
  UNEXCUSED_ABSENCE = 3,
  LATE = 4,
}

export class AttendanceRecordItemDto {
  @ApiProperty({ description: 'ID học sinh', example: 101 })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({
    description: 'Trạng thái điểm danh: 1=Có mặt, 2=Vắng có phép, 3=Vắng không phép, 4=Đi muộn',
    example: 1,
    enum: [1, 2, 3, 4],
  })
  @IsInt()
  @IsIn([1, 2, 3, 4])
  status: number;

  @ApiPropertyOptional({ description: 'Ghi chú lý do (nếu có)', example: 'Sốt xuất huyết có đơn' })
  @IsString()
  @IsOptional()
  note?: string;
}

export class SubmitAttendanceDto {
  @ApiProperty({ description: 'ID năm học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  schoolYearId: number;

  @ApiProperty({ description: 'Ngày điểm danh (YYYY-MM-DD)', example: '2026-11-04' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Ca học: 1=Sáng, 2=Chiều', example: 1, default: 1 })
  @IsInt()
  @IsIn([1, 2])
  shift: number;

  @ApiPropertyOptional({ description: 'Tiết học (nếu điểm danh theo tiết)', example: 1 })
  @IsInt()
  @IsOptional()
  period?: number;

  @ApiProperty({
    description: 'Danh sách chi tiết chuyên cần của từng học sinh',
    type: [AttendanceRecordItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordItemDto)
  records: AttendanceRecordItemDto[];
}

export class GetSessionQueryDto {
  @ApiProperty({ description: 'Ngày cần lấy phiên điểm danh (YYYY-MM-DD)', example: '2026-11-04' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ description: 'Ca học: 1=Sáng, 2=Chiều', example: 1, default: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  shift?: number;

  @ApiPropertyOptional({ description: 'Tiết học', example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  period?: number;
}

export class AttendanceHistoryQueryDto {
  @ApiPropertyOptional({ description: 'Từ ngày (YYYY-MM-DD)', example: '2026-11-01' })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Đến ngày (YYYY-MM-DD)', example: '2026-11-30' })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Ca học: 1=Sáng, 2=Chiều', example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  shift?: number;
}

