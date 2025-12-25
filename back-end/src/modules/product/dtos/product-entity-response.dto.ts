/*
 * @description Product entity response dto
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 */

export class ProductEntityResponseDto {
	id: number;
	name: string;
	price: number;
	description: string;
	discount: number;
	imageUrl: string[];
	size: string[];
	color: string[];
	rating: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}
