import { Expose, Transform, Type } from 'class-transformer';
import { SchoolCampus, SchoolFacility, SchoolOperation } from '@gedu/prisma';

import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from 'libs/prisma/generated/client/internal/prismaNamespace';

export class SchoolResponseDto {
  @ApiProperty({ example: 100005, description: 'School ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'THPTNGUYENTRAI-002', description: 'School code' })
  @Expose()
  code: string;

  @ApiProperty({
    example: 'Trường THPT Nguyễn Trãi 002',
    description: 'School name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Nguyễn Trãi 002',
    description: 'School short name',
    required: false,
  })
  @Expose()
  shortName?: string;

  @ApiProperty({ example: 1, description: 'School type' })
  @Expose()
  type: number;

  @ApiProperty({
    example: '123 Nguyễn Trãi, Phường Phúc Xá, TP. HN',
    description: 'Address',
    required: false,
  })
  @Expose()
  address?: string;

  @ApiProperty({ example: 1, description: 'Status' })
  @Expose()
  status: number;

  @ApiProperty({ example: 1, description: 'Daily schedule type' })
  @Expose()
  dailyScheduleType: number;

  @ApiProperty({
    example: false,
    description: 'Supports complementary education',
  })
  @Expose()
  canComplementaryEducation: boolean;

  @ApiProperty({ example: false, description: 'Is international school' })
  @Expose()
  isInternationalSchool: boolean;

  @ApiProperty({ example: false, description: 'Supports preschool education' })
  @Expose()
  canPreschool: boolean;

  @ApiProperty({ example: false, description: 'Supports primary education' })
  @Expose()
  canPrimarySchool: boolean;

  @ApiProperty({
    example: false,
    description: 'Supports lower secondary education',
  })
  @Expose()
  canLowerSecondarySchool: boolean;

  @ApiProperty({
    example: false,
    description: 'Supports upper secondary education',
  })
  @Expose()
  canUpperSecondarySchool: boolean;

  @ApiProperty({
    example: 'contact@thoa.edu.vn',
    description: 'Email',
    required: false,
  })
  @Expose()
  email?: string;

  @ApiProperty({
    example: 'https://www.thoa.edu.vn',
    description: 'Website',
    required: false,
  })
  @Expose()
  website?: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Hotline',
    required: false,
  })
  @Expose()
  hotline?: string;

  @ApiProperty({
    example: 'Hùng',
    description: 'Principal first name',
    required: false,
  })
  @Expose()
  principalFirstName?: string;

  @ApiProperty({
    example: 'Trần',
    description: 'Principal last name',
    required: false,
  })
  @Expose()
  principalLastName?: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Principal phone',
    required: false,
  })
  @Expose()
  principalPhone?: string;

  @ApiProperty({ example: 1, description: 'Province ID' })
  @Expose()
  provinceId?: number | null;

  @Expose()
  @Transform(({ obj }) => {
    try {
      console.log('provinceTitle transform - obj.province:', obj?.province);
      const a = obj?.province?.title ?? null;
      console.log(a);

      return obj?.province?.title ?? null;
    } catch (error) {
      console.error('Error in provinceTitle transform:', error, obj);
      return null;
    }
  })
  provinceTitle?: string | null;

  @Expose()
  @Transform(({ obj }) => {
    try {
      console.log('wardTitle transform - obj.ward:', obj?.ward);
      return obj?.ward?.title ?? null;
    } catch (error) {
      console.error('Error in wardTitle transform:', error, obj);
      return null;
    }
  })
  wardTitle?: string | null;

  // @Expose()
  // @Transform(({ obj }) => {
  //   try {
  //     console.log('schoolCampuses transform - obj.schoolCampuses:',);
  //     return Array.isArray(obj?.schoolCampuses) ? obj.schoolCampuses.map((campus: any) => ({
  //       ...campus,
  //       totalArea: Decimal(campus.totalArea) ?? 0,
  //     })) : [];
  //   } catch (error) {
  //     console.error('Error in schoolCampuses transform:', error, obj);
  //     return [];
  //   }
  // })
  // schoolCampuses: SchoolCampus[];

  @ApiProperty({ example: 4, description: 'Ward ID', required: false })
  @Expose()
  wardId?: number | null;

  @ApiProperty({ example: false, description: 'Date founded school' })
  @Transform(({ obj }) => obj?.dateFounded ?? null)
  dateFounded?: string | null;

  @ApiProperty({ example: false, description: 'ranking of the school' })
  @Expose()
  @Transform(({ obj }) => obj?.ranking ?? null)
  ranking?: number | null;

  @ApiProperty({ example: false, description: 'Fax of the school' })
  @Expose()
  @Transform(({ obj }) => obj?.fax ?? null)
  fax?: string | null;

  @ApiProperty({ example: false, description: 'Email of the principal' })
  @Expose()
  @Transform(({ obj }) => {
    return obj?.principalEmail ?? null;
  })
  principalEmail?: string | null;

  @ApiProperty({ example: false, description: 'Is principal is party member' })
  @Expose()
  principalIsPartyMember: boolean;

  @Expose()
  @Transform(({ obj }) => {
    return obj?.schoolOperation ?? null;
  })
  schoolOperation?: SchoolOperation | null;

  @Expose()
  @Transform(({ obj }) => obj?.schoolFacility ?? null)
  schoolFacility?: SchoolFacility | null;

  @ApiProperty({
    example: '2025-08-12T07:51:56.296Z',
    description: 'Creation date',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-12T07:51:56.296Z',
    description: 'Update date',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Created by user ID' })
  @Expose()
  createdBy: number;

  @ApiProperty({ example: 1, description: 'Updated by user ID' })
  @Expose()
  updatedBy: number;
}

export class SchoolResponseWrapperDto {
  @ApiProperty({ type: SchoolResponseDto })
  @Type(() => SchoolResponseDto)
  response: SchoolResponseDto;
}
