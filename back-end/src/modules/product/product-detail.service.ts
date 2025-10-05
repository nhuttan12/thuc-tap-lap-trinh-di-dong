/**
 * @description Product detail service
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ProductDetailRepository } from './repositories/product-detail.repository'
import { ProductDetailResponseDto } from './dtos/product-detail-response.dto'
import { ProductDetailsEntity } from './entities/product-details.entity'
import { ProductDetailMapper } from './mappers/product-detail.mapper'
import { ProductDetailStatusCode } from './status-code/product-detail.status-code'

@Injectable()
export class ProductDetailService {
	private readonly logger: Logger = new Logger(ProductDetailService.name)

	constructor(
		private readonly productDetailRepository: ProductDetailRepository,
		private readonly productDetailMapper: ProductDetailMapper
	) {}

	/**
	 * @description Get product detail by product ID
	 * @param {number} productID - ID of product
	 * @return {Promise<ProductDetailResponseDto>} - Product detail response dto
	 * @author Nhut Tan
	 * @date 2025-09-24
	 * @version 1.0.0
	 */
	async getProductDetailByProductID(
		productID: number
	): Promise<ProductDetailResponseDto> {
		try {
			/**
			 * Calling `getProductDetailByProductID` in `ProductDetailRepository`
			 */
			const productDetailEntity: ProductDetailsEntity | null =
				await this.productDetailRepository.getProductDetailByProductID(
					productID
				)
			this.logger.debug(
				`Product detail in service: ${JSON.stringify(productDetailEntity)}`
			)

			/**
			 * Check if productDetailEntity exist
			 */
			if (!productDetailEntity) {
				/**
				 * Log error, and throwing error
				 */
				this.logger.warn('Product detail not found')
				throw new BadRequestException({
					statusCode:
						ProductDetailStatusCode.PRODUCT_DETAIL_NOT_FOUND
							.statusCode,
					customCode:
						ProductDetailStatusCode.PRODUCT_DETAIL_NOT_FOUND
							.customCode,
					message:
						ProductDetailStatusCode.PRODUCT_DETAIL_NOT_FOUND
							.message,
				})
			}

			/**
			 * Convert ProductDetailsEntity to ProductDetailResponseDto
			 */
			const productDetailResponseDto: ProductDetailResponseDto =
				this.productDetailMapper.toProductDetailResponse(
					productDetailEntity
				)
			this.logger.debug(
				`Product detail in response: ${JSON.stringify(productDetailResponseDto)}`
			)

			/**
			 * Return data
			 */
			return productDetailResponseDto
		} catch (e) {
			this.logger.error(
				`Error in \`getProductDetailByProductID\`: ${(e as Error).message}`,
				(e as Error).stack
			)
			throw e
		}
	}
}
