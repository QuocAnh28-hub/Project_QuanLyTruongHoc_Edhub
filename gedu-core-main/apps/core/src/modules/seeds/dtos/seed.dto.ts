import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { AppValidationException } from '@gedu/shared/errors';

export class SeedDataDto {
  @ApiProperty({
    description: 'Tên sở',
    type: String,
    example: 'Sở GDĐT TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Địa chỉ sở',
    type: String,
    example: '123 Đường ABC, Quận XYZ, TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Số điện thoại sở',
    type: String,
    example: '0123456789',
  })
  @IsString()
  @IsNotEmpty()
  hotline: string;

  @ApiProperty({
    description: 'Email sở',
    type: String,
    example: 'tech@company.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Website sở',
    type: String,
    example: 'https://company.com',
  })
  @IsString()
  @IsNotEmpty()
  website: string;

  @ApiProperty({
    description: 'Tỉnh thành phố sở',
    type: Number,
    example: 1,
  })
  @IsNumber({}, { message: AppValidationException.INVALID_PROVINCE_ID })
  provinceId: number;

  @ApiProperty({
    description: 'Phường xã sở',
    type: Number,
    example: 1,
  })
  @IsNumber({}, { message: AppValidationException.INVALID_WARD_ID })
  wardId: number;

  @ApiProperty({
    description: 'Mô tả sở',
    type: String,
    example: 'Sở GDĐT TP.HCM',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Tài khoản admin',
    type: String,
    example: 'admin@eduhub.com',
  })
  @IsString()
  @IsNotEmpty()
  adminAccount: string;

  @ApiProperty({
    description: 'Mật khẩu admin',
    type: String,
    example: 'admin123',
  })
  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @ApiProperty({
    description: 'Email admin',
    type: String,
    example: 'admin@eduhub.com',
  })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({
    description: 'Tên admin',
    type: String,
    example: 'Admin',
  })
  @IsString()
  adminFirstName: string;

  @ApiProperty({
    description: 'Họ admin',
    type: String,
    example: 'Admin',
  })
  @IsOptional()
  @IsString()
  adminLastName?: string;

  @ApiProperty({
    description: 'Số điện thoại admin',
    type: String,
    example: '0123456789',
  })
  @IsString()
  adminPhone: string;
}

export class PermissionRoleSeedData {
  @ApiProperty({
    description: 'Seed permissions',
    example: true,
  })
  permissions: boolean;

  @ApiProperty({
    description: 'Seed roles',
    example: true,
  })
  roles: boolean;

  @ApiProperty({
    description: 'Seed role-permission relationships',
    example: true,
  })
  rolePermissions: boolean;

  @ApiProperty({
    description: 'Seed position-role relationships',
    example: true,
  })
  positionRoles: boolean;
}

export class CommonSeedDataDto {
  @ApiProperty({
    description: 'Seed permission & role data',
    type: () => PermissionRoleSeedData,
    required: false,
  })
  permissionRole?: PermissionRoleSeedData;

  // Later you can extend with other seed modules
  // @ApiProperty({ type: () => UserSeedData, required: false })
  // user?: UserSeedData;

  // @ApiProperty({ type: () => SchoolSeedData, required: false })
  // school?: SchoolSeedData;
}
