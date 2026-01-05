/**
 * @description Cart detail repository
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartDetailEntity } from '../entities/cart-detail.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CartDetailsStatusEnum } from '../enums/cart-details.status.enum';

export class CartDetailRepository {
	private readonly logger: Logger = new Logger(CartDetailRepository.name);

	constructor(
		@InjectRepository(CartDetailEntity)
		private readonly cartDetailRepository: Repository<CartDetailEntity>,
		private readonly dataSource: DataSource
	) {}

	/**
	 * @description Get cart details by user ID
	 * @param {number} userID - ID of user
	 * @param {number} skip - Number of items to skip
	 * @param {number} take - Number of items to take
	 * @return {Promise<[CartDetailEntity[], number]>} - Array of cart details
	 * and total number of cart details
	 * @author Nhut Tan
	 * @since 2025-09-24
	 * @version 1.0.0
	 */
	async getCartDetailsByUserID(
		userID: number,
		skip: number,
		take: number
	): Promise<[CartDetailEntity[], number]> {
		try {
			/**
			 * Get cart details from database with active status and sort by
			 * createdAt DESC and counting the number of record
			 */
			const [cartDetails, total]: [CartDetailEntity[], number] =
				await this.cartDetailRepository.findAndCount({
					where: {
						cart: {
							user: {
								id: userID,
							},
						},
					},
					relations: {
						cart: {
							user: true,
						},
					},
					skip,
					take,
					order: {
						createdAt: 'DESC',
					},
				});
			this.logger.debug(
				`Cart details: ${JSON.stringify(cartDetails, null, 2)}`
			);

			/**
			 * Return data
			 */
			return [cartDetails, total];
		} catch (e) {
			this.logger.error(
				`Error in \`getCartDetailsByUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Create cart detail
	 * @param {number} productID - ID of product
	 * @param {number} cartID - ID of cart
	 * @param {number} quantity - Quantity of product
	 * @return {Promise<CartDetailEntity>} - Created cart detail entity
	 * @author Nhut Tan
	 * @since 2025-09-24
	 * @version 1.0.0
	 */
	async createCartDetail(
		productID: number,
		cartID: number,
		quantity: number
	): Promise<CartDetailEntity> {
		try {
			return await this.dataSource.transaction(
				async (tx: EntityManager): Promise<CartDetailEntity> => {
					/**
					 * Create cart detail instance
					 */
					const cartDetailEntity: CartDetailEntity = tx.create(
						CartDetailEntity,
						{
							product: {
								id: productID,
							},
							cart: {
								id: cartID,
							},
							quantity: quantity,
							status: CartDetailsStatusEnum.ACTIVE,
							createdAt: new Date(),
							updatedAt: new Date(),
						}
					);

					/**
					 * Save the instance to the database
					 */
					return await tx.save(cartDetailEntity);
				}
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createCartDetail\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}
