/**
 * @description Seed csv data into database
 * @author Nhut Tan
 * @since 2025-12-29
 * @version 1.0.0
 */

import { Logger } from '@nestjs/common';
import csv from 'csv-parser';
import { config } from 'dotenv';
import fs from 'fs';
import { env } from 'node:process';
import { DataSource } from 'typeorm';
import { BrandEntity } from '../../../modules/brand/entities/brand.entiy';
import { CartDetailEntity } from '../../../modules/cart/entities/cart-detail.entity';
import { CartEntity } from '../../../modules/cart/entities/cart.entity';
import { CategoryEntity } from '../../../modules/category/entities/category.entity';
import { ImageEntity } from '../../../modules/image/entities/image.entity';
import { ProductImageEntity } from '../../../modules/image/entities/product-image.entity';
import { UserImageEntity } from '../../../modules/image/entities/user-image.entity';
import { ImageStatusEnum } from '../../../modules/image/enums/image-status.enum';
import { OrderDetailEntity } from '../../../modules/orders/entities/order-detail.entity';
import { OrderEntity } from '../../../modules/orders/entities/order.entity';
import { ProductDetailsEntity } from '../../../modules/product/entities/product-details.entity';
import { ProductEntity } from '../../../modules/product/entities/product.entity';
import { ProductStatusEnum } from '../../../modules/product/enums/product-status.enum';
import { RoleEntity } from '../../../modules/role/entities/role.entity';
import { UserDetailEntity } from '../../../modules/user/entities/user-detail.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';

/**
 * Load environment file before readding env
 */
config({ path: '.env.local' });

/**
 * Initial logger
 */
const logger: Logger = new Logger('Seed');

const AppDataSource = new DataSource({
	type: env.DATABASE_TYPE as 'postgres',
	host: env.DATABASE_HOST,
	port: Number(env.DATABASE_PORT),
	username: env.DATABASE_USERNAME,
	password: env.DATABASE_PASSWORD,
	database: env.DATABASE_NAME,
	logging: true,
	synchronize: false,
	entities: [
		ImageEntity,
		RoleEntity,
		UserEntity,
		ProductImageEntity,
		UserImageEntity,
		ProductEntity,
		OrderDetailEntity,
		OrderEntity,
		ProductDetailsEntity,
		CategoryEntity,
		CartEntity,
		CartDetailEntity,
		UserDetailEntity,
	],
});

type CsvRow = {
	title: string;
	url: string;
	image: string;
	sale_price: string;
	original_price: string;
	brand: string;
	sizes: string; // "S,M,L"
	detail_images: string; // "url1|url2|url3"
	description: string;
};

function parsePrice(price: string): number {
	return Number(price.replace(/\./g, '').replace('₫', '').trim());
}

function parseSizes(raw: string): string[] {
	return raw
		.replace('[', '')
		.replace(']', '')
		.replace(/'/g, '')
		.split(',')
		.map((s) => s.trim());
}

function parseImages(raw: string): string[] {
	return raw
		.split(';')
		.map((url) => url.trim())
		.filter(Boolean);
}

function readCsv(path: string): Promise<CsvRow[]> {
	return new Promise((resolve, reject) => {
		const results: CsvRow[] = [];

		fs.createReadStream(path)
			.pipe(csv())
			.on('data', (data) => results.push(data))
			.on('end', () => resolve(results))
			.on('error', reject);
	});
}

export async function csvSeed(): Promise<void> {
	try {
		/**
		 * Initialize database connection
		 */
		await AppDataSource.initialize();
		logger.log('Connected to database...');

		/**
		 * Start transaction
		 */
		await AppDataSource.transaction(async (manager) => {
			const rows = await readCsv('giay_adidas.csv');

			for (let i = 0; i < rows.length; i++) {
				const row = rows[i];
				logger.log(`[Row ${i + 1}/${rows.length}] ${row.title}`);

				/**
				 * BRAND
				 */
				let brand = await manager.findOne(BrandEntity, {
					where: { name: row.brand },
				});

				if (!brand) {
					brand = manager.create(BrandEntity, { name: row.brand });
					await manager.save(brand);

					logger.log(`Brand created: ${brand.name} (id=${brand.id})`);
				} else {
					logger.log(`Brand reused: ${brand.name} (id=${brand.id})`);
				}

				/**
				 * PRODUCT
				 */
				const price = parsePrice(row.original_price);
				const salePrice = parsePrice(row.sale_price);
				const discount =
					price > 0
						? Math.round(((price - salePrice) / price) * 100)
						: 0;

				const product = manager.create(ProductEntity, {
					name: row.title,
					price,
					discount,
					status: ProductStatusEnum.ACTIVE,
				});

				await manager.save(product);

				logger.log(
					`Product inserted: id=${product.id}, name="${product.name}", price=${product.price}, discount=${product.discount}%`
				);
				/**
				 * PRODUCT DETAILS (sizes)
				 */
				const sizes = parseSizes(row.sizes);

				for (const size of sizes) {
					const detail = manager.create(ProductDetailsEntity, {
						product,
						size,
						description: row.description,
						brand,
						rating: 0,
					});

					await manager.save(detail);
				}

				/**
				 * MAIN IMAGE
				 */
				const mainImage = manager.create(ImageEntity, {
					url: row.image,
					status: ImageStatusEnum.ACTIVE,
				});
				await manager.save(mainImage);

				await manager.save(
					manager.create(ProductImageEntity, {
						product,
						image: mainImage,
					})
				);

				/**
				 * DETAIL IMAGES
				 */
				const images = parseImages(row.detail_images);

				for (const imgUrl of images) {
					const img = manager.create(ImageEntity, {
						url: imgUrl,
						status: ImageStatusEnum.ACTIVE,
					});

					await manager.save(img);

					await manager.save(
						manager.create(ProductImageEntity, {
							product,
							image: img,
						})
					);
				}
			}
		});
	} catch (e) {
		console.error('Seeding failed:', e);
	} finally {
		/**
		 * Close database connection
		 */
		logger.log('Close database connection...');
		if (AppDataSource.isInitialized) {
			await AppDataSource.destroy();
		}
	}
}
