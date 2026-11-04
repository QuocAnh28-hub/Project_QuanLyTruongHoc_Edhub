import { Expose, Transform, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { STUDENT_CLASS_STATUS } from '@gedu/shared';

const findActiveStudentClass = (
  obj: {
    student?: {
      studentClasses?: Array<{
        status: number;
        classId?: number;
        class?: { name?: string; gradeLevel?: number | null };
      }>;
    };
  },
) =>
  obj.student?.studentClasses?.find(
    (c) => c.status === STUDENT_CLASS_STATUS.ACTIVE,
  );
export class GetStudentByContactIdResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.student?.id ?? null)
  id: number | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.status ?? null)
  status: number | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.personal?.firstName ?? null)
  firstName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.personal?.lastName ?? null)
  lastName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.personal?.citizenId ?? null)
  citizenId: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.code ?? null)
  code: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.personal?.dateOfBirth ?? null)
  dateOfBirth: Date | null;

  @Expose()
  @Transform(
    ({ obj }) => obj.student?.user?.personal?.permanentResidenceAddress ?? null,
  )
  permanentResidenceAddress: string | null;

  @Expose()
  @Transform(
    ({ obj }) => obj.student?.user?.personal?.temporaryResidenceAddress ?? null,
  )
  temporaryResidenceAddress: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.personal?.sex ?? null)
  sex: number | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.personal?.religionId ?? null)
  religionId: number | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.school?.id ?? null)
  schoolId: number | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.school?.name ?? null)
  schoolName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.confirmedBy?.firstName ?? null)
  confirmedByFirstName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.confirmedBy?.lastName ?? null)
  confirmedByLastName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.confirmedBy?.id ?? null)
  confirmedById: number | null;

  @Expose()
  @Transform(({ obj }) => findActiveStudentClass(obj)?.class?.name ?? null)
  className: string | null;

  @Expose()
  @Transform(
    ({ obj }) => findActiveStudentClass(obj)?.class?.gradeLevel ?? null,
  )
  gradeLevel: number | null;

  @Expose()
  @Transform(({ obj }) => findActiveStudentClass(obj)?.status ?? null)
  classStatus: number | null;

  @Expose()
  @Transform(({ obj }) => findActiveStudentClass(obj)?.classId ?? null)
  classId: number | null;

  @Expose()
  @Transform(({ obj }) => {
    const active = findActiveStudentClass(obj);
    if (!active) return null;
    return {
      id: active.classId,
      name: active.class?.name ?? null,
      gradeLevel: active.class?.gradeLevel ?? null,
      status: active.status ?? null,
    };
  })
  class: {
    id: number | null;
    name: string | null;
    gradeLevel: number | null;
    status: number | null;
  } | null;
}

export class ContactStudentResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: 'An' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Nguyễn' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: '123456789' })
  @Expose()
  citizenId: string;

  @ApiProperty({ example: 'HS12345' })
  @Expose()
  code: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  @Expose()
  dateOfBirth: Date;

  @ApiProperty({ example: '123 Lê Lợi, TP.HCM' })
  @Expose()
  permanentResidenceAddress: string;

  @ApiProperty({ example: '123 Nguyễn Huệ, TP.HCM' })
  @Expose()
  temporaryResidenceAddress: string;

  @ApiProperty({ example: 1 })
  @Expose()
  sex: number;

  @ApiProperty({ example: 1 })
  @Expose()
  religionId: number;

  @ApiProperty({ example: 100001 })
  @Expose()
  schoolId: number;

  @ApiProperty({ example: 'Trường THPT Nguyễn Trãi 001' })
  @Expose()
  schoolName: string;

  @ApiProperty({ example: 'An' })
  @Expose()
  confirmedByFirstName: string;

  @ApiProperty({ example: 'Nguyễn' })
  @Expose()
  confirmedByLastName: string;

  @ApiProperty({ example: 4 })
  @Expose()
  confirmedById: number;

  @ApiProperty({ example: 'Lớp 1A' })
  @Expose()
  className: string;

  @ApiProperty({ example: 1 })
  @Expose()
  gradeLevel: number;

  @ApiProperty({ example: 2 })
  @Expose()
  classStatus: number;

  @ApiProperty({ example: 2 })
  @Expose()
  classId: number;
}

export class ContactStudentListResponseDto {
  @ApiProperty({
    type: [ContactStudentResponseDto],
    example: [
      {
        status: 1,
        firstName: 'An',
        lastName: 'Nguyễn',
        citizenId: '123456789',
        code: 'HS12345',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        permanentResidenceAddress: '123 Lê Lợi, TP.HCM',
        temporaryResidenceAddress: '123 Nguyễn Huệ, TP.HCM',
        sex: 1,
        religionId: 1,
        schoolId: 100001,
        schoolName: 'Trường THPT Nguyễn Trãi 001',
        confirmedByFirstName: 'An',
        confirmedByLastName: 'Nguyễn',
        confirmedById: 4,
        className: 'Lớp 1A',
        gradeLevel: 1,
        classStatus: 2,
        classId: 2,
      },
    ],
  })
  @Type(() => ContactStudentResponseDto)
  response: ContactStudentResponseDto[];
}
