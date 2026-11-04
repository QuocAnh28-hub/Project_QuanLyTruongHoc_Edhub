import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import {
  IsNotContainSpecialCharacter,
  IsNumberText,
} from '@gedu/shared/decorators';
import { Transform, Type } from 'class-transformer';

import { AppValidationException } from '@gedu/shared/errors';

export class CreateCampusDto {
  @ApiProperty({
    example: 'CS001',
    description: 'Mã cơ sở',
  })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_CODE })
  @IsNotEmpty({ message: AppValidationException.MISSING_SCHOOL_CODE })
  @IsNotContainSpecialCharacter({
    message: AppValidationException.INVALID_SCHOOL_CODE,
  })
  code: string;

  @ApiProperty({
    example: 'Cơ sở Quận 1',
    description: 'Tên cơ sở',
  })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_SCHOOL_NAME })
  name: string;

  @ApiPropertyOptional({
    example: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    description: 'Địa chỉ cơ sở',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_ADDRESS })
  address?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Tỉnh/Thành phố',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_PROVINCE_ID })
  provinceId?: number;

  @ApiPropertyOptional({
    example: 4,
    description: 'ID Phường/Xã',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_WARD_ID })
  wardId?: number;

  @ApiPropertyOptional({
    example: '0283123456',
    description: 'Số điện thoại hotline của cơ sở',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_SCHOOL_HOT_LINE })
  @IsNumberText({
    message: AppValidationException.INVALID_SCHOOL_HOT_LINE,
  })
  hotline?: string;

  @ApiPropertyOptional({
    example: 5000.5,
    description: 'Tổng diện tích cơ sở (m²)',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Tổng diện tích phải là số hợp lệ' },
  )
  totalArea?: number;

  @ApiPropertyOptional({
    example: 1500,
    description: 'Khoảng cách từ cơ sở chính (mét)',
  })
  @IsOptional()
  @IsInt({ message: 'Khoảng cách phải là số nguyên' })
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  distance?: number;

  @ApiPropertyOptional({
    example: 'Xe buýt, xe máy',
    description: 'Phương tiện di chuyển đến cơ sở',
  })
  @IsOptional()
  @IsString({ message: 'Phương tiện di chuyển phải là chuỗi hợp lệ' })
  meansOfTransportation?: string;
}

export class UpdateCampusDto extends PartialType(CreateCampusDto) {
  @ApiPropertyOptional({
    description: 'Campus ID for update operations',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: AppValidationException.INVALID_CAMPUS_ID })
  id?: number;

  @ApiPropertyOptional({
    description: 'Mark campus as deleted (soft delete)',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_IS_DELETE })
  isDeleted?: boolean;
}