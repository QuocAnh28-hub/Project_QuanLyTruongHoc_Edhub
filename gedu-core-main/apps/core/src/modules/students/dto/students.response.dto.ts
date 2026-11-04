import { Expose, Transform, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentContactsResponseDto {
  @Expose()
  @Transform(({ obj }) => {
    return obj.relationship;
  })
  relationship: number;

  @Expose()
  @Transform(({ obj }) => {
    return obj.status;
  })
  status: number;
}

export class UpdateStudentPoliciesResponseDto {
  @Expose()
  @Transform(({ obj }) => {
    return obj.admissionType;
  })
  admissionType: number;

  @Expose()
  @Transform(({ obj }) => {
    return obj.gradeLevel;
  })
  gradeLevel: number;

  @Expose()
  @Transform(({ obj }) => {
    return obj.status;
  })
  status: number;

  @Expose()
  @Transform(({ obj }) => {
    const classNames = obj.studentClasses?.map((c: any) => c.class.name) || [];
    return classNames.length > 0 ? classNames : null;
  })
  studentClasses: number[] | null;
}

export class ClassDto {
  @ApiProperty({ example: 2 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Lớp 1A' })
  @Expose()
  name: string;

  @ApiProperty({ example: 1 })
  @Expose()
  gradeLevel: number;
}

export class StudentContactDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 4 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'An' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Nguyễn' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: 1 })
  @Expose()
  relationship: number;

  @ApiProperty({ example: 'Bố ruột' })
  @Expose()
  relationshipTitle: string;

  @ApiProperty({ example: 2 })
  @Expose()
  status: number;

  @ApiProperty({ example: true })
  @Expose()
  grantAccess: boolean;

  @ApiProperty({ example: 'Công nhân' })
  @Expose()
  occupation: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  @Expose()
  dateOfBirth: string;

  @ApiProperty({ example: '1223456789' })
  @Expose()
  citizenId: string;

  @ApiProperty({ example: '0901234567' })
  @Expose()
  phone: string;

  @ApiProperty({ example: 'string' })
  @Expose()
  email: string;
}

export class StudentMedicalInfoDto {
  @ApiProperty({ example: 3 })
  @Expose()
  id: number;

  @ApiProperty({ example: 2 })
  @Expose()
  group: number;

  @ApiProperty({ example: 2 })
  @Expose()
  type: number;

  @ApiProperty({ example: 'Tiêm ngừa đầy đủ' })
  @Expose()
  info: string;
}

export class StudentResponseDto {
  @ApiProperty({ example: 1000001 })
  @Expose()
  id: number;

  @ApiProperty({ example: 3 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'HS12345' })
  @Expose()
  code: string;

  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: null })
  @Expose()
  avatar: string | null;

  @ApiProperty({ example: 1 })
  @Expose()
  sex: number;

  @ApiProperty({ example: 'An' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Nguyễn' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: '123456789' })
  @Expose()
  citizenId: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  @Expose()
  dateOfBirth: string;

  @ApiProperty({ example: '123 Lê Lợi, TP.HCM' })
  @Expose()
  permanentResidenceAddress: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, TP.HCM' })
  @Expose()
  temporaryResidenceAddress: string;

  @ApiProperty({ example: 'Phật giáo' })
  @Expose()
  religionTitle: string;

  @ApiProperty({ example: 'Kinh' })
  @Expose()
  ethnicityTitle: string;

  @ApiProperty({ example: 'Việt Nam' })
  @Expose()
  nationalityTitle: string;

  @ApiProperty({ example: 1 })
  @Expose()
  gradeLevel: number;

  @ApiProperty({ type: () => ClassDto })
  @Expose()
  @Type(() => ClassDto)
  class: ClassDto;

  @ApiProperty({ example: 2 })
  @Expose()
  classId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  mainContactId: number;

  @ApiProperty({ type: () => StudentContactDto })
  @Expose()
  @Type(() => StudentContactDto)
  mainStudentContact: StudentContactDto;

  @ApiProperty({ type: () => [StudentContactDto] })
  @Expose()
  @Type(() => StudentContactDto)
  studentContacts: StudentContactDto[];

  @ApiProperty({ type: () => [StudentMedicalInfoDto] })
  @Expose()
  @Type(() => StudentMedicalInfoDto)
  studentMedicalInfo: StudentMedicalInfoDto[];

  @ApiProperty({ example: 0 })
  @Expose()
  documents: number;
}

export class GetStudentByIdResponse {
  @ApiProperty({ type: () => StudentResponseDto })
  @Expose()
  response: StudentResponseDto;
}
