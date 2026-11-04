import { GRADE_LEVEL } from '@gedu/shared/enums';
import { Expose, Transform } from 'class-transformer';

export class GetCurriculumResponseDto {
  @Expose()
  @Transform(({ obj }) =>
    Array.isArray(obj.gradeLevels)
      ? obj.gradeLevels.map((gl: { gradeLevel: any }) =>
          Number(gl.gradeLevel),
        )
      : [],
  )
  gradeLevels: number[];
}
