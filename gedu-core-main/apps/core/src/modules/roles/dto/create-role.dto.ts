import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { AppValidationException } from '@gedu/shared/errors';

export class CreateRoleDto {
  @ApiProperty({ description: 'Name of the role' })
  @IsString({message: AppValidationException.INVALID_ROLE_NAME})
  @IsNotEmpty({message: AppValidationException.MISSING_ROLE_NAME})
  name: string;

  @ApiProperty({ description: 'Description of the role' })
  @IsString({message: AppValidationException.INVALID_ROLE_DESCRIPTION})
  @IsNotEmpty({message: AppValidationException.MISSING_ROLE_DESCRIPTION})
  description: string;
} 