import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { convertToComparableFormat, convertProvinceNameToComparableFormat, convertWardNameToComparableFormat } from '@gedu/shared';
import { VALIDATION_ERRORS_MESSAGES } from '../../../constants/errors.constant';
import { CODE_REGEX, PHONE_REGEX, SEX_MAPPING } from '../../../constants/common.constants';
import { constantNumberMapping } from '../../../utils/common.utils';


export class CreateStaffRowDto {
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_STAFF_CODE })
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_STAFF_CODE })
  @Matches(CODE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_STAFF_CODE })
  code: string;

  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_FIRST_NAME })
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_FIRST_NAME })
  firstName: string;

  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_LAST_NAME })
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_LAST_NAME })
  lastName: string;

  // CCCD
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_CITIZEN_ID })
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_CITIZEN_ID })
  citizenId: string;

  // Ngày cấp
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DOI })
  @IsOptional()
  dateOfIssue?: Date;

  // Ngày hết hạn
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DOE })
  @IsOptional()
  dateOfExpiry?: Date;

  // Nơi cấp
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_POI })
  @IsOptional()
  placeOfIssue?: string;

  // Ngày sinh
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERRORS_MESSAGES.INVALID_DOB })
  @IsOptional()
  dateOfBirth?: Date;

  // Giới tính
  @IsOptional()
  @Transform(({ value }) => constantNumberMapping(value, SEX_MAPPING))
  @IsIn(Object.values(SEX_MAPPING), { message: VALIDATION_ERRORS_MESSAGES.INVALID_SEX })
  sex?: number;

  // Quốc tịch
  @IsOptional()
  @Transform(({ value }) => convertToComparableFormat(value))
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_NATIONALITY })
  nationality?: string;

  // Tôn giáo
  @IsOptional()
  @Transform(({ value }) => convertToComparableFormat(value))
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_RELIGION })
  religion?: string;

  // Nơi đăng ký thường trú
  @IsOptional()
  @Transform(({ value }) => convertProvinceNameToComparableFormat(value))
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PERMANENT_RESIDENCE_PROVINCE_ID })
  permanentResidenceProvince?: string;

  // Xã/phường nơi đăng ký thường trú
  @IsOptional()
  @Transform(({ value }) => convertWardNameToComparableFormat(value))
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PERMANENT_RESIDENCE_WARD_ID })
  permanentResidenceWard?: string;

  // Địa chỉ nơi đăng ký thường trú
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PERMANENT_ADDRESS })
  @IsOptional()
  permanentAddress?: string;

  // Tỉnh/thành phố tạm trú
  @IsOptional()
  @Transform(({ value }) => convertProvinceNameToComparableFormat(value))
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_TEMPORARY_RESIDENCE_PROVINCE_ID })
  temporaryResidenceProvince?: string;

  // Xã/phường tạm trú
  @IsOptional()
  @Transform(({ value }) => convertWardNameToComparableFormat(value))
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_TEMPORARY_RESIDENCE_WARD_ID })
  temporaryResidenceWard?: string;

  // Địa chỉ tạm trú
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_TEMPORARY_RESIDENCE_ADDRESS })
  @IsOptional()
  temporaryResidenceAddress?: string;

  // Email
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_EMAIL })
  email: string;

  // Số điện thoại
  @Type(() => String)
  @IsOptional()
  @Matches(PHONE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  phone?: string;
  
  // Số điện thoại liên hệ 1
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_RELATIVE_PHONE_NUMBER_1 })
  @IsOptional()
  @Matches(PHONE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  contactPhone?: string;

  // Số điện thoại liên hệ 2
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_RELATIVE_PHONE_NUMBER_2 })
  @IsOptional()
  @Matches(PHONE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  contactPhone2?: string;
  
  // Chức vụ
  @IsOptional()
  @Transform(({ value }) => convertToComparableFormat(value))
  position?: string;

  // Phòng ban
  @IsOptional()
  @Transform(({ value }) => convertToComparableFormat(value))
  department?: string;

  // Chức vụ trong trường
  @IsOptional()
  @Transform(({ value }) => convertToComparableFormat(value))
  schoolPosition?: string;
}
