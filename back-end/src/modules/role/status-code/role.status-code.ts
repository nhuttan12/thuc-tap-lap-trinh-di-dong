/*
 * @description: role status code
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

import { HttpStatus } from '@nestjs/common';
import { BaseStatusCode } from '../../../common/status-code/base.status-code';

export class RoleStatusCode extends BaseStatusCode {
  static readonly ROLE_NOT_FOUND: RoleStatusCode = new RoleStatusCode(
    HttpStatus.NOT_FOUND,
    'ROLE_001',
    'Role not found',
  );
  static readonly ROLE_NOT_STRING: RoleStatusCode = new RoleStatusCode(
    HttpStatus.BAD_REQUEST,
    'ROLE_003',
    'Role must be a string',
  );
  static readonly ROLE_NOT_EMPTY: RoleStatusCode = new RoleStatusCode(
    HttpStatus.BAD_REQUEST,
    'ROLE_003',
    'Role must not be empty',
  );
}
