/**
 * @description auth status code
 * @author Nhut Tan
 * @date 2025-09-13
 * @modifies 2025-09-24
 * @version 1.0.1
 */

import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';
import { HttpStatus } from '@nestjs/common';

export class AuthStatusCode extends BaseStatusCode {
  static readonly USERNAME_MUST_BE_STRING: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'ATH_003',
    'Username must be a string',
  );
  static readonly USERNAME_NOT_EMPTY: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'ATH_003',
    'Username must not be empty',
  );
  static readonly PASSWORD_NOT_EMPTY: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'ATH_003',
    'Password must not be empty',
  );
  static readonly USERNAME_NOT_CONTAINS_SPACE: AuthStatusCode =
    new AuthStatusCode(
      HttpStatus.BAD_REQUEST,
      'ATH_004',
      'Username must not contain space',
    );
  static readonly EMAIL_ALREADY_EXISTS: AuthStatusCode = new AuthStatusCode(
    HttpStatus.CONFLICT,
    'ATH_005',
    'Email already exists',
  );
  static readonly PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME: AuthStatusCode =
    new AuthStatusCode(
      HttpStatus.BAD_REQUEST,
      'ATH_006',
      'Password and retype password are not the same',
    );
  static readonly EMAIL_IS_NOT_VALID: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'ATH_007',
    'Email is not valid',
  );
  static readonly EMAIL_MUST_NOT_BE_EMPTY: AuthStatusCode = new AuthStatusCode(
    HttpStatus.BAD_REQUEST,
    'ATH_008',
    'Email must not be empty',
  );
  static readonly RETYPE_PASSWORD_NOT_EMPTY: AuthStatusCode =
    new AuthStatusCode(
      HttpStatus.BAD_REQUEST,
      'ATH_009',
      'Retype password must not be empty',
    );
  static readonly USER_ALREADY_EXISTS: AuthStatusCode = new AuthStatusCode(
    HttpStatus.CONFLICT,
    'ATH_010',
    'User already exists',
  );
}
