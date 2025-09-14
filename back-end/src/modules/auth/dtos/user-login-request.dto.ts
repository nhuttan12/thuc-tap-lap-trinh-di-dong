/*
 * @description: user login request dto
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { IsNotEmpty, IsString, NotContains } from '@nestjs/class-validator';
import { AuthStatusCode } from '../status-code/auth.status-code';

export class UserLoginRequestDto {
  @IsString({ message: AuthStatusCode.USERNAME_MUST_BE_STRING.customCode })
  @IsNotEmpty({ message: AuthStatusCode.USERNAME_NOT_EMPTY.customCode })
  @NotContains(' ', {
    message: AuthStatusCode.USERNAME_NOT_CONTAINS_SPACE.customCode,
  })
  username: string;

  @IsNotEmpty({ message: AuthStatusCode.PASSWORD_NOT_EMPTY.customCode })
  password: string;
}
