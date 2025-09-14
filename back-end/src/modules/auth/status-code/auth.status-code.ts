/*
 * @description: auth status code
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

import { BaseStatusCode } from '../../../common/status-code/base.status-code';
import { HttpStatus } from '@nestjs/common';

export class AuthStatusCode extends BaseStatusCode {
  static readonly USERNAME_MUST_BE_STRING: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'AUTH_003',
    'Username must be a string',
  );
  static readonly USERNAME_NOT_EMPTY: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'AUTH_003',
    'Username must not be empty',
  );
  static readonly PASSWORD_NOT_EMPTY: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'AUTH_003',
    'Password must not be empty',
  );
  static readonly USERNAME_NOT_CONTAINS_SPACE: AuthStatusCode =
    new AuthStatusCode(
      HttpStatus.BAD_REQUEST,
      'AUTH_004',
      'Username must not contain space',
    );
}
