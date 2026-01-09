/**
 * @description Cart repository
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../entities/cart.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CartStatusEnum } from '../enums/cart.status.enum';

export class CartRepository {
	private readonly logger: Logger = new Logger(CartRepository.name);

	constructor(
		@InjectRepository(CartEntity)
		private readonly cartRepository: Repository<CartEntity>,
		private readonly dataSource: DataSource
	) {}

	/**
	 * @description Create new cart
	 * @param {number} userID - ID of user
	 * @return {Promise<CartEntity>} - Created cart entity
	 * @author Nhut Tan
	 * @since 2025-09-25
	 * @version 1.0.0
	 */
	async createCart(userID: number): Promise<CartEntity> {
		try {
			return await this.dataSource.transaction(
				async (tx: EntityManager) => {
					/**
					 * Create cart instance
					 */
					const cartEntity: CartEntity = tx.create(CartEntity, {
						user: {
							id: userID,
						},
						status: CartStatusEnum.ACTIVE,
						createdAt: new Date(),
						updatedAt: new Date(),
					});

					/**
					 * Save instance to the database
					 */
					return await tx.save(cartEntity);
				}
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createCart\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get cart by user ID and ACTIVE status
	 * @param {number} userID - ID of user
	 * @return {Promise<CartEntity | null>} - Cart entity or null
	 * @author Nhut Tan
	 * @since 2025-09-25
	 * @version 1.0.0
	 */
	async getActiveCartByUserID(userID: number): Promise<CartEntity | null> {
		try {
			/**
			 * Get cart by user ID and ACTIVE status from database
			 */
			const cartEntity: CartEntity | null =
				await this.cartRepository.findOne({
					where: {
						user: {
							id: userID,
						},
						status: CartStatusEnum.ACTIVE,
					},
					relations: {
						user: true,
						cartDetails: {
							product: {
								productImages: {
									image: true,
								},
							},
						},
					},
				});
			this.logger.debug(
				`Get cart by user ID and ACTIVE status from database: ${JSON.stringify(cartEntity, null, 2)}`
			);

			/**
			 * Return data
			 */
			return cartEntity;
		} catch (e) {
			this.logger.error(
				`Error in \`getActiveCartByUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}
