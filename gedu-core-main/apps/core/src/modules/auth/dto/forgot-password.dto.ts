import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email người dùng',
    example: 'teacher@example.com',
  })
  @IsEmail()
  email: string;
}
