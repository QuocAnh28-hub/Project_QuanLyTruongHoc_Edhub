import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum StudentRequestStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export class CreateStudentRequestDto {
  @ApiProperty({ description: 'ID học sinh', example: 101 })
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @ApiProperty({
    description: 'Nội dung đề nghị cập nhật hồ sơ',
    example: 'Xin cập nhật số điện thoại liên lạc chính của mẹ thành 0912345678',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ReviewStudentRequestDto {
  @ApiProperty({
    description: 'Trạng thái xử lý: 2=Duyệt (Approved), 3=Từ chối (Rejected)',
    example: 2,
    enum: [2, 3],
  })
  @IsInt()
  @IsIn([2, 3])
  status: number;

  @ApiPropertyOptional({
    description: 'Ghi chú lý do phê duyệt hoặc từ chối',
    example: 'Đã xác minh và cập nhật hồ sơ',
  })
  @IsString()
  @IsOptional()
  reviewNote?: string;
}

export class QueryStudentRequestDto {
  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái: 1=Chờ duyệt, 2=Đã duyệt, 3=Từ chối',
  })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  status?: number;

  @ApiPropertyOptional({ description: 'Lọc theo học sinh' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  studentId?: number;
}

