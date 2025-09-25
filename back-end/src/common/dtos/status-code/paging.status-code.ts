/**
 * @description Paging status code
 * @author Nhut Tan
 * @since 2025-09-13
 * @modifies 2025-09-24
 * @version 1.0.2
 */

import { BaseStatusCode } from './base.status-code';
import { HttpStatus } from '@nestjs/common';

export class PagingStatusCode extends BaseStatusCode {
  static readonly PAGE_NUMBER_MUST_BE_POSITIVE: PagingStatusCode =
    new PagingStatusCode(
      HttpStatus.BAD_REQUEST,
      'PGE_001',
      'Page number must be positive',
    );
  static readonly PAGE_NUMBER_MUST_NOT_BE_EMPTY: PagingStatusCode =
    new PagingStatusCode(
      HttpStatus.BAD_REQUEST,
      'PGE_002',
      'Page number must not be empty',
    );
  static readonly PAGE_NUMBER_MUST_BE_A_NUMBER: PagingStatusCode =
    new PagingStatusCode(
      HttpStatus.BAD_REQUEST,
      'PGE_003',
      'Page number must be a number',
    );
  static readonly LIMIT_NUMBER_MUST_BE_A_NUMBER: PagingStatusCode =
    new PagingStatusCode(
      HttpStatus.BAD_REQUEST,
      'LMT_001',
      'Limit number must be a number',
    );
  static readonly LIMIT_NUMBER_MUST_NOT_BE_EMPTY: PagingStatusCode =
    new PagingStatusCode(
      HttpStatus.BAD_REQUEST,
      'LMT_002',
      'Limit number must not be empty',
    );
}
