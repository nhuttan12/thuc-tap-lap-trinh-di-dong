/**
 * @description Dto request for remove product from cart
 * @author Nhut Tan
 * @since 2026-01-09
 * @version 1.0.0
 */

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { CartStatusCode } from '../status-code/cart.status-code';

export class RemoveProductFromCartRequestDto {
	@Type(() => Number)
	@IsInt({ message: CartStatusCode.PRODUCT_ID_MUST_BE_INTEGER.customCode })
	@IsNotEmpty({
		message: CartStatusCode.PRODUCT_ID_MUST_NOT_BE_EMPTY.customCode,
	})
	@Min(1, {
		message: CartStatusCode.PRODUCT_ID_MUST_BE_A_POSITIVE_NUMBER.customCode,
	})
	cartDetailID: number;
}
