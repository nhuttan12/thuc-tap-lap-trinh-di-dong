/**
 * @description Brand controller
 * @module BrandModule
 * @author Nhut Tan
 * @since 2025-12-12
 * @modifies 2025-12-13
 * @version 1.0.1
 */

import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetBrandsWithLimitationRequestDto } from './dtos/get-brands-with-limitation-request.dto';
import { GetBrandsWithLimitationResponseDto } from './dtos/get-brands-with-limitation-response.dto';
import { BrandService } from './brand.service';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { BrandStatusCode } from './status-code/brand.status-code';

@Controller('brands')
export class BrandController {
	private readonly logger = new Logger(BrandController.name);

	constructor(private readonly brandService: BrandService) {}

	@Get()
	async getBrandsWithLimitation(
		@Query() request: GetBrandsWithLimitationRequestDto
	): Promise<SuccessResponseDto<GetBrandsWithLimitationResponseDto[]>> {
		/**
		 * Get all brands with limitation from brand service
		 */
		const reponse: GetBrandsWithLimitationResponseDto[] =
			await this.brandService.getAllBrandsWithLimitation(request.limit);
		this.logger.debug(
			`Get all brands with limitation from brand service: ${JSON.stringify(reponse)}`
		);

		return new SuccessResponseDto<GetBrandsWithLimitationResponseDto[]>(
			BrandStatusCode.GET_BRANDS_WITH_LIMITATION_SUCCESS.customCode,
			BrandStatusCode.GET_BRANDS_WITH_LIMITATION_SUCCESS.message,
			reponse
		);
	}
}
