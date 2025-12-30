/**
 * @description GetBrandsWithLimitationRequestDto
 * @author Nhut Tan
 * @since 2025-12-11
 * @modifies 2025-12-26
 * @version 1.0.1
 */

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { BrandStatusCode } from '../status-code/brand.status-code';

export class GetBrandsWithLimitationRequestDto {
	@Type(() => Number)
	@IsNotEmpty({ message: BrandStatusCode.LIMIT_MUST_NOT_BE_EMPTY.customCode })
	@IsInt({ message: BrandStatusCode.LIMIT_MUST_BE_NUMBER.customCode })
	@Min(1, {
		message: BrandStatusCode.LIMIT_MUST_BE_A_POSITIVE_NUMBER.customCode,
	})
	limit: number;
}
