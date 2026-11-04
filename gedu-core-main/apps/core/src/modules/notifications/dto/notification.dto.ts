import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID người nhận thông báo', example: 1 })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: 'Tiêu đề thông báo', example: 'Thông báo điểm danh ngày 04/11' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Nội dung thông báo', example: 'Học sinh Nguyễn Văn A đã có mặt tại lớp.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Loại thông báo: attendance, grade, schedule, system',
    example: 'attendance',
    default: 'general',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Dữ liệu đính kèm (JSON)' })
  @IsOptional()
  metadata?: any;
}

export class SendBulkNotificationDto {
  @ApiProperty({ description: 'Danh sách ID người nhận', example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  userIds: number[];

  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Loại thông báo', default: 'general' })
  @IsString()
  @IsOptional()
  type?: string;
}

