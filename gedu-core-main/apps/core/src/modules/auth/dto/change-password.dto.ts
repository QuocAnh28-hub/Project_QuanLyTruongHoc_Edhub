import { IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { AppValidationException } from '@gedu/shared';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'NewSecure1!',
    description:
      'Must be at least 8 characters long and include at least one uppercase letter, one number, and one special character',
  })
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: AppValidationException.INVALID_PASSWORD_FORMAT,
  })
  newPassword: string;
}
