import {
  Curriculum,
  Subject,
} from '@gedu/prisma';
import { PickType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class CurriculumSubjectResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.subjectId ?? obj.id)
  subjectId: number;

  @Expose()
  @Transform(({ obj }) => obj.id ?? obj.subjectId)
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.gradeLevel)
  gradeLevel: number;

  @Expose()
  @Transform(({ obj }) => obj.type)
  type: number;

  @Expose()
  @Transform(({ obj }) => obj.subject?.name ?? obj.name)
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.subject?.code ?? obj.code)
  code: string;

  @Expose()
  @Transform(({ obj }) => obj.subject ?? {
    id: obj.subjectId ?? obj.id,
    name: obj.name,
    code: obj.code,
  })
  subject: Subject;

  @Transform(({ obj }) => obj.gradeLevels)
  gradeLevels: number[];

  @Exclude()
  curriculum: Curriculum;
}

export class CurriculumResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.gradeLevels.map((gradeLevel: any) => gradeLevel.gradeLevel))
  gradeLevels: number[];

  @Exclude()
  subjects: Subject[];

  @Expose()
  @Transform(({ obj }) => obj.instructionLanguage.name)
  instructionLanguageName: string;

  @Exclude()
  instructionLanguage: number;
}

export class GetListCurriculumsResponseDto extends PickType(
  CurriculumResponseDto,
  ['gradeLevels', 'instructionLanguageName'],
) {}
