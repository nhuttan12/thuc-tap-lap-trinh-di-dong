/**
 * @description Category repository
 * @author Nhut Tan
 * @since 2026-01-01
 * @version 1.0.0
 */

import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryStatusEnum } from '../enums/category-status.enum';

export class CategoryRepository {
	private readonly logger = new Logger(CategoryRepository.name);
	constructor(
		@InjectRepository(CategoryEntity)
		private readonly categoryRepository: Repository<CategoryEntity>,
		private readonly dataSource: DataSource
	) {}

	/**
	 * Get category by name
	 * @param categoryName - name of category
	 * @returns {Promise<CategoryEntity | null>}
	 */
	async getCategoryByName(
		categoryName: string
	): Promise<CategoryEntity | null> {
		/**
		 * Get category by name
		 */
		const category: CategoryEntity | null =
			await this.categoryRepository.findOne({
				where: {
					name: categoryName,
				},
			});
		this.logger.debug(
			`Get category by name: ${JSON.stringify(category, null, 2)}`
		);

		return category;
	}

	/**
	 * Create creategory with specific name
	 * @param categoryName - specific name of category
	 * @returns {Promise<CategoryEntity>}
	 */
	async createCategory(categoryName: string): Promise<CategoryEntity> {
		return await this.dataSource.transaction(async (tx: EntityManager) => {
			/**
			 * Create category entity
			 */
			const category: CategoryEntity = tx.create(CategoryEntity, {
				name: categoryName,
				status: CategoryStatusEnum.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			/**
			 * Save category
			 */
			return await tx.save(category);
		});
	}
}
