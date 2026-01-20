/**
 * @description wishlist status code
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';
import { HttpStatus } from '@nestjs/common';

export class WishlistStatusCode extends BaseStatusCode {
	static readonly WISHLIST_ITEM_NOT_FOUND: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.NOT_FOUND,
			'WLI_001',
			'Wishlist item not found'
		);
	static readonly PRODUCT_ALREADY_IN_WISHLIST: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.CONFLICT,
			'WLI_002',
			'Product already in wishlist'
		);
	static readonly ADD_PRODUCT_TO_WISHLIST_FAILED: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.INTERNAL_SERVER_ERROR,
			'WLI_003',
			'Add product to wishlist failed'
		);
	static readonly GET_PRODUCTS_IN_WISHLIST_SUCCESS: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.OK,
			'WLI_004',
			'Get products in wishlist successfully'
		);
	static readonly ADD_PRODUCT_TO_WISHLIST_SUCCESS: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.OK,
			'WLI_005',
			'Add product to wishlist success'
		);
	static readonly REMOVE_WISHLIST_ITEM_SUCCESS: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.OK,
			'WLI_007',
			'Remove wishlist item success'
		);
	static readonly PRODUCT_ID_MUST_BE_INT: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.BAD_REQUEST,
			'WLI_008',
			'Product id must be integer'
		);
	static readonly PRODUCT_ID_IS_NOT_EMPTY: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.BAD_REQUEST,
			'WLI_009',
			'Product id is not empty'
		);
	static readonly REMOVE_WISHLIST_ITEM_FAILED: WishlistStatusCode =
		new WishlistStatusCode(
			HttpStatus.OK,
			'WLI_010',
			'Remove wishlist item failed'
		);
}
