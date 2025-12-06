/*
 * @description Product service
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 */

import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { DataSource } from 'typeorm';
import {ProductDetailsEntity} from "./entities/product-details.entity";
import {ProductImageEntity} from "../image/entities/product-image.entity";
import { ProductStatusEnum } from './enums/product-status.enum';
import {ProductImageTypeEnum} from "./enums/product-image.type.enum";
import { CategoryEntity } from '../category/entities/category.entity';
import { ImageStatusEnum } from '../image/enums/image-status.enum';
import {ImageEntity} from "../image/entities/image.entity";
@Injectable()
export class ProductService {
	private readonly logger: Logger = new Logger(ProductService.name);

	constructor(
		private dataSource: DataSource,
		private readonly productRepository: ProductRepository,
		private readonly productMapper: ProductMapper,
		private readonly buildPagingMetaService: BuildPagingMetaService

	) {}


	async createProductAdmin(body: any): Promise<ProductEntity> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// 1. Tìm category
			const categoryId = body.productDetailsEntity?.category_id || body.category_id;
			if (!categoryId) throw new Error('category_id is required');

			const category = await queryRunner.manager.findOne(CategoryEntity, {
				where: { id: categoryId },
			});
			if (!category) throw new Error(`Category id=${categoryId} not found`);

			// 2. Tạo Product
			const product = new ProductEntity();
			product.name = body.name;
			product.price = body.price;
			product.discount = body.discount ?? 0;
			product.status = ProductStatusEnum.ACTIVE;

			// 3. Tạo ProductDetails
			const details = new ProductDetailsEntity();
			details.size = body.productDetailsEntity?.size || body.size || 'M';
			details.color = body.productDetailsEntity?.color || body.color || 'Đen';
			details.rating = body.productDetailsEntity?.rating || body.rating || 0;
			details.description = body.productDetailsEntity?.description || body.description || '';
			details.categoryEntity = category;

			//Gán details cho product
			product.productDetailsEntity = details;

			// 4. Tạo ảnh
			if (body.productImages && body.productImages.length > 0) {
				product.productImages = body.productImages.map((img: any) => {
					const pi = new ProductImageEntity();

					const type = img.type?.toUpperCase();
					pi.type =
						type === 'BANNER'
							? ProductImageTypeEnum.BANNER
							: type === 'PRODUCT'
								? ProductImageTypeEnum.PRODUCT
								: ProductImageTypeEnum.THUMBNAIL;

					// Tạo ImageEntity với status
					const imageEntity = new ImageEntity();
					imageEntity.url = img.image?.url || img.url;
					imageEntity.status = ImageStatusEnum.ACTIVE;

					pi.image = imageEntity;


					return pi;
				});
			}

			// 5. Lưu tất cả (cascade sẽ tự lưu details và images)
			const savedProduct = await queryRunner.manager.save(ProductEntity, product);
			await queryRunner.commitTransaction();

			return savedProduct;

		} catch (err) {
			await queryRunner.rollbackTransaction();
			this.logger.error('Create product failed', err);
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

	// UPDATE PRODUCT ADMIN
	async updateProductAdmin(id: number, body: any): Promise<ProductEntity> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Tìm product + load relations
			const product = await queryRunner.manager.findOne(ProductEntity, {
				where: { id },
				relations: ['productDetailsEntity', 'productImages', 'productImages.image'],
			});

			if (!product) throw new Error(`Product id=${id} not found`);

			// Cập nhật thông tin cơ bản
			product.name = body.name ?? product.name;
			product.price = body.price ?? product.price;
			product.discount = body.discount ?? product.discount;

			// Cập nhật ProductDetails
			if (body.productDetailsEntity) {
				if (!product.productDetailsEntity) {
					product.productDetailsEntity = new ProductDetailsEntity();
				}
				const details = product.productDetailsEntity;
				details.size = body.productDetailsEntity.size ?? details.size;
				details.color = body.productDetailsEntity.color ?? details.color;
				details.rating = body.productDetailsEntity.rating ?? details.rating;
				details.description = body.productDetailsEntity.description ?? details.description;

				if (body.productDetailsEntity.category_id) {
					const category = await queryRunner.manager.findOne(CategoryEntity, {
						where: { id: body.productDetailsEntity.category_id },
					});
					if (!category) throw new Error('Category not found');
					details.categoryEntity = category;
				}
			}

			// Cập nhật ảnh: xóa cũ, thêm mới (nếu có)
			if (body.productImages) {
				// Xóa ảnh cũ
				if (product.productImages?.length) {
					await queryRunner.manager.remove(product.productImages);
				}
				// Thêm ảnh mới
				product.productImages = body.productImages.map((img: any) => {
					const pi = new ProductImageEntity();
					const type = img.type?.toUpperCase();
					pi.type =
						type === 'BANNER'
							? ProductImageTypeEnum.BANNER
							: type === 'PRODUCT'
								? ProductImageTypeEnum.PRODUCT
								: ProductImageTypeEnum.THUMBNAIL;

					const imageEntity = new ImageEntity();
					imageEntity.url = img.url || img.image?.url;
					imageEntity.status = ImageStatusEnum.ACTIVE;

					pi.image = imageEntity;
					pi.product = product;
					return pi;
				});
			}

			const updated = await queryRunner.manager.save(ProductEntity, product);
			await queryRunner.commitTransaction();
			return updated;
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

// SOFT DELETE PRODUCT
	async deleteProductAdmin(id: number): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const product = await queryRunner.manager.findOne(ProductEntity, { where: { id } });
			if (!product) throw new Error(`Product id=${id} not found`);

			product.status = ProductStatusEnum.DELETED;
			await queryRunner.manager.save(product);
			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
		}
	}

// UPDATE STATUS (ACTIVE / INACTIVE)
	async updateProductStatus(id: number, status: string): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const product = await queryRunner.manager.findOne(ProductEntity, { where: { id } });
			if (!product) throw new Error(`Product id=${id} not found`);

			if (!Object.values(ProductStatusEnum).includes(status as ProductStatusEnum)) {
				throw new Error('Invalid status');
			}

			product.status = status as ProductStatusEnum;
			await queryRunner.manager.save(product);
			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw err;
		} finally {
			await queryRunner.release();
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
