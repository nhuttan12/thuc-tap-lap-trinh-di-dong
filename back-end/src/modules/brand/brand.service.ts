/**
 * @description Brand service
 * @module BrandModule
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */

import { Injectable, Logger } from '@nestjs/common';
import { BrandEntity } from './entities/brand.entiy';
import { BrandRepository } from './repositories/brand.repository';
import { GetBrandsWithLimitationResponseDto } from './dtos/get-brands-with-limitation-response.dto';
import { BrandMapper } from './mappers/brand.mapper';

@Injectable()
export class BrandService {
	private readonly logger: Logger = new Logger(BrandService.name);

	constructor(
		private readonly brandRepository: BrandRepository,
		private readonly brandMapper: BrandMapper
	) {}

	/**
	 * @description Get all brands with limitation
	 * @param {number} limit - Number of items to take
	 * @return {Promise<BrandEntity[]>} - Array of brands
	 */
	async getAllBrandsWithLimitation(
		limit: number
	): Promise<GetBrandsWithLimitationResponseDto[]> {
		/**
		 * Call `getAllBrandsWithLimitation` function from brand repository
		 */
		const brands: BrandEntity[] =
			await this.brandRepository.getAllBrandsWithLimitation(limit);
		this.logger.debug(
			`Call \`getAllBrandsWithLimitation\` function from brand repository: ${JSON.stringify(brands)}`
		);

		/**
		 * Map brand entities to get brands with limitation response dtos
		 */
		const response: GetBrandsWithLimitationResponseDto[] =
			this.brandMapper.toGetBrandsWithLimitationResponseDtos(brands);
		this.logger.debug(
			`Map brand entities to get brands with limitation response dtos: ${JSON.stringify(response)}`
		);

		return response;
	}
}
