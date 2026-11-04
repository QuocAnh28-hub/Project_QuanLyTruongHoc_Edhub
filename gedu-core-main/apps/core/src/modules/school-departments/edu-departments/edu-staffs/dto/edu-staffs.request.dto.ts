import { safeParseIdList, SearchDto } from "@gedu/shared";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";


export class GetEduStaffDto extends PartialType(SearchDto) {
  @ApiProperty({ example: 1, description: 'ID phòng ban', required: false })
  @Transform(safeParseIdList())
  @IsOptional()
  dept?: number[];

  @ApiProperty({ example: 1, description: 'ID vị trí', required: false })
  @Transform(safeParseIdList())
  @IsOptional()
  pos?: number[];
}
