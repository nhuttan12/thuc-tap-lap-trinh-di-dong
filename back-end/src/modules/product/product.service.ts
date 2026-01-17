/*
 * @description Product service
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ProductRepository } from './repositories/product.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { ProductDetailRepository } from './repositories/product-detail.repository';
import { ProductDetailsEntity } from "./entities/product-details.entity";
import { ProductImageEntity } from "../image/entities/product-image.entity";
import { ProductStatusEnum } from './enums/product-status.enum';
import { ProductImageTypeEnum } from "./enums/product-image.type.enum";
import { CategoryEntity } from '../category/entities/category.entity';
import { ImageStatusEnum } from '../image/enums/image-status.enum';
import { ImageEntity } from "../image/entities/image.entity";
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import {CategoryStatusEnum} from "../category/enums/category-status.enum";

@Injectable()
export class ProductService {
	private readonly logger: Logger = new Logger(ProductService.name);

	constructor(
		private dataSource: DataSource,
		private readonly productRepository: ProductRepository,
		private readonly productMapper: ProductMapper,
		private readonly buildPagingMetaService: BuildPagingMetaService,
		private readonly productDetailRepository: ProductDetailRepository,
	) { }

	/**
	 * CREATE PRODUCT (ADMIN)
	 */
	async createProductAdmin(body: any): Promise<ProductEntity> {
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();

		try {
			// 1. VALIDATE CATEGORY
			const categoryId = body.category_id;
			if (categoryId) {
				// Validate category nếu có
				const category = await qr.manager.findOne(CategoryEntity, {
					where: { id: categoryId, status: CategoryStatusEnum.ACTIVE }
				});
				if (!category) {
					throw new BadRequestException(`Category id=${categoryId} not found or inactive`);
				}
			}

			// 2. INSERT PRODUCT
			const productResult = await qr.manager
				.createQueryBuilder()
				.insert()
				.into(ProductEntity)
				.values({
					name: body.name,
					price: Number(body.price),
					discount: body.discount ?? 0,
					status: body.status ?? ProductStatusEnum.ACTIVE
				})
				.execute();

			const productId = productResult.identifiers[0].id;

			// 🔥 3. INSERT DETAILS - RAW SQL ✅
			await qr.manager.query(`
         INSERT INTO product_details (id, size, color, description, rating, category_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [
				productId,
				Array.isArray(body.size) ? body.size.join(',') : (body.size ?? '37').toString(),
				body.color ?? 'Đen',
				body.description ?? '',
				body.rating ?? 0,
				categoryId
			]);

			await qr.commitTransaction();

			return await this.dataSource.manager.findOneOrFail(ProductEntity, {
				where: { id: productId },
				relations: ['productDetailsEntity', 'productDetailsEntity.categoryEntity']
			});

		} catch (e) {
			await qr.rollbackTransaction();
			throw e;
		} finally {
			await qr.release();
		}
	}


	/**
	 * UPDATE PRODUCT (ADMIN)
	 */
	async updateProductAdmin(id: number, body: any): Promise<{ id: number }> {
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();

		try {
			// 1. UPDATE PRODUCT (basic info)
			const productUpdate: any = {};
			if (body.name !== undefined) productUpdate.name = body.name;
			if (body.price !== undefined) productUpdate.price = Number(body.price);
			if (body.discount !== undefined) productUpdate.discount = Number(body.discount);
			if (body.status !== undefined) productUpdate.status = body.status;

			if (Object.keys(productUpdate).length > 0) {
				await qr.manager.update(ProductEntity, id, productUpdate);
			}

			// 🔥 2. UPDATE DETAILS - SINGLE Raw SQL (FORCE ALL FIELDS!)
			const sizeVal = body.productDetailsEntity?.size ?? body.size ?? '';
			const colorVal = body.productDetailsEntity?.color ?? body.color ?? '';
			const descVal = body.productDetailsEntity?.description ?? body.description ?? '';
			const ratingVal = Number(body.productDetailsEntity?.rating ?? body.rating ?? 0);
			const catId = body.productDetailsEntity?.category_id ?? body.category_id;

			await qr.manager.query(`
         UPDATE product_details 
         SET 
            size = $1,
            color = $2, 
            description = $3,
            rating = $4,
            category_id = COALESCE($5, category_id),
            updated_at = NOW()
         WHERE id = $6
      `, [
				Array.isArray(sizeVal) ? sizeVal.join(',') : String(sizeVal),
				colorVal,
				descVal,
				ratingVal,
				catId || null,  // NULL-safe
				id
			]);

			await qr.commitTransaction();

			// 3. RETURN FRESH DATA với relations
			return await this.dataSource.manager.findOneOrFail(ProductEntity, {
				where: { id },
				relations: [
					'productDetailsEntity',
					'productDetailsEntity.categoryEntity',
					'productImages',
					'productImages.image'
				]
			});

		} catch (e) {
			await qr.rollbackTransaction();
			this.logger.error(`Update product ${id} failed:`, e);
			throw e;
		} finally {
			await qr.release();
		}
	}

	/**
	 * DELETE PRODUCT (ADMIN - Soft delete)
	 */
	async deleteProductAdmin(id: number): Promise<void> {
		try {
			this.logger.debug(`Soft deleting product ${id}`);

			// Check if product exists first
			const product = await this.dataSource.manager.findOne(ProductEntity, {
				where: { id },
			});

			if (!product) {
				throw new BadRequestException(`Product id=${id} not found`);
			}

			const result = await this.dataSource.manager.update(
				ProductEntity,
				id,
				{ status: ProductStatusEnum.DELETED },
			);

			if (!result.affected) {
				throw new BadRequestException(`Failed to delete product id=${id}`);
			}

			this.logger.debug(`Product ${id} soft deleted successfully`);

		} catch (e) {
			this.logger.error(`Delete product ${id} failed`, e);
			throw e;
		}
	}

	/**
	 * UPDATE PRODUCT STATUS (ADMIN)
	 */
	async updateProductStatus(id: number, status: string): Promise<{ id: number }> {
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();

		try {
			if (!Object.values(ProductStatusEnum).includes(status as ProductStatusEnum)) {
				throw new BadRequestException('Invalid status');
			}

			const product = await qr.manager.findOneOrFail(ProductEntity, {
				where: { id },
				relations: ['productDetailsEntity'],
			});

			// product.status = status as ProductStatusEnum;
			await qr.manager.save(product);

			await qr.commitTransaction();

			return await this.dataSource.manager.findOneOrFail(ProductEntity, {
				where: { id },
				relations: [
					'productDetailsEntity',
					'productDetailsEntity.categoryEntity',
					'productImages',
					'productImages.image',
				],
			});
		} catch (e) {
			await qr.rollbackTransaction();
			throw e;
		} finally {
			await qr.release();
		}
	}




	/**
	 * Get products with pagination
	 * @param {number} page - The page number (1-based)
	 * @param {number} limit - Number of items per page
	 * @returns {Promise<PagingResponseDto<ProductEntityResponseDto>>} Paginated list of products
	 * @author Nhut Tan
	 * @since 2025-09-15
	 * @modifies 2025-09-17
	 * @version 1.0.0
	 */
	async getProductsPaging(
		page: number,
		limit: number
	): Promise<PagingResponseDto<ProductEntityResponseDto>> {
		try {
			/**
			 * Calculate skip and take
			 */
			const skip: number = this.buildPagingMetaService.calculateSkip(
				page,
				limit
			);

			/*
             * Calling `getProductsPaging` from `ProductRepository`
             */
			const [products, total]: [ProductEntity[], number] =
				await this.productRepository.getProductsPaging(limit, skip);

			/*
             * Convert `ProductEntity` to `ProductEntityResponseDto`
             */
			const productResponse: ProductEntityResponseDto[] =
				this.productMapper.toProductEntityListResponseDto(products);

			/**
			 * Build pagination response
			 */
			return this.buildPagingMetaService.buildPagingResponse(
				productResponse,
				page,
				limit,
				total
			);
		} catch (e) {
			this.logger.error(
				`Error in \`getProductsPaging\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
}