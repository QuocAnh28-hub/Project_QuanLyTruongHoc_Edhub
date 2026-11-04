import {
  ADMISSION_TYPE,
  AppException,
  AppValidationException,
  GRADE_LEVEL,
  SEX,
} from '@gedu/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class BaseStudentRequestDto {
  @ApiPropertyOptional({
    type: String,
    description: 'URL of the user avatar',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_AVATAR })
  avatar?: string;

  @ApiProperty({
    example: 'An',
    description: 'Tên học sinh',
  })
  @IsNotEmpty({ message: AppValidationException.MISSING_FIRST_NAME })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  firstName: string;

  @ApiProperty({
    example: 'Nguyễn',
    description: 'Họ học sinh',
  })
  @IsNotEmpty({ message: AppValidationException.MISSING_LAST_NAME })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  lastName: string;

  @ApiPropertyOptional({
    example: '123456789',
    description: 'CMND/CCCD',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_CITIZEN_ID })
  citizenId?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Ngày sinh (yyyy-MM-dd)',
  })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOB })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    example: 1,
    description: 'Giới tính (0: Nữ, 1: Nam, 2: Khác)',
  })
  @IsOptional()
  @IsEnum(SEX, { message: AppValidationException.INVALID_SEX })
  sex?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Quốc tịch',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_NATIONALITY_ID })
  nationalityId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Tôn giáo',
  })
  @IsNumber({}, { message: AppValidationException.INVALID_RELIGION_ID })
  @IsOptional()
  religionId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Tỉnh/Thành nơi sinh',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_ORIGIN_PLACE_PROVINCE_ID },
  )
  originPlaceProvinceId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Quận/Huyện nơi sinh',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_ORIGIN_PLACE_DISTRICT_ID },
  )
  originPlaceDistrictId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Phường/Xã nơi sinh',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_ORIGIN_PLACE_WARD_ID },
  )
  originPlaceWardId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Tỉnh/Thành nơi thường trú',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_PERMANENT_RESIDENCE_PROVINCE_ID },
  )
  permanentResidenceProvinceId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Quận/Huyện nơi thường trú',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_PERMANENT_RESIDENCE_DISTRICT_ID },
  )
  permanentResidenceDistrictId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Phường/Xã nơi thường trú',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_PERMANENT_RESIDENCE_WARD_ID },
  )
  permanentResidenceWardId?: number;

  @ApiPropertyOptional({
    example: '123 Lê Lợi, TP.HCM',
    description: 'Địa chỉ cụ thể nơi thường trú',
  })
  @IsOptional()
  @IsString({
    message: AppValidationException.INVALID_PERMANENT_RESIDENCE_ADDRESS,
  })
  permanentResidenceAddress?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Tỉnh/Thành nơi tạm trú',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_PROVINCE_ID },
  )
  temporaryResidenceProvinceId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Quận/Huyện nơi tạm trú',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_DISTRICT_ID },
  )
  temporaryResidenceDistrictId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Phường/Xã nơi tạm trú',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_WARD_ID },
  )
  temporaryResidenceWardId?: number;

  @ApiPropertyOptional({
    example: '123 Nguyễn Huệ, TP.HCM',
    description: 'Địa chỉ cụ thể nơi tạm trú',
  })
  @IsOptional()
  @IsString({
    message: AppValidationException.INVALID_TEMPORARY_RESIDENCE_ADDRESS,
  })
  temporaryResidenceAddress?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID Dân tộc',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_ETHNICITY_ID })
  ethnicityId?: number;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Ngày cấp',
    required: false,
  })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOI })
  @IsOptional()
  dateOfIssue?: Date;

  @ApiProperty({
    example: '2030-01-01',
    description: 'Ngày hết hạn',
    required: false,
  })
  @Type(() => Date)
  @IsDate({ message: AppValidationException.INVALID_DOE })
  @IsOptional()
  dateOfExpiry?: Date;

  @ApiProperty({
    example: 'Cục Cảnh sát QG',
    description: 'Nơi cấp',
    required: false,
  })
  @IsString({ message: AppValidationException.INVALID_POI })
  @IsOptional()
  placeOfIssue?: string;
}

export class CreateStudentRequestDto extends BaseStudentRequestDto {
  @ApiPropertyOptional({
    example: 123,
    description: 'ID học sinh (tùy chọn - dùng cho mục đích cập nhật)',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_STUDENT_ID })
  id?: number;

  @ApiProperty({
    example: 'HS12345',
    description: 'Mã học sinh',
  })
  @IsString({ message: AppValidationException.INVALID_STUDENT_CODE })
  code: string;
}

