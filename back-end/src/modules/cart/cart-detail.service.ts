/**
 * @description Cart detail service
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import { Injectable, Logger } from '@nestjs/common';
import { CartDetailRepository } from './repositories/cart-detail.repository';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CartDetailMapper } from './mappers/cart-detail.mapper';

@Injectable()
export class CartDetailService {
	private readonly logger: Logger = new Logger(CartDetailService.name);

	constructor(
		private readonly cartDetailRepository: CartDetailRepository,
		private readonly buildPagingMetaService: BuildPagingMetaService,
		private readonly cartDetailMapper: CartDetailMapper
	) {}

	/**
	 * @description Get all cart details by user ID
	 * @param {number} userID - ID of user
	 * @param {number} page - Page number
	 * @param {number} limit - Number of items per page
	 * @return {Promise<PagingResponseDto<CartDetailResponseDto>>} - List of cart details used for paging
	 * @author Nhut Tan
	 * @since 2025-09-24
	 * @version 1.0.0
	 */
	async getCartDetailsByUserID(
		userID: number,
		page: number,
		limit: number
	): Promise<PagingResponseDto<CartDetailResponseDto>> {
		try {
			/**
			 * Calculate skip and take
			 */
			const skip: number = this.buildPagingMetaService.calculateSkip(
				page,
				limit
			);
			this.logger.debug(`Calculate skip and take: ${skip}`);

			/**
			 * Calling `getCartDetailsByUserID` from `CartDetailRepository`
			 */
			const [cartDetails, total]: [CartDetailEntity[], number] =
				await this.cartDetailRepository.getCartDetailsByUserID(
					userID,
					skip,
					limit
				);
			this.logger.debug(
				`Calling \`getCartDetailsByUserID\` from \`CartDetailRepository\`: ${JSON.stringify(cartDetails, null, 2)}, total: ${total}`
			);

			/**
			 * Convert `CartDetailEntity` to `CartDetailResponseDto`
			 */
			const cartDetailsResponseDto: CartDetailResponseDto[] =
				this.cartDetailMapper.toCartDetailsResponseDto(cartDetails);
			this.logger.debug(
				`Convert \`CartDetailEntity\` to \`CartDetailResponseDto\`: ${JSON.stringify(cartDetailsResponseDto, null, 2)}`
			);

			/**
			 * Build paging response
			 */
			return this.buildPagingMetaService.buildPagingResponse(
				cartDetailsResponseDto,
				total,
				page,
				limit
			);
		} catch (e) {
			this.logger.error(
				`Error in \`getCartDetailsByUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Create new cart detail by cart ID and product ID and quantity
	 * @param {number} productID - ID of product
	 * @param {number} cartID - ID of cart
	 * @param {number} quantity - Quantity of product
	 * @return {Promise<CartDetailResponseDto>} - Created cart detail entity
	 * @author Nhut Tan
	 * @since 2025-09-25
	 * @version 1.0.0
	 */
	async createNewCartDetail(
		productID: number,
		cartID: number,
		quantity: number
	): Promise<CartDetailResponseDto> {
		try {
			/**
			 * Calling `createCartDetail` from `CartDetailRepository`
			 */
			const cartDetailEntity: CartDetailEntity =
				await this.cartDetailRepository.createCartDetail(
					productID,
					cartID,
					quantity
				);
			this.logger.debug(
				`Cart detail created: ${JSON.stringify(cartDetailEntity, null, 2)}`
			);

			/**
			 * Mapping `CartDetailEntity` to `CartDetailResponseDto`
			 */
			return this.cartDetailMapper.toCartDetailResponseDto(
				cartDetailEntity
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createNewCartDetail\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}
