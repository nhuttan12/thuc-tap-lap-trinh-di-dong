/**
 * @description Wishlist service
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { WishlistItemRepository } from './repositories/wishlist-item.repository';
import { ProductInWishlistResponseDto } from './dtos/product-in-wishlist-response.dto';
import { WishlistItemEntity } from './entities/wishlist-item.entity';
import { WishlistItemMapper } from './mappers/wishlist-item.mapper';
import { WishlistStatusCode } from './status-code/wishlist.status-code';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { AuthStatusCode } from '../auth/status-code/auth.status-code';
import { UpdateResult } from 'typeorm';
import { ProductStatusCode } from '../product/status-code/product.status-code';

@Injectable()
export class WishlistService {
	private readonly logger: Logger = new Logger(WishlistService.name);

	constructor(
		private readonly wishlistItemRepository: WishlistItemRepository,
		private readonly wishlistItemMapper: WishlistItemMapper,
		private readonly buildPagingMetaService: BuildPagingMetaService
	) {}

	/**
	 * @description Get all product in wishlist
	 * @param {number} userID - ID of user
	 * @param {number} page - Page number
	 * @param {number} limit - Number of items per page
	 * @return {Promise<PagingResponseDto<ProductInWishlistResponseDto>>} - List of products in wishlist
	 * @author Nhut Tan
	 * @since 2025-09-23
	 * @version 1.0.0
	 */
	async getProductsInWishlistPaging(
		userID: number,
		page: number,
		limit: number
	): Promise<PagingResponseDto<ProductInWishlistResponseDto>> {
		try {
			/**
			 * Calculate skip and take
			 */
			const skip: number = this.buildPagingMetaService.calculateSkip(
				page,
				limit
			);
			this.logger.debug(`Calculate skip in service ${skip}`);

			/**
			 * Call `getAllWishlistItems` in `WishlistItemRepository`
			 */
			const [wishlistItems, total]: [WishlistItemEntity[], number] =
				await this.wishlistItemRepository.getAllWishlistItems(
					userID,
					skip,
					limit
				);
			this.logger.debug(
				`Get all wishlist items ${JSON.stringify(wishlistItems, null, 2)}`
			);

			/**
			 * Convert wishlist items to product in wishlist response dto
			 */
			const productsInWishlistResponseDto: ProductInWishlistResponseDto[] =
				this.wishlistItemMapper.toProductInWishlistListResponseDto(
					wishlistItems
				);
			this.logger.debug(
				`Convert wishlist items to product in wishlist response dto ${JSON.stringify(productsInWishlistResponseDto, null, 2)}`
			);

			return this.buildPagingMetaService.buildPagingResponse(
				productsInWishlistResponseDto,
				skip,
				limit,
				total
			);
		} catch (e) {
			this.logger.error(
				`Error in \`getAllProductInWishlist\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Add product to wishlist
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @return {Promise<boolean>} - True if product added to wishlist successfully
	 * @author Nhut Tan
	 * @date 2025-09-23
	 * @version 1.0.0
	 */
	async addToWishlist(productID: number, userID: number): Promise<boolean> {
		try {
			/**
			 * Get product in wishlist and check product existence in wishlist item
			 */
			const wishlistExistence: WishlistItemEntity | null =
				await this.getProductInWishlistByProductIDAndUserIDOrNull(
					productID,
					userID
				);
			this.logger.debug(
				`Get product in wishlist and check product existence in wishlist item: ${JSON.stringify(wishlistExistence, null, 2)}`
			);

			/**
			 * Whether if product not exist in wishlist
			 */
			if (!wishlistExistence) {
				/**
				 * Call `createWishlistItem` in `WishlistItemRepository` to
				 * add product to wishlist
				 */
				const wishlistCreated: WishlistItemEntity =
					await this.wishlistItemRepository.createWishlistItem(
						productID,
						userID
					);
				this.logger.debug(
					`Call \`createWishlistItem\` in \`WishlistItemRepository\` to add product to wishlist: ${JSON.stringify(wishlistCreated, null, 2)}`
				);

				/**
				 * Whether if wishlist after created is null
				 */
				if (!wishlistCreated) {
					this.logger.warn(`Wishlist after created is null`);
					throw new ConflictException({
						statusCode:
							WishlistStatusCode.ADD_PRODUCT_TO_WISHLIST_FAILED
								.statusCode,
						customCode:
							WishlistStatusCode.ADD_PRODUCT_TO_WISHLIST_FAILED
								.customCode,
						message:
							WishlistStatusCode.ADD_PRODUCT_TO_WISHLIST_FAILED
								.message,
					});
				} else {
					this.logger.debug('Add product to wishlist success');
					return true;
				}
			}

			/**
			 * Default is failed
			 */
			this.logger.debug('Return default is false');
			return false;
		} catch (e) {
			this.logger.error(
				`Error in \`getAllProductInWishlist\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get product in wishlist by product ID and user ID,
	 * return null if not exist
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @return {Promise<WishlistItemEntity | null>} - Wishlist item entity if product in wishlist, null otherwise
	 * @author Nhut Tan
	 * @date 2025-09-23
	 * @version 1.0.0
	 */
	async getProductInWishlistByProductIDAndUserIDOrNull(
		productID: number,
		userID: number
	): Promise<WishlistItemEntity | null> {
		try {
			/**
			 * Call `getWishlistItemByProductIDAndUserID` in `WishlistItemRepository`
			 */
			const wishlistItemEntity: WishlistItemEntity | null =
				await this.wishlistItemRepository.getWishlistItemByProductIDAndUserID(
					productID,
					userID
				);
			this.logger.debug(
				`Call \`getWishlistItemByProductIDAndUserID\` in \`WishlistItemRepository\`: ${JSON.stringify(wishlistItemEntity, null, 2)}`
			);

			return wishlistItemEntity;
		} catch (e) {
			this.logger.error(
				`Error in \`getProductInWishlistByProductIDAndUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get product in wishlist by product ID and user ID,
	 * throw error if not exist
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @return {Promise<WishlistItemEntity | null>} - Wishlist item entity if product in wishlist, null otherwise
	 * @author Nhut Tan
	 * @date 2025-09-23
	 * @version 1.0.0
	 */
	async getProductInWishlistByProductIDAndUserIDOrThrow(
		productID: number,
		userID: number
	): Promise<WishlistItemEntity> {
		try {
			/**
			 * Call `getWishlistItemByProductIDAndUserID` in `WishlistItemRepository`
			 */
			const wishlistItemEntity: WishlistItemEntity | null =
				await this.wishlistItemRepository.getWishlistItemByProductIDAndUserID(
					productID,
					userID
				);
			this.logger.debug(
				`Call \`getWishlistItemByProductIDAndUserID\` in \`WishlistItemRepository\`: ${JSON.stringify(wishlistItemEntity, null, 2)}`
			);

			/**
			 * Check wishlist item exist
			 */
			if (!wishlistItemEntity) {
				this.logger.debug('Wishlist item not exist');
				throw new NotFoundException({
					statusCode:
						WishlistStatusCode.WISHLIST_ITEM_NOT_FOUND.statusCode,
					customCode:
						WishlistStatusCode.WISHLIST_ITEM_NOT_FOUND.customCode,
					message: WishlistStatusCode.WISHLIST_ITEM_NOT_FOUND.message,
				});
			}

			return wishlistItemEntity;
		} catch (e) {
			this.logger.error(
				`Error in \`getProductInWishlistByProductIDAndUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Remove product from wishlist
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @return {Promise<boolean>} - True if product removed from wishlist successfully
	 * @since 2025-09-24
	 * @version 1.0.0
	 */
	async removeProductFromWishlist(
		productID: number,
		userID: number
	): Promise<boolean> {
		try {
			/**
			 * Get wishlist item with wishlist item ID and user ID
			 */
			const wishlistItemEntity: WishlistItemEntity =
				await this.getProductInWishlistByProductIDAndUserIDOrThrow(
					productID,
					userID
				);
			this.logger.debug(
				`Get wishlist item with wishlist item ID and user ID: ${JSON.stringify(wishlistItemEntity, null, 2)}`
			);

			/**
			 * Call `removeWishlistItem` in `WishlistItemRepository`
			 */
			return await this.removeWishlistItemWithWishlistItemIDAndUserID(
				wishlistItemEntity.id,
				userID
			);
		} catch (e) {
			this.logger.error(
				`Error in \`removeWishlistItem\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Remove wishlist item
	 * @param wishlistItemID - ID of wishlist item reference to product
	 * @param userID - ID of user
	 * @return {Promise<boolean>} - True if wishlist item removed successfully
	 * @since 2026-01-13
	 * @version 1.0.0
	 */
	async removeWishlistItemWithWishlistItemIDAndUserID(
		wishlistItemID: number,
		userID: number
	): Promise<boolean> {
		const removeWishlistResult: UpdateResult =
			await this.wishlistItemRepository.removeWishlistItemWithWishlistItemIDAndUserID(
				wishlistItemID,
				userID
			);

		return (removeWishlistResult.affected ?? 0) > 0;
	}

	/**
	 * @description Get wishlist item by wishlist item ID and user ID
	 * @param wishlistItemID - ID of wishlist item reference to product
	 * @param userID - ID of user
	 * @return {Promise<WishlistItemEntity>} - Wishlist item entity
	 * @throws {NotFoundException} - If wishlist item not found
	 * @since 2026-01-13
	 * @version 1.0.0
	 */
	async getWishlistItemByWishlistItemIDAndUserIDOrThrow(
		wishlistItemID: number,
		userID: number
	): Promise<WishlistItemEntity> {
		/**
		 * Call `getWishlistItemByWishlistItemIDAndUserID` in `WishlistItemRepository`
		 */
		const wishlistItem: WishlistItemEntity | null =
			await this.wishlistItemRepository.getWishlistItemByWishlistItemIDAndUserID(
				wishlistItemID,
				userID
			);
		this.logger.debug(
			`Call \`getWishlistItemByWishlistItemIDAndUserID\` in \`WishlistItemRepository\`: ${JSON.stringify(wishlistItem, null, 2)}`
		);

		/**
		 * Check if wishlist item not exists
		 */
		if (!wishlistItem) {
			this.logger.warn(
				`Wishlist item with wishlist item id ${wishlistItemID} and user id ${userID} not found`
			);
			throw new NotFoundException({
				statusCode:
					WishlistStatusCode.WISHLIST_ITEM_NOT_FOUND.statusCode,
				customCode:
					WishlistStatusCode.WISHLIST_ITEM_NOT_FOUND.customCode,
				message: WishlistStatusCode.WISHLIST_ITEM_NOT_FOUND.message,
			});
		}

		return wishlistItem;
	}
}
