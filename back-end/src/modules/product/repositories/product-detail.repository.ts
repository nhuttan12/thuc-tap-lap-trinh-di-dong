/**
 * @description Product detail repository
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDetailsEntity } from '../entities/product-details.entity';
import { Repository } from 'typeorm';

export class ProductDetailRepository {
	private readonly logger: Logger = new Logger(ProductDetailRepository.name);

	constructor(
		@InjectRepository(ProductDetailsEntity)
		private readonly productDetailRepository: Repository<ProductDetailsEntity>
	) {}

	/**
	 * @description Get product detail by product ID
	 * @param {number} productID - ID of product
	 * @return {Promise<ProductDetailsEntity | number>} - Product detail entity
	 * or null
	 * @author Nhut Tan
	 * @date 2025-09-24
	 * @version 1.0.0
	 */
	async getProductDetailByProductID(
		productID: number
	): Promise<ProductDetailsEntity | null> {
		try {
			/**
			 * Get product detail by product ID from the database
			 */
			const productDetailEntity: ProductDetailsEntity | null =
				await this.productDetailRepository.findOne({
					where: {
						id: productID,
					},
					relations: {
						product: {
							productImages: {
								image: true,
							},
						},
					},
				});

			/**
			 * Return data
			 */
			return productDetailEntity;
		} catch (e) {
			this.logger.error(
				`Error in \`getProductDetailByProductID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}
