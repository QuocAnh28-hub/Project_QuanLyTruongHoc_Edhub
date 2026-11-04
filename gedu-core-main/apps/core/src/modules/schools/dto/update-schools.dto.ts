import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

import { AppValidationException } from '@gedu/shared/errors';
import { CreateSchoolDto } from './create-schools.dto';

export class UpdateSchoolDto extends PartialType(
  OmitType(CreateSchoolDto, ['id'] as const),
) {
  @ApiProperty({ description: 'Email' })
  @IsOptional()
  @IsEmail({}, { message: AppValidationException.INVALID_EMAIL })
  email?: string;

  @ApiProperty({ description: 'Fax', example: '0123456789' })
  @IsOptional()
  fax?: string;

  @ApiProperty({ description: 'Project', example: 'Project A' })
  @IsOptional()
  project: string;

  @ApiProperty({ description: 'Ranking', example: 1 })
  @IsOptional()
  ranking: number;

  @ApiProperty({ description: 'Date founded', example: '2020-01-01' })
  @IsOptional()
  dateFounded: Date;

  @ApiProperty({ description: 'Principal is party member', example: true })
  @IsOptional()
  principalIsPartyMember: boolean;

  @ApiProperty({
    description: 'Principal email',
    example: 'project@example.com',
  })
  @IsOptional()
  principalEmail: string;
}
