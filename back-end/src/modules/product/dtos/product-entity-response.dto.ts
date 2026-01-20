/*
 * @description Product entity response dto
 * @author Nhut Tan
 * @since 2025-09-15
 * @since 2025-01-07
 * @version 1.0.1
 */

export class ProductEntityResponseDto {
	productID: number;
	name: string;
	price: number;
	rating: number;
	imageUrl: string;
	status: string;
	isInWishlist: boolean;
}
