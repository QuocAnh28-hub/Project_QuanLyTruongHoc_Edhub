import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  IsNotContainSpecialCharacter,
  IsNumberText,
} from '@gedu/shared/decorators';
import { SCHOOL_OPERATION_MODE, SCHOOL_TYPE } from '@gedu/shared/enums';

import { ApiProperty } from '@nestjs/swagger';
import { AppValidationException } from '@gedu/shared/errors';
import { BOOL_MAPPING } from 'apps/import/src/constants/common.constants';
import { Transform } from 'class-transformer';
import { VALIDATION_ERRORS_MESSAGES } from 'apps/import/src/constants/errors.constant';
import { constantNumberMapping } from 'apps/import/src/utils/common.utils';

export class CreateSchoolDto {
  @ApiProperty({ description: 'ID của tổ chức', required: false })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_SCHOOL_ID })
  id?: number;

  @ApiProperty({
    description: 'Tên trường',
    required: true,
    example: 'Trường THPT Nguyễn Trãi 001',
  })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_SCHOOL_NAME })
  @IsNotContainSpecialCharacter({
    message: AppValidationException.INVALID_SCHOOL_NAME_WITH_SPECIAL_CHAR,
  })
  name: string;

  @ApiProperty({
    description: 'Mã trường',
    required: true,
    example: 'THPTNGUYENTRAI-001',
  })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_CODE })
  @IsNotEmpty({ message: AppValidationException.MISSING_SCHOOL_CODE })
  code: string;

  @ApiProperty({
    description: 'Tên trường viết ngắn',
    required: false,
    example: 'Nguyễn Trãi 001',
  })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_SHORT_NAME })
  @IsNotContainSpecialCharacter({
    message: AppValidationException.INVALID_SCHOOL_NAME_WITH_SPECIAL_CHAR,
  })
  @IsOptional()
  shortName?: string;

  @ApiProperty({
    description: 'Hotline',
    required: false,
    example: '0912345678',
  })
  @IsString({ message: AppValidationException.INVALID_SCHOOL_HOT_LINE })
  @IsOptional()
  hotline?: string;

  @ApiProperty({
    description: 'Tên hiệu trưởng',
    required: false,
    example: 'Hùng',
  })
  @IsString({
    message: AppValidationException.INVALID_SCHOOL_PRINCIPAL_FIRST_NAME,
  })
  @IsOptional()
  principalFirstName?: string;

  @ApiProperty({
    description: 'Họ hiệu trưởng',
    required: false,
    example: 'Trần',
  })
  @IsString({
    message: AppValidationException.INVALID_SCHOOL_PRINCIPAL_LAST_NAME,
  })
  @IsOptional()
  principalLastName?: string;

  @ApiProperty({
    description: 'SĐT hiệu trưởng',
    required: false,
    example: '0912345678',
  })
  @IsString({
    message: AppValidationException.INVALID_SCHOOL_PRINCIPAL_PHONE_NUMBER,
  })
  @IsNumberText({
    message:
      AppValidationException.INVALID_SCHOOL_PRINCIPAL_PHONE_NUMBER_NUMBER_TEXT_FORMAT,
  })
  @IsOptional()
  principalPhone?: string;

  @ApiProperty({
    description: 'ID tỉnh/thành phố',
    required: false,
    example: 1,
  })
  @IsInt({ message: AppValidationException.INVALID_PROVINCE_ID })
  @IsOptional()
  provinceId: number;

  @ApiProperty({ description: 'ID xã/phường', required: false, example: 4 })
  @IsInt({ message: AppValidationException.INVALID_WARD_ID })
  @IsOptional()
  wardId?: number;

  @ApiProperty({
    description: 'Địa chỉ chi tiết của trường',
    required: false,
    example: '123 Nguyễn Trãi, Phường Phúc Xá, TP. HN',
  })
  @IsString({ message: AppValidationException.INVALID_ADDRESS })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Email',
    required: false,
    example: 'contact@thoa.edu.vn',
  })
  @IsString({ message: AppValidationException.INVALID_EMAIL })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Supports preschool education', default: false })
  @IsBoolean({ message: AppValidationException.INVALID_CAN_PRESCHOOL })
  @IsOptional()
  canPreschool?: boolean;

  @ApiProperty({ description: 'Supports primary education', default: false })
  @IsBoolean({ message: AppValidationException.INVALID_CAN_PRIMARY_SCHOOL })
  canPrimarySchool: boolean;

  @ApiProperty({
    description: 'Supports lower secondary education',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  canLowerSecondarySchool?: boolean;

  @ApiProperty({
    description: 'Supports upper secondary education',
    default: false,
  })
  @IsBoolean()
  canUpperSecondarySchool: boolean;

  @ApiProperty({
    description: 'Website của trường',
    required: false,
    example: 'https://www.thoa.edu.vn',
  })
  @IsUrl({}, { message: AppValidationException.INVALID_WEBSITE })
  @IsOptional()
  website: string;

  @ApiProperty({
    description: 'SĐT người liên hệ',
    required: false,
    example: '0912345678',
  })
  @IsString({ message: AppValidationException.INVALID_CONTACT_PHONE_NUMBER })
  @IsNumberText({
    message:
      AppValidationException.INVALID_CONTACT_PHONE_NUMBER_NUMBER_TEXT_FORMAT,
  })
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({ description: 'Trạng thái của trường', example: 1 })
  @IsEnum(SCHOOL_TYPE, {
    message: AppValidationException.INVALID_SCHOOL_TYPE,
  })
  type: number;

  @ApiProperty({
    description: 'Tổ chức hoạt động của trường',
    required: false,
    example: 1,
  })
  @Transform(({ value }) => (value === 0 ? undefined : value))
  @IsEnum(SCHOOL_OPERATION_MODE, {
    message: AppValidationException.INVALID_DAILY_SCHEDULE_TYPE,
  })
  @IsOptional()
  dailyScheduleType?: number;

  @ApiProperty({ description: 'Trường quốc tế', default: false })
  @IsBoolean({
    message: AppValidationException.INVALID_IS_INTERNATIONAL_SCHOOL,
  })
  @IsOptional()
  isInternationalSchool?: boolean;
}
