import { Class, Curriculum, Student, StudentClass, User } from '@gedu/prisma';
import { Exclude, Expose, Transform } from 'class-transformer';

export class GetClassesResponseDto {
  @Expose()
  gradeLevel: number | null;

  @Expose()
  @Transform(({ obj }) => (obj.studentClasses ? obj.studentClasses.length : 0))
  classSize: number;

  @Expose()
  @Transform(({ obj }) => obj.curriculum?.name ?? null)
  curriculumName: string | null;

  @Expose()
  @Transform(({ obj }) => {
    const teacher = obj?.homeroomTeacher;
    if (!teacher) return null;
    return {
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      avatar: teacher.user.avatar ?? null,
    };
  })
  homeroomTeacher: Pick<User, 'firstName' | 'lastName' | 'avatar'> | null;

  @Exclude()
  studentClasses: StudentClass[];
}

export class GetClassDetailResponseDto {
  @Expose()
  gradeLevel: number | null;

  @Expose()
  dailyScheduleType: number;

  @Expose()
  @Transform(({ obj }) => obj?.curriculum?.name ?? null)
  curriculumName: string | null;

  @Expose()
  @Transform(({ obj }) => obj?.firstForeignLanguage?.name ?? null)
  firstForeignLanguageName: string | null;

  @Expose()
  @Transform(({ obj }) => obj?.secondForeignLanguage?.name ?? null)
  secondForeignLanguageName: string | null;

  @Expose()
  estimatedLessonsPerWeek: number | null;

  @Exclude()
  curriculum: Curriculum;

  @Expose()
  @Transform(({ obj }) => {
    const teacher = obj?.homeroomTeacher;
    if (!teacher) return null;
    return {
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      avatar: teacher.user.avatar ?? null,
    };
  })
  homeroomTeacher: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;

  @Expose()
  @Transform(
    ({ obj }) =>
      obj?._count?.studentClasses ?? obj?.studentClasses?.length ?? null,
  )
  classSize: number | null;

  @Exclude()
  studentClasses: StudentClass[];

  @Exclude()
  _count: { studentClasses: number };
}

export class GetStudentByClassIdResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.student?.id ?? null)
  id: number | null;

  @Expose()
  @Transform(({ obj }) => obj.class?.gradeLevel ?? null)
  gradeLevel: number | null;

  @Expose()
  @Transform(({ obj }) => obj.class?.code ?? null)
  code: string | null;

  @Expose()
  @Transform(({ obj }) => obj.class?.name ?? null)
  name: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.status ?? null)
  status: number | null;

  @Expose()
  @Transform(({ obj }) => obj.class?.maxClassSize ?? null)
  maxClassSize: number | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.firstName ?? null)
  firstName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.user?.lastName ?? null)
  lastName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.code ?? null)
  studentCode: string | null;

  @Expose()
  @Transform(
    ({ obj }) => obj.student?.mainStudentContact?.user?.firstName ?? null,
  )
  mainStudentContactFirstName: string | null;

  @Expose()
  @Transform(
    ({ obj }) => obj.student?.mainStudentContact?.user?.lastName ?? null,
  )
  mainStudentContactLastName: string | null;

  @Expose()
  @Transform(({ obj }) => obj.student?.mainStudentContact?.user?.phone ?? null)
  mainStudentContactPhone: string | null;

  @Exclude()
  student: Student | null;

  @Exclude()
  class: Class | null;

  @Exclude()
  studentId: number | null;
}
