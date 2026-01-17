/*
 * @description user repository
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-24
 * @version 1.0.3
 */

import { ProductEntity } from '../entities/product.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ProductStatusEnum } from '../enums/product-status.enum';
import { WishlistStatusEnum } from '../../wishlist/enums/wishlist-status.enum';
import { PagingResponseDto } from '../../../common/helper/dtos/paging-response.dto';

export class ProductRepository {
	private readonly logger: Logger = new Logger(ProductRepository.name);

	constructor(
		@InjectRepository(ProductEntity)
		private readonly productRepository: Repository<ProductEntity>,
		private readonly dataSource: DataSource
	) {}

	/**
	 * @description Get products paging
	 * @param {number} take - Number of items to take
	 * @param {number} skip - Number of items to skip
	 * @param {number} userID - ID of user whether if have token (login)
	 * @return {Promise<[ProductEntity[], number]>}
	 * @author Nhut Tan
	 * @since 2025-09-15
	 * @modifies 2025-09-24
	 * @version 1.0.1
	 */
	async getProductsPaging(
		take: number,
		skip: number,
		userID?: number
	): Promise<[ProductEntity[], number]> {
		try {
			/**
			 * No token condition
			 */
			const qb: SelectQueryBuilder<ProductEntity> = this.productRepository
				.createQueryBuilder('product')
				.leftJoinAndSelect('product.productImages', 'productImages')
				.leftJoinAndSelect('productImages.image', 'image')
				.where('product.status = :productStatus', {
					productStatus: ProductStatusEnum.ACTIVE,
				})
				.orderBy('product.createdAt', 'DESC')
				.take(take)
				.skip(skip);
			this.logger.verbose('No token condition');

			if (userID) {
				this.logger.verbose(`Having token condition: ${userID}`);
				qb.leftJoinAndSelect(
					'product.wishlistItems',
					'wishlist',
					'wishlist.status = :wishlistStatus',
					{ wishlistStatus: WishlistStatusEnum.ACTIVE }
				).leftJoinAndSelect(
					'wishlist.user',
					'user',
					'user.id = :userID',
					{ userID: userID }
				);
			}

			const [products, total] = await qb.getManyAndCount();
			this.logger.debug(
				`Get products paging from database: ${JSON.stringify(products, null, 2)}`
			);

			/**
			 * Return data
			 */
			return [products, total];
		} catch (e) {
			this.logger.error(
				`Error in \`getProductsPaging\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get product by id
	 * @param {number} productID - ID of product
	 * @return {ProductEntity | null}
	 */
	async getProductByProductID(
		productID: number
	): Promise<ProductEntity | null> {
		return await this.productRepository.findOne({
			where: { id: productID },
		});
	}

	/**
	 * @description Get product by product name
	 * @param productName - Name of product
	 * @param take - Number of items to take
	 * @param skip - Number of items to skip
	 * @param {number} userID - ID of user whether if have token (login)
	 * @return {Promise<ProductEntity | null>}
	 */
	async getProductsPagingByProductName(
		productName: string,
		take: number,
		skip: number,
		userID?: number
	): Promise<[ProductEntity[], number]> {
		try {
			/**
			 * No token condition
			 */
			const qb: SelectQueryBuilder<ProductEntity> = this.productRepository
				.createQueryBuilder('product')
				.leftJoinAndSelect('product.productImages', 'productImages')
				.leftJoinAndSelect('productImages.image', 'image')
				.where(
					'product.status = :productStatus AND product.name ILIKE :productName',
					{
						productStatus: ProductStatusEnum.ACTIVE,
						productName: `%${productName}%`,
					}
				)
				.orderBy('product.createdAt', 'DESC')
				.take(take)
				.skip(skip);
			this.logger.verbose('No token condition');

			if (userID) {
				this.logger.verbose(`Having token condition: ${userID}`);
				qb.leftJoinAndSelect(
					'product.wishlistItems',
					'wishlist',
					'wishlist.status = :wishlistStatus',
					{ wishlistStatus: WishlistStatusEnum.ACTIVE }
				).leftJoinAndSelect(
					'wishlist.user',
					'user',
					'user.id = :userID',
					{ userID: userID }
				);
			}

			const [products, total] = await qb.getManyAndCount();
			this.logger.debug(
				`Get products paging from database: ${JSON.stringify(products, null, 2)}`
			);

			/**
			 * Return data
			 */
			return [products, total];
		} catch (e) {
			this.logger.error(
				`Error in \`getProductsPagingByProductName\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}
