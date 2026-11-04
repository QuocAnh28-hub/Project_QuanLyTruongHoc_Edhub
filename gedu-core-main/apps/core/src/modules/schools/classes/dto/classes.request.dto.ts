import {
  AppException,
  AppValidationException,
  SearchBaseDto,
} from '@gedu/shared';
import {
  DAILY_SCHEDULE_TYPE,
  ESTIMATED_LESSONS_PER_WEEK,
  GRADE_LEVEL,
} from '@gedu/shared/enums';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClassDto {
  // @ApiProperty({ example: 'A1', description: 'Mã lớp học' })
  // @IsString({ message: AppValidationException.INVALID_CLASS_CODE })
  // code: string;

  @ApiProperty({ example: 'Lớp 1A', description: 'Tên lớp học' })
  @IsString({ message: AppValidationException.INVALID_CLASS_NAME })
  name: string;

  @ApiProperty({ example: 1, description: 'ID chương trình học' })
  @IsNumber({}, { message: AppValidationException.INVALID_CURRICULUM_ID })
  curriculumId: number;

  @ApiProperty({ example: 40, description: 'Sĩ số tối đa của lớp' })
  @IsNumber({}, { message: AppValidationException.INVALID_CLASS_SIZE })
  maxClassSize: number;

  @ApiPropertyOptional({
    example: 101,
    description: 'ID ngoại ngữ thứ nhất (nếu có)',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_FIRST_FOREIGN_LANGUAGE_ID },
  )
  firstForeignLanguageId?: number;

  @ApiPropertyOptional({
    example: 102,
    description: 'ID ngoại ngữ thứ hai (nếu có)',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_SECOND_FOREIGN_LANGUAGE_ID },
  )
  secondForeignLanguageId?: number;
}

export class CreateClassGroupDto {
  @ApiProperty({ example: 2025, description: 'ID năm học' })
  @IsNumber({}, { message: AppValidationException.INVALID_SCHOOL_YEAR_ID })
  schoolYearId: number;

  @ApiPropertyOptional({
    example: '1',
    description:
      'Trình độ học sinh (ví dụ: PRE_NURSERY, NURSERY, KINDERGARTEN, GRADE_1, ...)',
  })
  @IsOptional()
  @IsEnum(GRADE_LEVEL, { message: AppException.GRADE_LEVEL_INVALID })
  gradeLevel?: number;

  @ApiProperty({
    example: 2,
    description: 'Loại lịch học hàng ngày (daily schedule type)',
  })
  @IsOptional()
  @IsEnum(DAILY_SCHEDULE_TYPE, {
    message: AppValidationException.INVALID_DAILY_SCHEDULE_TYPE,
  })
  dailyScheduleType?: number;

  @ApiProperty({
    example: true,
    description: 'Có phải là trường nội trú không',
  })
  @IsBoolean({ message: AppValidationException.INVALID_IS_DAY_BOARDING })
  @IsOptional()
  isDayBoarding?: boolean;

  @ApiProperty({
    type: [CreateClassDto],
    description: 'Danh sách các lớp học được tạo',
  })
  @IsArray({ message: 'Classes must be an array' })
  @Type(() => CreateClassDto)
  classes: CreateClassDto[];
}

export class GetClassesRequestDto extends PartialType(SearchBaseDto) {
  @ApiProperty({
    example: 1,
    description: 'ID của tổ chức (trường học)',
  })
  @Type(() => Number)
  @IsNumber({}, { message: AppValidationException.INVALID_SCHOOL_YEAR_ID })
  year: number;

  @ApiPropertyOptional({ example: 1, description: 'Khối lớp' })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(GRADE_LEVEL, {
    message: AppValidationException.INVALID_STUDENT_GRADE_LEVEL,
  })
  grd?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID của chương trình học',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: AppValidationException.INVALID_CURRICULUM_ID })
  curr?: number;
}