export class UpdateContactStudentRequestDto {
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Ảnh đại diện của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_AVATAR })
  avatar?: string;

  @ApiPropertyOptional({
    example: 'An',
    description: 'Tên của liên hệ',
  })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  firstName: string;

  @ApiPropertyOptional({
    example: 'Nguyễn',
    description: 'Họ của liên hệ',
  })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  lastName: string;

  @ApiPropertyOptional({
    example: '0901234567',
    description: 'Số điện thoại của liên hệ',
  })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  phone: string;

  @ApiPropertyOptional({ description: 'Email của phụ huynh' })
  @IsString({ message: AppValidationException.INVALID_EMAIL })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Mối quan hệ với học sinh',
  })
  @IsNotEmpty({ message: AppValidationException.MISSING_RELATIONSHIP })
  @IsIn([1, 2, 9], { message: AppValidationException.INVALID_RELATIONSHIP })
  relationship?: number;

  @ApiPropertyOptional({
    example: 'Bố ruột',
    description: 'Tiêu đề mô tả mối quan hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_RELATIONSHIP_TITLE })
  relationshipTitle?: string;

  @ApiPropertyOptional({
    description: 'Đánh dấu liên hệ chính của học sinh',
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_MAIN_CONTACT })
  @IsOptional()
  isMainContact?: boolean;

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

export class ExtendedUpdateContactStudentRequestDto extends UpdateContactStudentRequestDto {
  @ApiPropertyOptional({
    example: 123,
    description: 'ID liên hệ',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_STUDENT_ID })
  id?: number;

  @ApiPropertyOptional({
    description: 'Đánh dấu liên hệ bị xoá',
    example: false,
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_DELETE })
  @IsOptional()
  isDeleted?: boolean;
}

export class UpdateStudentRequestDto extends BaseStudentRequestDto {}

export class UpdateStudentContactsDto {
  @ApiProperty({
    description: 'Danh sách liên hệ của học sinh',
    type: [UpdateContactStudentRequestDto],
  })
  @IsArray({ message: 'Danh sách liên hệ phải là mảng' })
  @ArrayNotEmpty({ message: 'Danh sách liên hệ không được để trống' })
  @ValidateNested({ each: true })
  @Type(() => UpdateContactStudentRequestDto)
  contacts: UpdateContactStudentRequestDto[];
}

export class SetAdminAccountRequestDto {
  @ApiProperty({
    example: 1,
    description: 'ID của tài khoản người dùng',
  })
  @IsNumber({}, { message: AppValidationException.INVALID_USER_ID })
  userId: number;
}

export class UpdatePriorityPoliciesDto {
  @ApiPropertyOptional({
    example: '2023-09-01',
    description: 'Ngày nhập học (yyyy-MM-dd)',
  })
  @Type(() => Date)
  @IsDate({ message: AppException.ADMISSION_DATE_INVALID })
  @IsOptional()
  admissionDate?: Date;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID năm học',
  })
  @Type(() => Number)
  @IsNumber({}, { message: AppException.ADMISSION_SCHOOL_YEAR_ID_INVALID })
  @IsOptional()
  admissionSchoolYearId?: number;

  @ApiPropertyOptional({
    example: '1',
    description:
      'Trình độ học sinh (ví dụ: PRE_NURSERY, NURSERY, KINDERGARTEN, GRADE_1, ...)',
  })
  @IsEnum(GRADE_LEVEL, { message: AppException.GRADE_LEVEL_INVALID })
  gradeLevel: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Loại nhập học (ví dụ: NEW, TRANSFER)',
  })
  @IsEnum(ADMISSION_TYPE, { message: AppException.ADMISSION_TYPE_INVALID })
  @IsOptional()
  admissionType?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID lớp',
  })
  @Type(() => Number)
  @IsNumber({}, { message: AppException.CLASS_ID_INVALID })
  @IsOptional()
  classId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID chính sách ưu tiên',
  })
  @Type(() => Number)
  @IsNumber({}, { message: AppException.PRIORITY_POLICY_ID_INVALID })
  @IsOptional()
  priorityPolicyId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID chính sách hỗ trợ đặc biệt',
  })
  @Type(() => Number)
  @IsNumber({}, { message: AppException.SPECIAL_NEEDS_POLICY_ID_INVALID })
  @IsOptional()
  specialNeedsPolicyId?: number;
}
export class UpdateMedicalInfo {
  @ApiProperty({
    example: 'Nhóm thông tin y tế',
    description: 'Nhóm thông tin y tế của học sinh',
  })
  @IsNumber({}, { message: AppException.INVALID_MEDICAL_INFO_GROUP })
  @IsOptional()
  group?: number;

  @ApiProperty({
    example: 'Loại thông tin y tế',
    description: 'Loại thông tin y tế của học sinh',
  })
  @IsNumber({}, { message: AppException.INVALID_MEDICAL_INFO_TYPE })
  @IsOptional()
  type?: number;

