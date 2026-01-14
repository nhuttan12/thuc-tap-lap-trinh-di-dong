/**
 * @description Add product to wishlist request dto
 * @author @nhuttan12
 * @since 2025-01-11
 * @version 1.0.0
 */
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { WishlistStatusCode } from '../status-code/wishlist.status-code';

export class RemoveProductFromWishlistDto {
	@Type(() => Number)
	@IsInt({ message: WishlistStatusCode.PRODUCT_ID_MUST_BE_INT.customCode })
	@IsNotEmpty({
		message: WishlistStatusCode.PRODUCT_ID_IS_NOT_EMPTY.customCode,
	})
	productID: number;
}