export class UpdateClassesInfoDto {
  @ApiPropertyOptional({ description: 'Tên lớp' })
  @IsString({ message: AppValidationException.INVALID_CLASS_NAME })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'ID Chương trình học' })
  @IsNumber({}, { message: AppValidationException.INVALID_CURRICULUM_ID })
  @IsOptional()
  curriculumId?: number;

  @ApiPropertyOptional({ description: 'ID Giáo viên chủ nhiệm' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_CLASS_HOME_ROOM_TEACHER },
  )
  @IsOptional()
  homeroomTeacherId?: number;
}

export class UpdateClassDto {
  @ApiPropertyOptional({ description: 'Tên lớp học' })
  @IsString({ message: AppValidationException.INVALID_CLASS_NAME })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Mã lớp học' })
  @IsString({ message: AppValidationException.INVALID_CLASS_CODE })
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    example: '1',
    description:
      'Khối lớp (ví dụ: PRE_NURSERY, NURSERY, KINDERGARTEN, GRADE_1, ...)',
  })
  @IsEnum(GRADE_LEVEL, { message: AppException.GRADE_LEVEL_INVALID })
  gradeLevel: number;

  @ApiPropertyOptional({ description: 'ID Giáo viên chủ nhiệm' })
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_CLASS_HOME_ROOM_TEACHER },
  )
  @IsOptional()
  homeroomTeacherId?: number;

  @ApiPropertyOptional({ description: 'Sĩ số tối đa của lớp' })
  @IsNumber({}, { message: AppValidationException.INVALID_CLASS_SIZE })
  @IsOptional()
  maxClassSize?: number;

  @ApiPropertyOptional({ description: 'ID Chương trình học' })
  @IsNumber({}, { message: AppValidationException.INVALID_CURRICULUM_ID })
  @IsOptional()
  curriculumId?: number;

  @ApiPropertyOptional({
    example: 101,
    description: 'ID ngoại ngữ thứ nhất (nếu có)',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_FIRST_FOREIGN_LANGUAGE_ID },
  )
  firstForeignLanguageId?: number;

  @ApiPropertyOptional({
    example: 102,
    description: 'ID ngoại ngữ thứ hai (nếu có)',
  })
  @IsOptional()
  @IsNumber(
    {},
    { message: AppValidationException.INVALID_SECOND_FOREIGN_LANGUAGE_ID },
  )
  secondForeignLanguageId?: number;

  @ApiPropertyOptional({
    example: 2025,
    description: 'ID năm học',
  })
  @IsOptional()
  @IsNumber({}, { message: AppValidationException.INVALID_SCHOOL_YEAR_ID })
  schoolYearId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Loại lịch học hàng ngày (daily schedule type)',
  })
  @IsOptional()
  @IsEnum(DAILY_SCHEDULE_TYPE, {
    message: AppValidationException.INVALID_DAILY_SCHEDULE_TYPE,
  })
  dailyScheduleType?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Số tiết học dự kiến mỗi tuần',
  })
  @IsOptional()
  @IsEnum(ESTIMATED_LESSONS_PER_WEEK, {
    message: AppValidationException.INVALID_ESTIMATED_LESSONS_PER_WEEK,
  })
  estimatedLessonsPerWeek?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Có phải là trường nội trú không',
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_IS_DAY_BOARDING })
  isDayBoarding?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Có phải là lớp ghép không',
  })
  @IsOptional()
  @IsBoolean({ message: AppValidationException.INVALID_IS_MULTI_GRADE })
  isMultiGrade?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Có phải là lớp có học sinh khuyết tật không',
  })
  @IsOptional()
  @IsBoolean({
    message: AppValidationException.INVALID_HAS_STUDENTS_WITH_DISABILITIES,
  })
  hasStudentsWithDisabilities?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Có phải là lớp có đại diện cha mẹ trong lớp không',
  })
  @IsOptional()
  @IsBoolean({
    message: AppValidationException.INVALID_HAS_PARENT_REP_IN_CLASS,
  })
  hasParentRepInClass?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Có phải là lớp có đại diện cha mẹ trong ban giám hiệu không',
  })
  @IsOptional()
  @IsBoolean({
    message: AppValidationException.INVALID_HAS_PARENT_REP_IN_SCHOOL_BOARD,
  })
  hasParentRepInSchoolBoard?: boolean;
}
