import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AppValidationException } from "@gedu/shared/errors";

export class CreateAdminDto {
  @ApiProperty({ description: "Mã Nhân viên của admin", example: "ADM001" })
  @IsString({ message: "Mã nhân viên không hợp lệ" })
  @IsOptional()
  code?: string;

  @ApiProperty({ description: "Email của admin", example: "admin@example.com" })
  @IsEmail({}, { message: AppValidationException.INVALID_EMAIL })
  email: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu khởi tạo; nếu bỏ trống, hệ thống tạo mật khẩu khi kích hoạt và gửi qua email',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  initialPassword?: string;

  @ApiProperty({ description: "Tên của admin", example: "Quang" })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  firstName: string;

  @ApiProperty({ description: "Họ của admin", example: "Trần" })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  lastName: string;

  @ApiProperty({ example: 1, description: "Vị trí công việc", required: false })
  @IsNumber({}, { message: "Vị trí công việc không hợp lệ" })
  @IsOptional()
  positionId?: number;

  @ApiProperty({ example: 1, description: "Phòng ban", required: false })
  @IsNumber({}, { message: "Phòng ban không hợp lệ" })
  @IsOptional()
  departmentId?: number;

  @ApiProperty({ description: "Số điện thoại", example: "0912345679", required: false })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  phone?: string;
}
export class AddAdminResponseDto {
  @ApiProperty({ example: 'Admin created successfully, pending activation' })
  message: string;
}
