import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSubjectRequestDto {
  @ApiPropertyOptional({
    description: 'Tên môn học',
    example: 'Toán học',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Danh sách ID khoa',
    example: [1, 2, 3],
  })
  @IsOptional()
  departments?: number[];
}
