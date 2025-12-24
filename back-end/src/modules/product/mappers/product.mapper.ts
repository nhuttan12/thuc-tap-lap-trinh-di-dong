/*
 * @description Product mapper
 * @author Nhut Tan
 * @since 2025-09-15
 * @modifes 2025-12-16
 * @version 1.0.1
 */

import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { ProductEntityResponseDto } from '../dtos/product-entity-response.dto';
import { ProductImageEntity } from '../../image/entities/product-image.entity';
import { ExtractStringByDelimeter } from './../../../common/helper/extract-string-by-delimeter';

@Injectable()
export class ProductMapper {
	constructor(private readonly extractString: ExtractStringByDelimeter) {}

	/**
	 * @description Map from Product entity to Product entity response object
	 * @author Nhut tan
	 * @since
	 * @param {ProductEntity[]} products - Product entity object
	 * @returns {ProductEntityResponseDto[]}
	 */
	toProductEntityListResponseDto(
		products: ProductEntity[]
	): ProductEntityResponseDto[] {
		return products.map((product: ProductEntity) => {
			return {
				id: product.id,
				name: product.name,
				price: product.price,
				discount: product.discount,
				imageUrl: product.productImages.map(
					(img: ProductImageEntity) => {
						return img.image.url;
					}
				),
				size: this.extractString.extractStringByDelimeter(
					product.size,
					'; '
				),
				color: this.extractString.extractStringByDelimeter(
					product.color,
					'; '
				),
				status: product.status,
				createdAt: product.createdAt,
				updatedAt: product.updatedAt,
			};
		});
	}
}
