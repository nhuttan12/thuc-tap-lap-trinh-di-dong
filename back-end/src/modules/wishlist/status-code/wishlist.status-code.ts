/**
 * @description wishlist status code
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';
import { HttpStatus } from '@nestjs/common';

export class WishlistStatusCode extends BaseStatusCode {
  static readonly WishlistItemNotFound: WishlistStatusCode =
    new WishlistStatusCode(
      HttpStatus.NOT_FOUND,
      'WLI_001',
      'Wishlist item not found',
    );
  static readonly ProductAlreadyInWishlist: WishlistStatusCode =
    new WishlistStatusCode(
      HttpStatus.CONFLICT,
      'WLI_002',
      'Product already in wishlist',
    );
  static readonly AddProductToWishlistFailed: WishlistStatusCode =
    new WishlistStatusCode(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'WLI_003',
      'Add product to wishlist failed',
    );
  static readonly GetProductsInWishlistSuccess: WishlistStatusCode =
    new WishlistStatusCode(
      HttpStatus.OK,
      'WLI_004',
      'Get products in wishlist successfully',
    );
}
