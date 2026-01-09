/**
 * @description Cart detail service
 * @author Nhut Tan
 * @since 2025-09-24
 * @modifies 2026-01-09
 * @version 1.0.1
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CartDetailRepository } from './repositories/cart-detail.repository';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CartDetailMapper } from './mappers/cart-detail.mapper';
import { UpdateResult } from 'typeorm';
import { ProductStatusCode } from '../product/status-code/product.status-code';
import { CartStatusCode } from './status-code/cart.status-code';

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
	 * @modifies 2026-01-09
	 * @version 1.0.1
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
			 * Get cart detail after created
			 */
			const cartDetailAfterCreated: CartDetailEntity =
				await this.getCartDetailByCartIDAndProductIDOrThrow(
					cartID,
					productID
				);

			/**
			 * Mapping `CartDetailEntity` to `CartDetailResponseDto`
			 */
			return this.cartDetailMapper.toCartDetailResponseDto(
				cartDetailAfterCreated
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createNewCartDetail\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Remove cart detail from cart then check row effect
	 * and return boolean
	 * @param {number} productID - ID of product
	 * @param {number} cartID - ID of cart
	 * @return {Promise<boolean>}
	 */
	async removeCartDetailFromCart(
		productID: number,
		cartID: number
	): Promise<boolean> {
		/**
		 * Call `removeCartDetailFromCart` from `CartDetailRepository`
		 */
		const updateResult: UpdateResult =
			await this.cartDetailRepository.removeCartDetailFromCart(
				productID,
				cartID
			);
		this.logger.debug(
			`Remove cart detail from cart result: ${JSON.stringify(updateResult, null, 2)}`
		);

		return (updateResult.affected ?? 0) > 0;
	}

	/**
	 * @description Get cart detail from cart detail
	 * repository with cart ID and user ID
	 * @param cartID - ID of cart of user
	 * @param productID - ID of user
	 * @return {Promise<CartDetailEntity | null>} - Cart detail entity
	 * @throws {NotFoundException} - Cart detail not found
	 * @author Nhut Tan
	 * @since 2026-01-09
	 * @version 1.0.0
	 */
	async getCartDetailByCartIDAndProductIDOrThrow(
		cartID: number,
		productID: number
	): Promise<CartDetailEntity> {
		const cartDetail: CartDetailEntity | null =
			await this.getCartDetailByCartIDAndProductIDOrNull(
				cartID,
				productID
			);

		if (!cartDetail) {
			throw new NotFoundException({
				statusCode: CartStatusCode.CART_DETAIL_NOT_FOUND.statusCode,
				customCode: CartStatusCode.CART_DETAIL_NOT_FOUND.customCode,
				message: CartStatusCode.CART_DETAIL_NOT_FOUND.message,
			});
		}

		return cartDetail;
	}

	/**
	 * @description Get cart detail from cart detail
	 * repository with cart ID and user ID
	 * @param cartID - ID of cart of user
	 * @param productID - ID of user
	 * @return {Promise<CartDetailEntity | null>} - Cart detail entity
	 * @author Nhut Tan
	 * @since 2026-01-09
	 * @version 1.0.0
	 */
	async getCartDetailByCartIDAndProductIDOrNull(
		cartID: number,
		productID: number
	): Promise<CartDetailEntity | null> {
		return await this.cartDetailRepository.getCartDetailByCartIDAndProductID(
			cartID,
			productID
		);
	}

	/**
	 * @description Update quantity of product in cart detail
	 * @param cartID - ID of cart of user
	 * @param productID - ID of product to update
	 * @param quantity - Quantity of product
	 * @return {Promise<boolean>} - Row effect
	 * @author Nhut Tan
	 * @since 2026-01-09
	 * @version 1.0.0
	 */
	async updateQuantityOfProductInCartDetail(
		cartID: number,
		productID: number,
		quantity: number
	): Promise<boolean> {
		const updateResult: UpdateResult =
			await this.cartDetailRepository.updateQuantityOfProductInCartDetail(
				cartID,
				productID,
				quantity
			);

		return (updateResult.affected ?? 0) > 0;
	}
}
