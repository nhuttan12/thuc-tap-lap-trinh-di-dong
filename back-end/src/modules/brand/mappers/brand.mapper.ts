/**
 * @description Brand mapper
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { GetBrandsWithLimitationResponseDto } from '../dtos/get-brands-with-limitation-response.dto';
import { BrandEntity } from './../entities/brand.entiy';

@Injectable()
export class BrandMapper {
	toGetBrandsWithLimitationResponseDto(
		brandEntity: BrandEntity
	): GetBrandsWithLimitationResponseDto {
		return {
			id: brandEntity.id,
			title: brandEntity.name,
			picUrl: brandEntity.image.url,
		};
	}

	toGetBrandsWithLimitationResponseDtos(
		brandEntities: BrandEntity[]
	): GetBrandsWithLimitationResponseDto[] {
		return brandEntities.map((brandEntity: BrandEntity) =>
			this.toGetBrandsWithLimitationResponseDto(brandEntity)
		);
	}
}
