import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePeriodDto {
  @ApiProperty({ description: 'Tiết học (1 - 10)', example: 1 })
  @IsInt()
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  period: number;

  @ApiProperty({ description: 'Ca học: 1=Sáng, 2=Chiều', example: 1 })
  @IsInt()
  @IsIn([1, 2])
  shift: number;

  @ApiProperty({ description: 'Giờ bắt đầu (HH:mm)', example: '07:30' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Giờ kết thúc (HH:mm)', example: '08:15' })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class UpdatePeriodDto {
  @ApiPropertyOptional({ description: 'Giờ bắt đầu (HH:mm)', example: '07:30' })
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiPropertyOptional({ description: 'Giờ kết thúc (HH:mm)', example: '08:15' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Kích hoạt tiết học', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ScheduleItemDto {
  @ApiProperty({ description: 'Thứ trong tuần (2=Thứ Hai, ..., 8=Chủ Nhật)', example: 2 })
  @IsInt()
  @IsIn([2, 3, 4, 5, 6, 7, 8])
  dayOfWeek: number;

  @ApiProperty({ description: 'Tiết học (1 - 10)', example: 1 })
  @IsInt()
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  period: number;

  @ApiProperty({ description: 'ID môn học', example: 3 })
  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @ApiPropertyOptional({ description: 'ID giáo viên giảng dạy', example: 12 })
  @IsInt()
  @IsOptional()
  teacherId?: number;

  @ApiPropertyOptional({ description: 'Phòng học', example: 'A101' })
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiPropertyOptional({ description: 'Ghi chú', example: 'Thực hành' })
  @IsString()
  @IsOptional()
  note?: string;
}

export class SaveClassScheduleDto {
  @ApiProperty({ description: 'ID năm học', example: 1 })
  @IsInt()
  @IsNotEmpty()
  schoolYearId: number;

  @ApiPropertyOptional({ description: 'ID học kỳ (null = cả năm)', example: 1 })
  @IsInt()
  @IsOptional()
  semesterId?: number;

  @ApiProperty({
    description: 'Danh sách các tiết trong thời khóa biểu',
    type: [ScheduleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}

export class QueryScheduleDto {
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
}

