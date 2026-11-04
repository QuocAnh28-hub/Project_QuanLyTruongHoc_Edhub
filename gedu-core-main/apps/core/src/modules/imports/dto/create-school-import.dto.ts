import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {AppValidationException} from "@gedu/shared/errors";

export class CreateBaseImportDto {
  @ApiProperty({
    description: "File path",
    example: "https://static.lazeout.com/private/object-name.csv",
  })
  @IsString({ message: AppValidationException.INVALID_FILE_PATH })
  @IsNotEmpty({ message: AppValidationException.MISSING_FILE_PATH })
  filePath: string;
}
export class CreateSchoolImportDto extends CreateBaseImportDto {}

export class CreateStaffImportDto extends CreateBaseImportDto {}
