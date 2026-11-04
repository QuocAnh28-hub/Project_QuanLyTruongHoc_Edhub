import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AppValidationException } from '@gedu/shared/errors';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty({ message: AppValidationException.MISSING_EDU_DEPARTMENT_ID })
  eduDepartmentId: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: AppValidationException.INVALID_EMAIL })
  @IsNotEmpty({ message: AppValidationException.MISSING_EMAIL })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: AppValidationException.INVALID_PASSWORD })
  @IsNotEmpty({ message: AppValidationException.MISSING_PASSWORD })
  @MinLength(8, { message: AppValidationException.INVALID_PASSWORD_LENGTH })
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_FIRST_NAME })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_LAST_NAME })
  lastName: string;

  @ApiProperty({})
  @IsNotEmpty({ message: AppValidationException.INVALID_ROLE_ID })
  roleId: string;

  @ApiProperty({ example: '1234567890' })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  @IsNotEmpty({ message: AppValidationException.MISSING_PHONE_NUMBER })
  phone: string;
}

export class CreateContactStudentDto {
  @ApiProperty({ example: 'John' })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_FIRST_NAME })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_LAST_NAME })
  lastName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  @IsNotEmpty({ message: AppValidationException.MISSING_PHONE_NUMBER })
  phone: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: AppValidationException.INVALID_EMAIL })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Ngày sinh của liên hệ (yyyy-MM-dd)',
  })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOB })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    example: '123456789',
    description: 'CMND/CCCD của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_CITIZEN_ID })
  citizenId?: string;

  @ApiPropertyOptional({
    example: 'Công nhân',
    description: 'Tên công việc của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_OCCUPATION })
  occupation?: string;
}
