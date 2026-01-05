/*
 * @description Product mapper
 * @author Nhut Tan
 * @since 2025-09-15
 * @modifes 2025-12-16
 * @modifies 2026-01-04
 * @version 1.0.2
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
			const details = product.productDetailsEntity;

			return {
				id: product.id,
				name: product.name,
				price: product.price,

				discount: product.discount ?? 0,
				description: details?.description ?? '',
				rating: details?.rating ?? 0,

				imageUrl:
					product.productImages?.map((img: ProductImageEntity) => {
						return img.image?.url ?? null;
					}) ?? [],

				size: details?.size
					? this.extractString.extractStringByDelimeter(
							details.size,
							'; '
						)
					: [],

				color: details?.color
					? this.extractString.extractStringByDelimeter(
							details.color,
							'; '
						)
					: [],

				status: product.status,
				createdAt: product.createdAt,
				updatedAt: product.updatedAt,
			};
		});
	}
}
