/*
 * @description: Product status code
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

import { HttpStatus } from '@nestjs/common';
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';

export class ProductStatusCode extends BaseStatusCode {
  static readonly GET_PRODUCTS_PAGING_SUCCESS: ProductStatusCode =
    new ProductStatusCode(
      HttpStatus.OK,
      'PRD_001',
      'Get products paging successfully',
    );
}
