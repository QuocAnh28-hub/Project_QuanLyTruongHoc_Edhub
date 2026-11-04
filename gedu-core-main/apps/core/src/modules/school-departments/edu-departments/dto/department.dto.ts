// department.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ban Giám đốc' })
  name: string;

  @ApiProperty({ example: 'BGD' })
  code: string;

  @ApiProperty({ example: null, nullable: true })
  parentId: number | null;
}

export class GetDepartmentsResponseDto {
  @ApiProperty({
    type: DepartmentDto,
    isArray: true,
    example: [
      {
        id: 1,
        name: 'Ban Giám đốc',
        code: 'BGD',
        parentId: null,
      },
      {
        id: 2,
        name: 'Phòng Hành chính',
        code: 'HC',
        parentId: 1,
      },
    ],
  })
  response: DepartmentDto[];
}

export class DepartmentStaffCountDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: null, nullable: true })
  parentId: number | null;

  @ApiProperty({ example: 0 })
  count: number;
}

export class CountStaffByDepartmentResponseDto {
  @ApiProperty({
    type: [DepartmentStaffCountDto],
    example: [
      { id: 1, parentId: null, count: 0 },
      { id: 2, parentId: null, count: 0 },
    ],
  })
  response: DepartmentStaffCountDto[];
}
