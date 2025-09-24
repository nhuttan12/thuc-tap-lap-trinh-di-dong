/*
 * @description Product status code
 * @author Nhut Tan
 * @since 2025-09-13
 * @version 1.0.0
 */

import { HttpStatus } from '@nestjs/common';
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';

export class ProductStatusCode extends BaseStatusCode {
  static readonly GET_PRODUCTS_PAGING_SUCCESS: ProductStatusCode =
    new ProductStatusCode(
      HttpStatus.OK,
      'PRD_001',
      'Get products paging successfully',
    );
  static readonly PRODUCT_ID_MUST_BE_AN_INTEGER: ProductStatusCode =
    new ProductStatusCode(
      HttpStatus.OK,
      'PRD_002',
      'Product ID must be an integer',
    );
}
