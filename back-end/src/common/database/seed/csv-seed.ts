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
import { ProductImageTypeEnum } from '../../../modules/product/enums/product-image.type.enum';
import { ProductStatusEnum } from '../../../modules/product/enums/product-status.enum';
import { RoleEntity } from '../../../modules/role/entities/role.entity';
import { UserDetailEntity } from '../../../modules/user/entities/user-detail.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { WishlistItemEntity } from '../../../modules/wishlist/entities/wishlist-item.entity';

/**
 * Load environment file before readding env
 */
config({ path: '.env.local' });

/**
 * Csv file path
 */
const csvPath: string = 'D:/TT_Mobile/crawl/giay_adidas.csv';

/**
 * Check exist file path
 */
if (!fs.existsSync(csvPath)) {
	throw new Error(`CSV file not found: ${csvPath}`);
}

/**
 * Normalize brand in csv file
 * @param {string} value - brand om csv file
 * @returns {string}
 */
function normalizeBrand(value: string): string {
	return value.trim().toLowerCase();
}

/**
 * Convert from normalize string to title case
 * @param {string} value - normalize string
 * @returns {string}
 */
function toTitleCase(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Brand image map
 */
const BRAND_IMAGE_MAP: Record<string, string> = {
	adidas: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053803/cat1_pybagd.png',
	puma: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat3_ascjfk.png',
	lacoste:
		'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat6_ceycg7.png',
	reebok: 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat5_zivadi.png',
	horizontal:
		'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053805/cat4_r061f5.png',
};

/**
 * Supported product colors which not exist in csv file when data was crawleds
 */
const SAMPLE_COLORS: string[] = [
	'Black',
	'White',
	'Red',
	'Blue',
	'Green',
	'Gray',
	'Beige',
	'Brown',
	'Navy',
	'Yellow',
];

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
		BrandEntity,
		WishlistItemEntity,
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

/**
 * Generate random number larger than one specified number
 * @param min - number like minimum milestone for quantity
 * @returns {number}
 */
function generateRandomNumberLargerThanOneNumber(min: number): number {
	const randomQuantity: number = Math.floor(Math.random() * 10);

	if (randomQuantity < min) {
		return generateRandomNumberLargerThanOneNumber(min);
	} else {
		return randomQuantity;
	}
}

/**
 * Generate color for each product so that each product has at least 3 colors,
 * and each of them have random color quantity
 * @param min - minimum color quantity
 * @returns {Set<string>}
 */
function generateProductColors(min: number = 3): Set<string> {
	/**
	 * Random quantity of colors for each product
	 */
	const randomColorQuantity: number =
		generateRandomNumberLargerThanOneNumber(min);

	const response: Set<string> = new Set<string>();

	while (response.size < randomColorQuantity) {
		/**
		 * Random number order from 0 to 9 in color picking
		 */
		const colorPickedNo: number = Math.floor(
			Math.random() * SAMPLE_COLORS.length
		);

		/**
		 * Add color picked to set
		 */
		response.add(SAMPLE_COLORS[colorPickedNo]);
	}

	return response;
}

/**
 * Convert array of colors to string
 * @param min - minimum color quantity
 * @returns {string}
 */
function buildColorString(min: number = 3): string {
	return Array.from(generateProductColors(min)).join('; ');
}

/**
 * Convert sizes string from CSV to string with delimiter "; "
 * @param raw - sizes string like "['40','41','42']"
 * @returns {string}
 */
function buildSizeString(raw: string): string {
	const sizes = raw
		.replace('[', '')
		.replace(']', '')
		.replace(/'/g, '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

	return Array.from(new Set(sizes)).join('; ');
}

/**
 * resolve brand image
 * @param {string} brandName - brand name
 * @returns {string}
 */
function resolveBrandImageUrl(brandName: string): string {
	const key = normalizeBrand(brandName);
	const url = BRAND_IMAGE_MAP[key];

	if (!url) {
		throw new Error(`Missing brand image mapping for brand "${brandName}"`);
	}

	return url;
}

/**
 * Convert price string to number
 * @param {string} price - price string
 * @returns {number}
 */
function parsePrice(price: string): number {
	return Number(price.replace(/\./g, '').replace('₫', '').trim());
}

/**
 * Convert image from string to string array
 * @param {string} raw - image string
 * @returns {string[]}
 */
function parseImages(raw: string): string[] {
	return raw
		.split(';')
		.map((url) => url.trim())
		.filter(Boolean);
}

/**
 * Read csv file from specific path
 * @param {string} path - csv file path
 * @returns {CsvRow[]}
 */
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
			const rows = await readCsv(csvPath);

			for (let i = 0; i < rows.length; i++) {
				const row = rows[i];
				logger.log(`[Row ${i + 1}/${rows.length}] ${row.title}`);

				/**
				 * Brand
				 */
				const rawBrandName = row.brand;
				const brandNameForDb = toTitleCase(rawBrandName);
				const brandImageUrl = resolveBrandImageUrl(rawBrandName);

				let brand = await manager.findOne(BrandEntity, {
					where: { name: brandNameForDb },
					relations: { image: true },
				});

				if (!brand) {
					/**
					 * create image first
					 */
					const brandImage = manager.create(ImageEntity, {
						url: brandImageUrl,
						status: ImageStatusEnum.ACTIVE,
					});
					await manager.save(brandImage);

					/**
					 * Create brand with image
					 */
					brand = manager.create(BrandEntity, {
						name: brandNameForDb,
						image: brandImage,
					});

					await manager.save(brand);

					logger.log(
						`Brand created: ${brand.name} (id=${brand.id}, image=${brandImageUrl})`
					);
				} else {
					logger.log(`Brand reused: ${brand.name} (id=${brand.id})`);
				}

				/**
				 * Product
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
				 * Product detail
				 */
				const size: string = buildSizeString(row.sizes);
				const color: string = buildColorString(3);

				const detail = manager.create(ProductDetailsEntity, {
					product,
					size,
					color,
					description: row.description,
					brand,
					rating: 0,
				});

				await manager.save(detail);

				/**
				 * Main image
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
						type: ProductImageTypeEnum.THUMBNAIL,
					})
				);

				/**
				 * Detail image
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
							type: ProductImageTypeEnum.PRODUCT,
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
