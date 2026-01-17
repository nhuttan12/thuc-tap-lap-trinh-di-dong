/**
 * @description Brand repository
 * @author Nhut Tan
 * @since 2025-12-11
 * @modifies 2026-01-04
 * @version 1.0.1
 */

import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandEntity } from '../entities/brand.entiy';
import { DataSource, Repository } from 'typeorm';

export class BrandRepository {
	private readonly logger: Logger = new Logger(BrandRepository.name);

	/**
	 * @description constructor of user repository class
	 * @author Nhut Tan
	 * @since 2025-09-08
	 * @version 1.0.0
	 */
	constructor(
		@InjectRepository(BrandEntity)
		private readonly brandRepository: Repository<BrandEntity>,
		private readonly dataSource: DataSource
	) {}

	/**
	 * @description Get all brands with limitation
	 * @param {number} limit - Number of items to take
	 * @return {Promise<BrandEntity[]>} - Array of brands
	 */
	async getAllBrandsWithLimitation(limit: number): Promise<BrandEntity[]> {
		/**
		 * Get all brands with limitation from database
		 */
		const brands: BrandEntity[] = await this.brandRepository.find({
			take: limit,
			relations: {
				image: true,
			},
		});
		this.logger.debug(
			`Get all brands with limitation from database: ${JSON.stringify(brands, null, 2)}`
		);

		return brands;
	}
}
