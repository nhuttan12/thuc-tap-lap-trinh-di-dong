/**
 * @description Product in wishlist response dto
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import { TimestampField } from '../../../common/database/timestamp.field'

export class ProductInWishlistResponseDto extends TimestampField {
	id: number
	name: string
	image: string
	price: number
	discount: number
	rating: number
}
