/**
 * @description: Validate status code
 * @author: Nhut Tan
 * @date: 2025-09-22
 * @version: 1.0.0
 */

import { BaseStatusCode } from './base.status-code';
import { HttpStatus } from '@nestjs/common';

export class ValidateStatusCode extends BaseStatusCode {
  static readonly TextMustNotContainUrl: ValidateStatusCode =
    new ValidateStatusCode(
      HttpStatus.BAD_REQUEST,
      'VAL_001',
      'Text must not contains url',
    );
}