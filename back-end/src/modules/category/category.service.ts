/**
 * @description Category service
 * @module CategoryModule
 * @author Nhut Tan
 * @since 2026-01-01
 * @version 1.0.0
 */

import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryEntity } from './entities/category.entity';
import { CategoryStatusCode } from './status-code/category.status-code';

@Injectable()
export class CategoryService {
	private readonly logger = new Logger(CategoryService.name);
	constructor(private readonly categoryRepository: CategoryRepository) {}

	/**
	 * Get category by name
	 * @param categoryName - name of category
	 * @returns {Promise<CategoryEntity | null>}
	 */
	async getCategoryByName(
		categoryName: string
	): Promise<CategoryEntity | null> {
		return await this.categoryRepository.getCategoryByName(categoryName);
	}

	/**
	 * Create category with specific name
	 * @param categoryName - specific name of category
	 * @returns {Promise<CategoryEntity>}
	 */
	async createCategory(categoryName: string): Promise<CategoryEntity> {
		/**
		 * Create category
		 */
		const category: CategoryEntity =
			await this.categoryRepository.createCategory(categoryName);
		this.logger.debug(
			`Created category: ${JSON.stringify(category, null, 2)}`
		);

		/**
		 * Check if category already exists
		 */
		if (!category) {
			throw new ConflictException({
				statusCode:
					CategoryStatusCode.CATEGORY_ALREADY_EXISTS.statusCode,
				customCode:
					CategoryStatusCode.CATEGORY_ALREADY_EXISTS.customCode,
				message: CategoryStatusCode.CATEGORY_ALREADY_EXISTS.message,
			});
		}

		return category;
	}
}
