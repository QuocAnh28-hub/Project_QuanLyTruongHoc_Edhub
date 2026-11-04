import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  IsNotContainSpecialCharacter,
  IsNumberText,
} from '@gedu/shared/decorators';
import { MARITAL_STATUS, SEX } from '@gedu/shared/enums';
import { Transform, Type } from 'class-transformer';

import { AppValidationException } from '@gedu/shared/errors';
import { SearchDto } from '@gedu/shared/dtos';
import { safeParseIdList } from '@gedu/shared/validators';

export class EducationLevelDto {
  @ApiProperty()
  @IsNumber({}, { message: AppValidationException.INVALID_EDUCATION_LEVEL })
  @IsOptional()
  educationLevel: number;

  @ApiProperty()
  @IsString({ message: AppValidationException.INVALID_MAJOR })
  @IsOptional()
  major: string;

  @ApiProperty()
  @IsString({ message: AppValidationException.INVALID_SCHOOL_NAME })
  @IsOptional()
  schoolName: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  yearOfGraduation: Date;
}

export class CreateStaffDto {
  // ======= 1. Thông tin định danh =======
  @ApiPropertyOptional({ example: 1, description: 'ID nhân viên' })
  @IsNumber({}, { message: AppValidationException.INVALID_STAFF_ID })
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'NV001', description: 'Mã nhân viên' })
  @IsString({ message: AppValidationException.INVALID_STAFF_CODE })
  @IsNotEmpty({ message: AppValidationException.MISSING_STAFF_CODE })
  code: string;

  @ApiProperty({ example: 'Nguyễn', description: 'Họ' })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_LAST_NAME })
  @IsNotContainSpecialCharacter({
    message: AppValidationException.INVALID_LAST_NAME_WITH_SPECIAL_CHAR,
  })
  lastName: string;

  @ApiProperty({ example: 'An', description: 'Tên' })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  @IsNotEmpty({ message: AppValidationException.MISSING_FIRST_NAME })
  @IsNotContainSpecialCharacter({
    message: AppValidationException.INVALID_FIRST_NAME_WITH_SPECIAL_CHAR,
  })
  firstName: string;

  @ApiPropertyOptional({ example: 1, description: 'Giới tính' })
  @IsOptional()
  @IsEnum(SEX, { message: AppValidationException.INVALID_SEX })
  @IsNotEmpty({ message: AppValidationException.MISSING_SEX })
  sex?: number;

  @ApiPropertyOptional({ example: '1990-01-01', description: 'Ngày sinh' })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOB })
  @IsNotEmpty({ message: AppValidationException.MISSING_DOB })
  dateOfBirth?: Date;

  // ======= 2. Liên hệ cá nhân =======
  @ApiProperty({ example: 'staff@example.com', description: 'Email nhân viên' })
  @IsEmail({}, { message: AppValidationException.INVALID_EMAIL })
  @IsNotEmpty({ message: AppValidationException.MISSING_EMAIL })
  email: string;

  @ApiPropertyOptional({
    example: '+84901234567',
    description: 'Số điện thoại chính',
  })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: '+84981234567',
    description: 'Số điện thoại phụ',
  })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  @IsOptional()
  phone2?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Ảnh đại diện',
  })
  @IsOptional()
  avatar?: string;

  // ======= 3. Giấy tờ tùy thân =======
  @ApiProperty({ example: '123456789', description: 'CMND/CCCD' })
  @IsString({ message: AppValidationException.INVALID_CITIZEN_ID })
  @IsNotEmpty({ message: AppValidationException.MISSING_CITIZEN_ID })
  @IsNumberText({
    message: AppValidationException.INVALID_CITIZEN_ID_NUMBER_TEXT_FORMAT,
  })
  citizenId: string;

  @ApiPropertyOptional({ example: '2020-01-01', description: 'Ngày cấp' })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOI })
  @IsOptional()
  dateOfIssue?: Date;

  @ApiPropertyOptional({ example: '2030-01-01', description: 'Ngày hết hạn' })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOE })
  @IsOptional()
  dateOfExpiry?: Date;

  @ApiPropertyOptional({ example: 'Cục Cảnh sát QG', description: 'Nơi cấp' })
  @IsString({ message: AppValidationException.INVALID_POI })
  @IsOptional()
  placeOfIssue?: string;

  // ======= 4. Địa chỉ =======
  // 4.1 Nguyên quán
  @ApiPropertyOptional({ example: 1, description: 'Tỉnh/TP nguyên quán' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_ORIGIN_PLACE_PROVINCE_ID },
  )
  @IsOptional()
  originPlaceProvinceId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Quận/Huyện nguyên quán' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_ORIGIN_PLACE_DISTRICT_ID },
  )
  @IsOptional()
  originPlaceDistrictId?: number;

  @ApiPropertyOptional({ example: 4, description: 'Phường/Xã nguyên quán' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_ORIGIN_PLACE_WARD_ID },
  )
  @IsOptional()
  originPlaceWardId?: number;

  // 4.2 Thường trú
  @ApiPropertyOptional({ example: 1, description: 'Tỉnh/TP thường trú' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_PERMANENT_RESIDENCE_PROVINCE_ID },
  )
  @IsOptional()
  permanentResidenceProvinceId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Quận/Huyện thường trú' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_PERMANENT_RESIDENCE_DISTRICT_ID },
  )
  @IsOptional()
  permanentResidenceDistrictId?: number;

  @ApiPropertyOptional({ example: 4, description: 'Phường/Xã thường trú' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_PERMANENT_RESIDENCE_WARD_ID },
  )
  @IsOptional()
  permanentResidenceWardId?: number;

  @ApiPropertyOptional({
    example: '123 Lê Lợi, Hà Nội',
    description: 'Địa chỉ thường trú',
  })
  @IsString({
    message: AppValidationException.INVALID_PERMANENT_RESIDENCE_ADDRESS,
  })
  @IsOptional()
  permanentResidenceAddress?: string;

  @ApiPropertyOptional({
    example: '123 Nguyễn Văn Cừ',
    description: 'Địa chỉ thường trú khác',
  })
  @IsString({ message: AppValidationException.INVALID_PERMANENT_ADDRESS })
  @IsOptional()
  permanentAddress?: string;

  // 4.3 Tạm trú
  @ApiPropertyOptional({ example: 1, description: 'Tỉnh/TP tạm trú' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_PROVINCE_ID },
  )
  @IsOptional()
  temporaryResidenceProvinceId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Quận/Huyện tạm trú' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_DISTRICT_ID },
  )
  @IsOptional()
  temporaryResidenceDistrictId?: number;

  @ApiPropertyOptional({ example: 4, description: 'Phường/Xã tạm trú' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_WARD_ID },
  )
  @IsOptional()
  temporaryResidenceWardId?: number;

  @ApiPropertyOptional({
    example: '456 Lý Thường Kiệt, TP HCM',
    description: 'Địa chỉ tạm trú',
  })
  @IsString({
    message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_ADDRESS,
  })
  @IsOptional()
  temporaryResidenceAddress?: string;

  @ApiPropertyOptional({
    example: 'Hà Nội',
    description: 'Nơi đăng ký thường trú',
  })
  @IsString({ message: AppValidationException.INVALID_PLACE_OF_RESIDENCE })
  @IsOptional()
  placeOfResidence?: string;

  @ApiPropertyOptional({
    example: '123 ABC, TP HCM',
    description: 'Địa chỉ hiện tại',
  })
  @IsString({ message: AppValidationException.INVALID_ADDRESS })
  @IsOptional()
  address?: string;

  // ======= 5. Người thân & liên hệ khẩn cấp =======
  @ApiPropertyOptional({
    example: '+84901234567',
    description: 'SĐT người thân 1',
  })
  @IsString({ message: AppValidationException.INVALID_RELATIVE_PHONE_NUMBER_1 })
  @IsNumberText({
    message:
      AppValidationException.INVALID_RELATIVE_PHONE_NUMBER_1_NUMBER_TEXT_FORMAT,
  })
  @IsOptional()
  relativePhone?: string;

  @ApiPropertyOptional({
    example: '+84987654321',
    description: 'SĐT người thân 2',
  })
  @IsString({ message: AppValidationException.INVALID_RELATIVE_PHONE_NUMBER_2 })
  @IsNumberText({
    message:
      AppValidationException.INVALID_RELATIVE_PHONE_NUMBER_2_NUMBER_TEXT_FORMAT,
  })
  @IsOptional()
  relativePhone2?: string;

  @ApiPropertyOptional({
    example: '+84901230000',
    description: 'Số điện thoại liên hệ 1',
  })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: '+84901239999',
    description: 'Số điện thoại liên hệ 2',
  })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  @IsOptional()
  contactPhone2?: string;

  // ======= 6. Công việc =======
  @ApiPropertyOptional({ example: true, description: 'Có phải là admin không' })
  @IsBoolean({ message: AppValidationException.INVALID_IS_ADMIN })
  @IsOptional()
  isAdmin?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'Phòng ban' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_SCHOOL_DEPARTMENT_ID },
  )
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Vị trí công việc' })
  @IsNumber({}, { message: AppValidationException.INVALID_POSITION_ID })
  @IsOptional()
  positionId?: number;

  // ======= 7. Quốc tịch, dân tộc, tôn giáo, hôn nhân =======
  @ApiProperty({ example: 1, description: 'Quốc tịch' })
  @IsNumber({}, { message: AppValidationException.INVALID_NATIONALITY_ID })
  @IsNotEmpty({ message: AppValidationException.MISSING_NATIONALITY_ID })
  nationalityId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Dân tộc' })
  @IsNumber({}, { message: AppValidationException.INVALID_ETHNICITY_ID })
  @IsOptional()
  ethnicityId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Tôn giáo' })
  @IsNumber({}, { message: AppValidationException.INVALID_RELIGION })
  @IsOptional()
  religionId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Tình trạng hôn nhân' })
  @IsEnum(MARITAL_STATUS, {
    message: AppValidationException.INVALID_MARTIAL_STATUS,
  })
  @IsOptional()
  maritalStatus?: number;
}

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @ApiPropertyOptional({
    description: 'Date of joining the Union',
    type: String,
    format: 'date',
    example: '2015-03-26',
  })
  @IsOptional()
  @IsDateString()
  dateOfJoiningUnion?: string;

  @ApiPropertyOptional({
    description: 'Date of joining the Communist Party',
    type: String,
    format: 'date',
    example: '2018-06-15',
  })
  @IsOptional()
  @IsDateString()
  dateOfJoiningParty?: string;

  @ApiPropertyOptional({
    description: 'Date of enlistment (joining the military)',
    type: String,
    format: 'date',
    example: '2019-02-10',
  })
  @IsOptional()
  @IsDateString()
  dateOfEnlistment?: string;

  @ApiPropertyOptional({
    description: 'Date of discharge (leaving the military)',
    type: String,
    format: 'date',
    example: '2021-08-20',
  })
  @IsOptional()
  @IsDateString()
  dateOfDischarge?: string;
}

