import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { BOOL_MAPPING, PHONE_REGEX } from '../../../constants/common.constants';
import {
  REGEX,
  SCHOOL_DAILY_SCHEDULE_TYPE_MAP,
  SCHOOL_LEVEL_MAP,
  SCHOOL_LEVEL_SEPARATOR,
  SCHOOL_TYPE_MAP
} from '../../../constants/school.constants';

import { Transform } from 'class-transformer';
import { VALIDATION_ERRORS_MESSAGES } from '../../../constants/errors.constant';
import { constantNumberMapping } from '../../../utils/common.utils';
import { convertToComparableFormat } from '@gedu/shared';

export class SchoolImportRowDto {

  @IsString()
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_SCHOOL_CODE })
  @Matches(REGEX.schoolCode, { message: VALIDATION_ERRORS_MESSAGES.INVALID_SCHOOL_CODE })
  code: string;

  @IsString()
  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_SCHOOL_NAME })
  name: string;

  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_SCHOOL_TYPE })
  @Transform(({ value }) => constantNumberMapping(value, SCHOOL_TYPE_MAP))
  @IsIn(Object.values(SCHOOL_TYPE_MAP), { message: VALIDATION_ERRORS_MESSAGES.INVALID_SCHOOL_TYPE })
  type: number;

  @IsNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.MISSING_SCHOOL_LEVEL })
  @Transform(({ key, value }) => {
    if (!value || typeof value !== 'string') return [];
    return value.split(SCHOOL_LEVEL_SEPARATOR)
      .filter(level => level) // Filter out empty strings
      .map((level: string) => constantNumberMapping(level, SCHOOL_LEVEL_MAP));
  })
  @IsArray({ message: VALIDATION_ERRORS_MESSAGES.INVALID_SCHOOL_LEVEL })
  @ArrayNotEmpty({ message: VALIDATION_ERRORS_MESSAGES.INVALID_SCHOOL_LEVEL })
  @IsIn(Object.values(SCHOOL_LEVEL_MAP), { each: true, message: VALIDATION_ERRORS_MESSAGES.INVALID_SCHOOL_LEVEL })
  schoolLevel: number[];

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_WARD })
  @Transform(({ value }) => convertToComparableFormat(value))
  ward?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ADDRESS })
  address?: string;

  @IsOptional()
  @IsString()
  principalFirstName?: string;

  @IsOptional()
  @IsString()
  principalLastName?: string;

  @IsOptional()
  @IsString()
  @Matches(PHONE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  principalPhone?: string;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  email?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  hotline?: string;

  @Transform(({ value }) => constantNumberMapping(value, SCHOOL_DAILY_SCHEDULE_TYPE_MAP))
  @IsIn(Object.values(SCHOOL_DAILY_SCHEDULE_TYPE_MAP), {
    message: VALIDATION_ERRORS_MESSAGES.INVALID_DAILY_SCHEDULE_TYPE
  })
  dailyScheduleType: number;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_WEBSITE })
  website?: string;

  @Transform(({ value }) => constantNumberMapping(value, BOOL_MAPPING))
  @IsIn(Object.values(BOOL_MAPPING), { message: VALIDATION_ERRORS_MESSAGES.INVALID_SCHOOL_IS_INTERNATIONAL })
  isInternational: number;

  @IsOptional()
  @Transform(({ value }) => constantNumberMapping(value, BOOL_MAPPING))
  @IsIn(Object.values(BOOL_MAPPING), { message: VALIDATION_ERRORS_MESSAGES.INVALID_IS_SCHOOL_FOR_GIFTED })
  isSchoolForGifted?: number;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_ERRORS_MESSAGES.INVALID_EMAIL })
  adminEmail?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMIN_PHONE })
  @Matches(PHONE_REGEX, { message: VALIDATION_ERRORS_MESSAGES.INVALID_PHONE })
  adminPhone?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMIN_FIRST_NAME })
  adminFirstName?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_ERRORS_MESSAGES.INVALID_ADMIN_LAST_NAME })
  adminLastName?: string;
}
