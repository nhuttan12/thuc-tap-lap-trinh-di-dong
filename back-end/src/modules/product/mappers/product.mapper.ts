/*
 * @description Product mapper
 * @author Nhut Tan
 * @since 2025-09-15
 * @modifes 2025-12-16
 * @modifies 2026-01-04
 * @version 1.0.2
 */

import { Injectable } from '@nestjs/common';
import { ProductImageEntity } from '../../image/entities/product-image.entity';
import { ProductEntityResponseDto } from '../dtos/product-entity-response.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductImageTypeEnum } from '../enums/product-image-type.enum';
import { ProductDetailsEntity } from '../entities/product-details.entity';

@Injectable()
export class ProductMapper {
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
		return products.map(
			(product: ProductEntity): ProductEntityResponseDto => {
				return this.toProductEntityResponseDto(product);
			}
		);
	}

	toProductEntityResponseDto(
		product: ProductEntity
	): ProductEntityResponseDto {
		const details: ProductDetailsEntity = product.productDetailsEntity;

		return {
			id: product.id,
			name: product.name,
			price: product.price,

			discount: product.discount ?? 0,
			description: details?.description ?? '',
			rating: details?.rating ?? 0,

			imageUrl:
				product.productImages?.find((img: ProductImageEntity) => {
					return (
						img.image?.url &&
						img.type === ProductImageTypeEnum.THUMBNAIL
					);
				})?.image.url ?? '',

			status: product.status,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		};
	}
}
