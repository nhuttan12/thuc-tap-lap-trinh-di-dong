/**
 * @description User sign up request dto
 * @author Nhut Tan
 * @since 2025-09-17
 * @version 1.0.0
 */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  NotContains,
} from '@nestjs/class-validator';
import { AuthStatusCode } from '../status-code/auth.status-code';

export class UserSignUpRequestDto {
  @IsString({ message: AuthStatusCode.USERNAME_MUST_BE_STRING.customCode })
  @NotContains(' ', {
    message: AuthStatusCode.USERNAME_NOT_CONTAINS_SPACE.customCode,
  })
  @IsNotEmpty({ message: AuthStatusCode.USERNAME_NOT_EMPTY.customCode })
  username: string;

  @IsEmail({}, { message: AuthStatusCode.EMAIL_IS_NOT_VALID.customCode })
  @IsNotEmpty({ message: AuthStatusCode.EMAIL_MUST_NOT_BE_EMPTY.customCode })
  email: string;

  @IsNotEmpty({ message: AuthStatusCode.PASSWORD_NOT_EMPTY.customCode })
  password: string;

  @IsNotEmpty({ message: AuthStatusCode.RETYPE_PASSWORD_NOT_EMPTY.customCode })
  retypePassword: string;
}
