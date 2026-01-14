/**
 * @description Product in wishlist response dto
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

export class ProductInWishlistResponseDto {
	productID: number;
	name: string;
	imageUrl: string;
	price: number;
	discount: number;
	rating: number;
	createdAt: string;
	updatedAt: string;
}
