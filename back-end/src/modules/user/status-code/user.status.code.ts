/*
 * @description: user status code
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { HttpStatus } from '@nestjs/common';

export class UserStatusCode {
  static readonly USER_NOT_FOUND: UserStatusCode = new UserStatusCode(
    HttpStatus.NOT_FOUND,
    'USR_001',
  );
  static readonly USER_BANNED: UserStatusCode = new UserStatusCode(
    HttpStatus.FORBIDDEN,
    'USR_002',
  );
  static readonly USERNAME_NOT_STRING: UserStatusCode = new UserStatusCode(
    HttpStatus.BAD_REQUEST,
    'USR_003',
  );
  static readonly USERNAME_NOT_EMPTY: UserStatusCode = new UserStatusCode(
    HttpStatus.BAD_REQUEST,
    'USR_003',
  );

  public constructor(
    public readonly statusCode: number,
    public readonly customCode: string,
  ) {}
}
