/**
 * @description Wishlist item repository
 * @author Nhut Tan
 * @since 2025-09-23
 * @modifies 2025-09-24
 * @version 1.0.2
 */
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistItemEntity } from '../entities/wishlist-item.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { WishlistStatusEnum } from '../enums/wishlist-status.enum';
import { WishlistStatusCode } from '../status-code/wishlist.status-code';

export class WishlistItemRepository {
	private readonly logger: Logger = new Logger(WishlistItemRepository.name);

	constructor(
		@InjectRepository(WishlistItemEntity)
		private readonly wishlistItemRepository: Repository<WishlistItemEntity>,
		private readonly dataSource: DataSource
	) {}

	/**
	 * @description Get alls wishlist item
	 * @param {number} userID - ID of user
	 * @param {number} skip - Number of items to skip
	 * @param {number} take - Number of items to take
	 * @return {Promise<[WishlistItemEntity[], number]>} - Array of wishlist items and total number of items
	 * @author Nhut Tan
	 * @date 2025-09-23
	 * @modifies 2025-09-24
	 * @version 1.0.2
	 */
	async getAllWishlistItems(
		userID: number,
		skip: number,
		take: number
	): Promise<[WishlistItemEntity[], number]> {
		try {
			/**
			 * Get all wishlist items from database
			 */
			const [wishlistItems, total]: [WishlistItemEntity[], number] =
				await this.wishlistItemRepository.findAndCount({
					where: {
						status: WishlistStatusEnum.ACTIVE,
						user: {
							id: userID,
						},
					},
					skip,
					take,
					order: {
						createdAt: 'DESC',
					},
					relations: {
						product: {
							productDetailsEntity: true,
							productImages: {
								image: true,
							},
						},
					},
				});
			this.logger.debug(
				`Get all wishlist from database: ${JSON.stringify(wishlistItems)}`
			);

			/**
			 * Return data
			 */
			return [wishlistItems, total];
		} catch (e) {
			this.logger.error(
				`Error in \`getAllWishlistItems\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Create wishlist item
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @return {Promise<WishlistItemEntity>} - Wishlist item entity
	 * @author Nhut Tan
	 * @since 2025-09-23
	 * @version 1.0.0
	 */
	async createWishlistItem(
		productID: number,
		userID: number
	): Promise<WishlistItemEntity> {
		try {
			return await this.dataSource.transaction(
				async (tx: EntityManager): Promise<WishlistItemEntity> => {
					/**
					 * Create wishlist item instance
					 */
					const wishlistItemEntity: WishlistItemEntity = tx.create(
						WishlistItemEntity,
						{
							user: {
								id: userID,
							},
							product: {
								id: productID,
							},
							status: WishlistStatusEnum.ACTIVE,
							createdAt: new Date(),
							updatedAt: new Date(),
						}
					);

					/**
					 * Save instance to the database
					 */
					return await tx.save(wishlistItemEntity);
				}
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createWishlistItem\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Remove (soft delete) wishlist item
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @return {Promise<WishlistItemEntity>} - Wishlist item entity
	 * @author Nhut Tan
	 * @since 2025-09-23
	 * @version 1.0.0
	 */
	async removeWishlistItem(
		productID: number,
		userID: number
	): Promise<WishlistItemEntity> {
		try {
			return await this.dataSource.transaction(
				async (tx: EntityManager): Promise<WishlistItemEntity> => {
					/**
					 * Get wishlist item by productID and userID
					 */
					const wishlistItemEntity: WishlistItemEntity | null =
						await tx.findOne(WishlistItemEntity, {
							where: {
								product: {
									id: productID,
								},
								user: {
									id: userID,
								},
								status: WishlistStatusEnum.ACTIVE,
							},
						});

					/**
					 * Check if wishlist item not exists
					 */
					if (!wishlistItemEntity) {
						/**
						 * Log error, and throwing error
						 */
						this.logger.error(
							`Wishlist item with product id ${productID} and user id ${userID} not found`
						);
						throw new NotFoundException({
							statusCode:
								WishlistStatusCode.WishlistItemNotFound
									.statusCode,
							customCode:
								WishlistStatusCode.WishlistItemNotFound
									.customCode,
							message:
								WishlistStatusCode.WishlistItemNotFound.message,
						});
					}

					/**
					 * Set new status
					 */
					wishlistItemEntity.status = WishlistStatusEnum.DELETED;

					/**
					 * Save it to the database
					 */
					return tx.save(wishlistItemEntity);
				}
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
	 * @description Get wishlist item by product ID and user ID
	 * @author Nhut Tan
	 * @since 2025-09-23
	 * @version 1.0.0
	 */
	async getWishlistItemByProductIDAndUserID(
		productID: number,
		userID: number
	): Promise<WishlistItemEntity | null> {
		try {
			return await this.wishlistItemRepository.findOne({
				where: {
					product: {
						id: productID,
					},
					user: {
						id: userID,
					},
					status: WishlistStatusEnum.ACTIVE,
				},
			});
		} catch (e) {
			this.logger.error(
				`Error in \`getWishlistItemByProductIDAndUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}