export class GetStaffDto extends PartialType(SearchDto) {
  @ApiProperty({ example: 1, description: 'ID phòng ban', required: false })
  @Transform(safeParseIdList())
  @IsOptional()
  dept?: number[];

  @ApiProperty({ example: 1, description: 'ID vị trí', required: false })
  @Transform(safeParseIdList())
  @IsOptional()
  pos?: number[];
}

export class UpdateDepartmentDto {
  @ApiProperty({ example: 1, description: 'ID phòng ban' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_SCHOOL_DEPARTMENT_ID },
  )
  departmentId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID vị trí công việc',
  })
  @IsNumber({}, { message: AppValidationException.INVALID_POSITION_ID })
  @IsOptional()
  positionId?: number;

  @ApiProperty({
    example: 'Phòng Kế toán',
    description: 'Tên phòng ban',
  })
  @IsNumber({}, {  each: true, message: AppValidationException.INVALID_STAFF_POSITIONS })
  @IsOptional()
  schoolStaffPositions?: number[] | null;
}

export class ActivateStaffDto {
  @ApiProperty({
    description: 'Danh sách ID của cán bộ cần kích hoạt',
    type: [Number],
    example: [101, 102, 103],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}

export class FileDto {
  @ApiPropertyOptional({
    description: 'File id (if provided = update, else = create)',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'File name' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'File link (URL or storage path)' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(2000)
  link: string;

  @ApiPropertyOptional({ description: 'File type', example: 1 })
  @IsOptional()
  @IsInt()
  type?: number;
  @ApiPropertyOptional({
    description: 'Mark file as deleted (true = delete this file on update)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class SyncStaffFoldersRequestDto {
  @ApiPropertyOptional({
    description: 'Folder id (if provided = update, else = create)',
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'Folder name' })
  @IsString()
  folderName: string;

  @ApiProperty({ description: 'Issuing authority' })
  @IsString()
  issuingAuthority: string;

  @ApiPropertyOptional({ description: 'Date of issue (ISO string)' })
  @IsOptional()
  @IsDateString()
  dateOfIssue?: string;

  @ApiPropertyOptional({ description: 'Record number' })
  @IsOptional()
  @IsString()
  recordNumber?: string;

  @ApiPropertyOptional({ description: 'Folder type', example: 1 })
  @IsOptional()
  @IsInt()
  type?: number;

  @ApiPropertyOptional({
    description: 'Mark folder as deleted',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    type: [FileDto],
    description: 'List of files to create/update',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}
