import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActivateAdminsDto {
  @ApiProperty({
    description: 'Danh sách ID của các quản trị viên cần kích hoạt',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];

  @ApiPropertyOptional({
    description: 'Mật khẩu tự đặt để kích hoạt mà không cần gửi email',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
