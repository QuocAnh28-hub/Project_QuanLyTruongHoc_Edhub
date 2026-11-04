export class DepartmentResponseDto {
  id: number;
  name: string;
  code: string;
}

export class SubjectResponseDto {
  id: number;
  code: string;
  name: string;
  orgId: number;
  canApply: boolean;
  departments: DepartmentResponseDto[];
}
