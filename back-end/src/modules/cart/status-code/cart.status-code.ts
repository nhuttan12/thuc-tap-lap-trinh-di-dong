/**
 * @description Cart status code
 * @author Nhut Tan
 * @since 2025-09-25
 * @version 1.0.0
 */

import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code'
import { HttpStatus } from '@nestjs/common'

export class CartStatusCode extends BaseStatusCode {
	static readonly CART_NOT_FOUND: CartStatusCode = new CartStatusCode(
		HttpStatus.NOT_FOUND,
		'CART_001',
		'Cart not found'
	)
	static readonly PRODUCT_ID_MUST_BE_INTEGER: CartStatusCode =
		new CartStatusCode(
			HttpStatus.BAD_REQUEST,
			'CART_002',
			'Product ID must be integer'
		)
	static readonly PRODUCT_ID_MUST_NOT_BE_EMPTY: CartStatusCode =
		new CartStatusCode(
			HttpStatus.BAD_REQUEST,
			'CART_003',
			'Product ID must not be empty'
		)
	static readonly PRODUCT_ID_MUST_BE_A_POSITIVE_NUMBER: CartStatusCode =
		new CartStatusCode(
			HttpStatus.BAD_REQUEST,
			'CART_004',
			'Product ID must be a positive number'
		)
	static readonly QUANTITY_MUST_BE_INTEGER: CartStatusCode =
		new CartStatusCode(
			HttpStatus.BAD_REQUEST,
			'CART_005',
			'Quantity must be integer'
		)
	static readonly QUANTITY_MUST_NOT_BE_EMPTY: CartStatusCode =
		new CartStatusCode(
			HttpStatus.BAD_REQUEST,
			'CART_006',
			'Quantity must not be empty'
		)
	static readonly QUANTITY_MUST_BE_A_POSITIVE_NUMBER: CartStatusCode =
		new CartStatusCode(
			HttpStatus.BAD_REQUEST,
			'CART_007',
			'Quantity must be a positive number'
		)
	static readonly ADD_PRODUCT_TO_CART_SUCCESS: CartStatusCode =
		new CartStatusCode(
			HttpStatus.OK,
			'CART_008',
			'Add product to cart success'
		)
}
