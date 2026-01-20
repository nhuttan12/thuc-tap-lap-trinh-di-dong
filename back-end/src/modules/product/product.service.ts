/*
 * @description Product service
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 */

import {
	Injectable,
	Logger,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ProductRepository } from './repositories/product.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { ProductDetailRepository } from './repositories/product-detail.repository';
import { ProductDetailsEntity } from './entities/product-details.entity';
import { ProductImageEntity } from '../image/entities/product-image.entity';
import { ProductStatusEnum } from './enums/product-status.enum';
import { CategoryEntity } from '../category/entities/category.entity';
import { ImageStatusEnum } from '../image/enums/image-status.enum';
import { ImageEntity } from '../image/entities/image.entity';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import { CategoryStatusEnum } from '../category/enums/category-status.enum';
import { ProductStatusCode } from './status-code/product.status-code';
import { BrandEntity } from '../brand/entities/brand.entiy';
import { UpdateProductAdminDto } from './dtos/update-product-admin';
import { InjectDataSource } from '@nestjs/typeorm';
import { ProductAdminEntityResponseDto } from './dtos/product-admin-entity-response.dto';

@Injectable()
export class ProductService {
	private readonly logger: Logger = new Logger(ProductService.name);

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		private readonly productRepository: ProductRepository,
		private readonly productMapper: ProductMapper,
		private readonly buildPagingMetaService: BuildPagingMetaService,
		private readonly productDetailRepository: ProductDetailRepository
	) {}

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
				const category = await qr.manager.findOne(CategoryEntity, {
					where: {
						id: categoryId,
						status: CategoryStatusEnum.ACTIVE,
					},
				});
				if (!category) {
					throw new BadRequestException(
						`Category id=${categoryId} not found or inactive`
					);
				}
			}

			// 2. VALIDATE BRAND
			const brandId = body.brand_id;
			let validBrandId = null;
			if (brandId) {
				const brand = await qr.manager.findOne(BrandEntity, {
					where: { id: brandId },
				});
				if (!brand) {
					throw new BadRequestException(
						`Brand id=${brandId} not found`
					);
				}
				validBrandId = brandId;
			}

			// 3. INSERT PRODUCT
			const productResult = await qr.manager
				.createQueryBuilder()
				.insert()
				.into(ProductEntity)
				.values({
					name: body.name,
					price: Number(body.price),
					discount: body.discount ?? 0,
					status: body.status ?? ProductStatusEnum.ACTIVE,
				})
				.execute();

			const productId = productResult.identifiers[0].id;
			let sizeValue = this.formatSizeForDB(body.size);
			let colorValue = this.formatColorForDB(body.color);

			// 4. INSERT DETAILS - ĐÚNG FORMAT
			await qr.manager.query(
				`
            INSERT INTO product_details 
            (id, size, color, description, rating, category_id, brand_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `,
				[
					productId,
					sizeValue, // Đã format đúng
					colorValue, // Đã format đúng
					body.description ?? '',
					body.rating ?? 0,
					categoryId || null,
					validBrandId || null,
				]
			);

			await qr.commitTransaction();

			const result = await qr.manager.findOneOrFail(ProductEntity, {
				where: { id: productId },
				relations: [
					'productDetailsEntity',
					'productDetailsEntity.categoryEntity',
					'productDetailsEntity.brandEntity',
				],
			});

			return result as ProductEntity; // <-- THÊM TYPE CASTING
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
	// Trong product.service.ts - updateProductAdmin
	async updateProductAdmin(
		id: number,
		body: UpdateProductAdminDto
	): Promise<ProductEntity> {
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();

		try {
			// 1. UPDATE PRODUCT (basic info)
			const productUpdate: any = {};
			if (body.name !== undefined) productUpdate.name = body.name;
			if (body.price !== undefined)
				productUpdate.price = Number(body.price);
			if (body.discount !== undefined)
				productUpdate.discount = Number(body.discount);
			if (body.status !== undefined) productUpdate.status = body.status;

			if (Object.keys(productUpdate).length > 0) {
				await qr.manager.update(ProductEntity, id, productUpdate);
			}

			let sizeVal =
				body.size !== undefined ? this.formatSizeForDB(body.size) : '';
			let colorVal =
				body.color !== undefined
					? this.formatColorForDB(body.color)
					: '';

			const descVal = body.description ?? '';
			const ratingVal = Number(body.rating ?? 0);
			const catId = body.category_id;
			const brandId = body.brand_id;

			await qr.manager.query(
				`
            UPDATE product_details 
            SET 
                size = COALESCE(NULLIF($1, ''), size),
                color = COALESCE(NULLIF($2, ''), color), 
                description = COALESCE(NULLIF($3, ''), description),
                rating = COALESCE(NULLIF($4, 0), rating),
                category_id = COALESCE($5, category_id),
                brand_id = COALESCE($6, brand_id),
                updated_at = NOW()
            WHERE id = $7
        `,
				[
					sizeVal, // Đã format đúng
					colorVal, // Đã format đúng
					descVal,
					ratingVal,
					catId || null,
					brandId || null,
					id,
				]
			);

			await qr.commitTransaction();

			const result = await qr.manager.findOneOrFail(ProductEntity, {
				where: { id },
				relations: [
					'productDetailsEntity',
					'productDetailsEntity.categoryEntity',
					'productDetailsEntity.brandEntity',
					'productImages',
					'productImages.image',
				],
			});

			return result as ProductEntity; // <-- THÊM TYPE CASTING
		} catch (e) {
			await qr.rollbackTransaction();
			this.logger.error(`Update product ${id} failed:`, e);
			throw e;
		} finally {
			await qr.release();
		}
	}

	async getProductForAdmin(id: number): Promise<ProductEntity> {
		const product = await this.dataSource.manager.findOneOrFail(
			ProductEntity,
			{
				where: { id },
				relations: [
					'productDetailsEntity',
					'productDetailsEntity.categoryEntity',
					'productDetailsEntity.brandEntity',
					'productImages',
					'productImages.image',
				],
			}
		);

		return product as ProductEntity;
	}

	/**
	 * DELETE PRODUCT (ADMIN - Soft delete)
	 */
	async deleteProductAdmin(id: number): Promise<void> {
		try {
			this.logger.debug(`Soft deleting product ${id}`);

			// Check if product exists first
			const product = await this.dataSource.manager.findOne(
				ProductEntity,
				{
					where: { id },
				}
			);

			if (!product) {
				throw new BadRequestException(`Product id=${id} not found`);
			}

			const result = await this.dataSource.manager.update(
				ProductEntity,
				id,
				{ status: ProductStatusEnum.DELETED }
			);

			if (!result.affected) {
				throw new BadRequestException(
					`Failed to delete product id=${id}`
				);
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
	async updateProductStatus(
		id: number,
		status: string
	): Promise<ProductEntity> {
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();

		try {
			if (
				!Object.values(ProductStatusEnum).includes(
					status as ProductStatusEnum
				)
			) {
				throw new BadRequestException('Invalid status');
			}

			// Cập nhật status
			await qr.manager.update(ProductEntity, id, {
				status: status as ProductStatusEnum,
			});

			// Lấy dữ liệu mới
			const result = await qr.manager.findOneOrFail(ProductEntity, {
				where: { id },
				relations: [
					'productDetailsEntity',
					'productDetailsEntity.categoryEntity',
					'productImages',
					'productImages.image',
				],
			});

			await qr.commitTransaction();
			return result as ProductEntity; // <-- THÊM TYPE CASTING
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
	 * @param {number} userID - ID of user, its optional
	 * @returns {Promise<PagingResponseDto<ProductEntityResponseDto>>} Paginated list of products
	 * @author Nhut Tan
	 * @since 2025-09-15
	 * @modifies 2025-09-17
	 * @version 1.0.0
	 */
	async getProductsPaging(
		page: number,
		limit: number,
		userID?: number
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
				await this.productRepository.getProductsPaging(
					limit,
					skip,
					userID
				);

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

	// Thêm vào service hoặc tạo file helper
	private formatSizeForDB(size: any): string {
		if (!size) return '37';

		if (Array.isArray(size)) {
			return size.join('; ');
		}

		if (typeof size === 'string') {
			// Loại bỏ khoảng trắng thừa và format
			const items = size
				.split(/[,;]/)
				.map((item) => item.trim())
				.filter((item) => item !== '');
			return items.join('; ');
		}

		return String(size);
	}

	private formatColorForDB(color: any): string {
		if (!color) return 'Đen';

		if (Array.isArray(color)) {
			return color.join('; ');
		}

		if (typeof color === 'string') {
			const items = color
				.split(/[,;]/)
				.map((item) => item.trim())
				.filter((item) => item !== '');
			return items.join('; ');
		}

		return String(color);
	}
	/**
	 * @description Get product by ID
	 * @param {number} productID - ID of product
	 */
	async getProductByProductID(
		productID: number
	): Promise<ProductEntityResponseDto> {
		/**
		 * Call `getProductByProductID` in product repository
		 */
		const product: ProductEntity | null =
			await this.productRepository.getProductByProductID(productID);
		this.logger.debug(
			`Call \`getProductByProductID\` in product repository ${JSON.stringify(product, null, 2)}`
		);

		if (!product) {
			this.logger.debug(`Product ID ${productID} not found`);
			throw new NotFoundException({
				statusCode: ProductStatusCode.PRODUCT_NOT_FOUND.statusCode,
				customCode: ProductStatusCode.PRODUCT_NOT_FOUND.customCode,
				message: ProductStatusCode.PRODUCT_NOT_FOUND.message,
			});
		}

		return this.productMapper.toProductEntityResponseDto(product);
	}

	/**
	 * @description Get product paging by name
	 * @param productName - Name of product
	 * @param page - Page for pagination
	 * @param limit - Limitation product per page
	 * @param {number} userID - ID of user, its optional
	 * @return {Promise<PagingResponseDto<ProductEntityResponseDto>>}
	 */
	async getProductsPagingByProductName(
		productName: string,
		page: number,
		limit: number,
		userID?: number
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
				await this.productRepository.getProductsPagingByProductName(
					productName,
					limit,
					skip,
					userID
				);

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
				`Error in \`getProductByProductName\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	async getProductsPagingAdmin(
		page: number,
		limit: number,
		userID?: number
	): Promise<PagingResponseDto<ProductAdminEntityResponseDto>> {
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
				await this.productRepository.getProductsPaging(
					limit,
					skip,
					userID
				);

			/*
			 * Convert `ProductEntity` to `ProductEntityResponseDto`
			 */
			const productResponse: ProductAdminEntityResponseDto[] =
				this.productMapper.toProductAdminEntityListResponseDto(
					products
				);

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