  @ApiProperty({
    example: 'Thông tin y tế',
    description: 'Thông tin y tế của học sinh',
  })
  @IsString({ message: AppException.INVALID_MEDICAL_INFO })
  @IsOptional()
  info?: string;
}
export class UpdateMedicalInfoRequestDto {
  @ApiProperty({
    type: [UpdateMedicalInfo],
    description: 'Danh sách thông tin y tế của học sinh',
    example: [
      { group: 1, type: 2, info: 'Tiêm ngừa đầy đủ' },
      { group: 1, type: 3, info: 'Không có tiền sử dị ứng' },
    ],
  })
  @IsArray({ message: AppException.INVALID_MEDICAL_INFO_GROUP })
  @ArrayNotEmpty({ message: AppException.EMPTY_MEDICAL_INFO_GROUP })
  @ValidateNested({ each: true })
  @Type(() => UpdateMedicalInfo)
  medicalList: UpdateMedicalInfo[];
}
export class UpdateGrantContactAccessDto {
  @ApiProperty({
    example: 123,
    description: 'ID liên hệ của học sinh',
  })
  @IsNumber({}, { message: AppValidationException.INVALID_CONTACT_ID })
  contactId: number;
}

export class CreateContactDto {
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Ảnh đại diện của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_AVATAR })
  avatar?: string;

  @ApiProperty({
    example: 'An',
    description: 'Tên của liên hệ',
  })
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  firstName: string;

  @ApiProperty({
    example: 'Nguyễn',
    description: 'Họ của liên hệ',
  })
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  lastName: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại của liên hệ',
  })
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  phone: string;

  @ApiPropertyOptional({
    description: 'Email của phụ huynh',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_EMAIL })
  email?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Mối quan hệ với học sinh',
  })
  @IsIn([1, 2, 9], { message: AppValidationException.INVALID_RELATIONSHIP })
  relationship?: number;

  @ApiPropertyOptional({
    example: 'Bố ruột',
    description: 'Tiêu đề mô tả mối quan hệ',
  })
  @IsString({ message: AppValidationException.INVALID_RELATIONSHIP_TITLE })
  relationshipTitle?: string;

  @ApiPropertyOptional({
    description: 'Đánh dấu liên hệ chính của học sinh',
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_MAIN_CONTACT })
  isMainContact?: boolean;

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

export class UpdateContactDto {
  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Ảnh đại diện của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_AVATAR })
  avatar?: string;

  @ApiPropertyOptional({
    example: 'An',
    description: 'Tên của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_FIRST_NAME })
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Nguyễn',
    description: 'Họ của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_LAST_NAME })
  lastName?: string;

  @ApiPropertyOptional({
    example: '0901234567',
    description: 'Số điện thoại của liên hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_PHONE_NUMBER })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email của phụ huynh',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_EMAIL })
  email?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Mối quan hệ với học sinh',
  })
  @IsOptional()
  @IsIn([1, 2, 9], { message: AppValidationException.INVALID_RELATIONSHIP })
  relationship?: number;

  @ApiPropertyOptional({
    example: 'Bố ruột',
    description: 'Tiêu đề mô tả mối quan hệ',
  })
  @IsOptional()
  @IsString({ message: AppValidationException.INVALID_RELATIONSHIP_TITLE })
  relationshipTitle?: string;

  @ApiPropertyOptional({
    description: 'Đánh dấu liên hệ chính của học sinh',
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_IS_MAIN_CONTACT })
  isMainContact?: boolean;

  @ApiPropertyOptional({
    description: 'Cấp quyền truy cập ứng dụng G-Edu',
  })
  @IsOptional()
  @IsBoolean()
  grantAccess?: boolean;

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

export class ArrangeStudentClassDto {
  @ApiProperty({
    example: 1,
    description: 'ID của lớp học',
  })
  @IsNumber()
  classId: number;

  @ApiProperty({
    example: 10,
    description: 'Khối lớp (ví dụ: 1–12)',
  })
  @IsNumber()
  gradeLevel: number;
}

export class ArrangeBatchStudentClassDto {
  @ApiProperty({
    example: 1,
    description: 'ID của lớp học',
  })
  @IsNumber({}, {})
  @Type(() => Number)
  classId: number;

  @ApiProperty({
    example: 10,
    description: 'Khối lớp (ví dụ: 1–12)',
  })
  @IsNumber()
  gradeLevel: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách ID của học sinh',
  })
  @IsArray({})
  @ArrayNotEmpty({ message: 'Danh sách ID của học sinh không được để trống' })
  @ArrayMaxSize(100, { message: 'Danh sách ID của học sinh không quá 100' })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  studentIds: number[];
}

export class TransferStudentClassDto {
  @ApiProperty({
    example: 1,
    description: 'ID của lớp học hiện tại (chuyển đi)',
  })
  @IsNumber()
  @Type(() => Number)
  fromClassId: number;

  @ApiProperty({
    example: 2,
    description: 'ID của lớp học mới (chuyển đến)',
  })
  @IsNumber()
  @Type(() => Number)
  toClassId: number;

  @ApiProperty({
    example: 10,
    description: 'Khối lớp (ví dụ: 1–12)',
  })
  @IsNumber()
  gradeLevel: number;

  @ApiProperty({
    example: 'Chuyển lớp do thay đổi chỗ ở',
    description: 'Ghi chú cho việc chuyển lớp',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
