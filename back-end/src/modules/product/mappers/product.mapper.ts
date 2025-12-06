/*
 * @description Product mapper
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { ProductEntityResponseDto } from '../dtos/product-entity-response.dto';

@Injectable()
export class ProductMapper {
	toProductEntityListResponseDto(products: ProductEntity[]): ProductEntityResponseDto[] {
		return products.map(product => this.toProductEntityResponseDto(product));
	}

	toProductEntityResponseDto(product: ProductEntity): ProductEntityResponseDto {
		// Xử lý ảnh với null check
		let imageUrl = '';

		// Kiểm tra
		if (product.productImages &&
			Array.isArray(product.productImages) &&
			product.productImages.length > 0) {

			const firstProductImage = product.productImages[0];

			if (firstProductImage &&
				firstProductImage.image &&
				firstProductImage.image.url) {
				imageUrl = firstProductImage.image.url;
			}
		}

		return {
			id: product.id,
			name: product.name,
			price: product.price,
			discount: product.discount,
			imageUrl: imageUrl, // ← Đã fix
			status: product.status,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		};
	}
}