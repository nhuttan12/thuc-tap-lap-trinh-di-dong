/**
 * @description Dto for add product to cart request
 * @author Nhut Tan
 * @since 2025-09-25
 * @version 1.0.0
 */
import { IsInt, IsNotEmpty, Min } from '@nestjs/class-validator'
import { CartStatusCode } from '../status-code/cart.status-code'

export class AddProductToCartRequestDto {
	@IsInt({ message: CartStatusCode.PRODUCT_ID_MUST_BE_INTEGER.customCode })
	@IsNotEmpty({
		message: CartStatusCode.PRODUCT_ID_MUST_NOT_BE_EMPTY.customCode,
	})
	@Min(1, {
		message: CartStatusCode.PRODUCT_ID_MUST_BE_A_POSITIVE_NUMBER.customCode,
	})
	productID: number

	@IsInt({ message: CartStatusCode.QUANTITY_MUST_BE_INTEGER.customCode })
	@IsNotEmpty({
		message: CartStatusCode.QUANTITY_MUST_NOT_BE_EMPTY.customCode,
	})
	@Min(1, {
		message: CartStatusCode.QUANTITY_MUST_BE_A_POSITIVE_NUMBER.customCode,
	})
	quantity: number
}
