/*
 * @description: user login request dto
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { UserStatusCode } from '../../user/status-code/user.status.code';

export class UserLoginRequestDto {
  @IsString({ message: UserStatusCode.USERNAME_NOT_STRING.customCode })
  @IsNotEmpty({ message: UserStatusCode.USERNAME_NOT_EMPTY.customCode })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
