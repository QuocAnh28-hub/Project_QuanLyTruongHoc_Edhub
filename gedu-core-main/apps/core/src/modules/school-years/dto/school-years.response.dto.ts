import { Expose } from "class-transformer";

export class SchoolYearsResponseDto {
  @Expose()
  status: number;
}

export class ClassesResponseDto {
  @Expose()
  gradeLevel: number;
}
