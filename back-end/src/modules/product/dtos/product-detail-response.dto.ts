/**
 * @description Product detail response dto
 * @author Nhut Tan
 * @since 2025-09-24
 * @since 2025-01-07
 * @version 1.0.1
 */

export class ProductDetailResponseDto {
	id: number;
	name: string;
	price: number;
	imageList: string[];
	discount: number;
	color: string[];
	rating: number;
	size: string[];
	description: string;
}
