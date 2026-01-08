/*
 * @description Product entity response dto
 * @author Nhut Tan
 * @since 2025-09-15
 * @since 2025-01-07
 * @version 1.0.1
 */

export class ProductEntityResponseDto {
	id: number;
	name: string;
	price: number;
	description: string;
	discount: number;
	imageUrl: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}
