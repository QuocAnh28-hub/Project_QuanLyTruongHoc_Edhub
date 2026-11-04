import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";
import {AppValidationException} from "@gedu/shared/errors";

export class LoginDto {
  @ApiProperty({ example: "admin@eduhub.com", description: "Tên đăng nhập" })
  @IsString({ message: AppValidationException.INVALID_ACCOUNT })
  email: string;

  @ApiProperty({ example: "admin123", description: "Mật khẩu" })
  @IsString({ message: AppValidationException.INVALID_PASSWORD })
  password: string;
}
