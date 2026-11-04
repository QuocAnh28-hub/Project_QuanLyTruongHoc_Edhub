import { ApiProperty } from '@nestjs/swagger';

export class PositionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'GDS' })
  code: string;

  @ApiProperty({ example: 'Giám đốc Sở' })
  title: string;

  @ApiProperty({ example: 1 })
  departmentId: number;

  @ApiProperty({ example: 'Ban Giám đốc' })
  department: string;

  @ApiProperty({ example: 'Ban Giám đốc' })
  departmentName: string;

  @ApiProperty({ example: 0 })
  memberCount: number;
}

export class PaginatedPositionsDto {
  @ApiProperty({ type: [PositionDto] })
  data: PositionDto[];

  @ApiProperty({ example: 1 })
  current: number;

  @ApiProperty({ example: 10 })
  size: number;

  @ApiProperty({ example: 2 })
  total: number;
}

export class GetPositionsResponseDto {
  @ApiProperty({
    type: PaginatedPositionsDto,
    example: {
      data: [
        {
          id: 1,
          code: 'GDS',
          title: 'Giám đốc Sở',
          departmentId: 1,
          department: 'Ban Giám đốc',
          departmentName: 'Ban Giám đốc',
          memberCount: 0,
        },
        {
          id: 2,
          code: 'PGDS',
          title: 'Phó Giám đốc Sở',
          departmentId: 1,
          department: 'Ban Giám đốc',
          departmentName: 'Ban Giám đốc',
          memberCount: 0,
        },
      ],
      current: 1,
      size: 10,
      total: 2,
    },
  })
  response: PaginatedPositionsDto;
}
