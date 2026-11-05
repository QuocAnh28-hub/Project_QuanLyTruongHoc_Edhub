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
  @Transform(({ obj }) => {
    const raw = obj.subject?.name ?? obj.name;
    if (raw && raw !== 'Môn học') return raw;
    const stdNames: Record<number, string> = {
      1: 'Toán học', 2: 'Ngữ văn', 3: 'Tiếng Anh', 4: 'Vật lí',
      5: 'Hóa học', 6: 'Sinh học', 7: 'Lịch sử', 8: 'Địa lí',
      9: 'Giáo dục kinh tế và pháp luật', 10: 'Tin học',
      11: 'Công nghệ', 12: 'Giáo dục thể chất', 13: 'GDQP-AN',
      14: 'Hoạt động trải nghiệm, hướng nghiệp'
    };
    const id = obj.subjectId ?? obj.id;
    return stdNames[id] || (raw || `Môn học ${id}`);
  })
  name: string;

  @Expose()
  @Transform(({ obj }) => {
    const raw = obj.subject?.code ?? obj.code;
    if (raw) return raw;
    const stdCodes: Record<number, string> = {
      1: 'TOAN', 2: 'VAN', 3: 'ANH', 4: 'VATLY',
      5: 'HOA', 6: 'SINH', 7: 'SU', 8: 'DIA',
      9: 'GDKTPL', 10: 'TIN', 11: 'CONGNGHE',
      12: 'GDTC', 13: 'GDQP', 14: 'HDTN'
    };
    const id = obj.subjectId ?? obj.id;
    return stdCodes[id] || '';
  })
  code: string;

  @Expose()
  @Transform(({ obj }) => {
    const s = obj.subject;
    const id = obj.subjectId ?? obj.id;
    const stdNames: Record<number, string> = {
      1: 'Toán học', 2: 'Ngữ văn', 3: 'Tiếng Anh', 4: 'Vật lí',
      5: 'Hóa học', 6: 'Sinh học', 7: 'Lịch sử', 8: 'Địa lí',
      9: 'Giáo dục kinh tế và pháp luật', 10: 'Tin học',
      11: 'Công nghệ', 12: 'Giáo dục thể chất', 13: 'GDQP-AN',
      14: 'Hoạt động trải nghiệm, hướng nghiệp'
    };
    const stdCodes: Record<number, string> = {
      1: 'TOAN', 2: 'VAN', 3: 'ANH', 4: 'VATLY',
      5: 'HOA', 6: 'SINH', 7: 'SU', 8: 'DIA',
      9: 'GDKTPL', 10: 'TIN', 11: 'CONGNGHE',
      12: 'GDTC', 13: 'GDQP', 14: 'HDTN'
    };
    return {
      id,
      name: s?.name && s.name !== 'Môn học' ? s.name : (stdNames[id] || s?.name || `Môn học ${id}`),
      code: s?.code ? s.code : (stdCodes[id] || ''),
    };
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
