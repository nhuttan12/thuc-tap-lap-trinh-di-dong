/**
 * @description GetBrandsWithLimitationRequestDto
 * @author Nhut Tan
 * @since 2025-12-11
 * @modifies 2025-12-26
 * @version 1.0.1
 */

import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { BrandStatusCode } from '../status-code/brand.status-code';
import { Type } from 'class-transformer';

export class GetBrandsWithLimitationRequestDto {
	@Type(() => Number)
	@IsNotEmpty({ message: BrandStatusCode.LIMIT_MUST_NOT_BE_EMPTY.customCode })
	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
			maxDecimalPlaces: 0,
		},
		{ message: BrandStatusCode.LIMIT_MUST_BE_NUMBER.customCode }
	)
	@IsInt({ message: BrandStatusCode.LIMIT_MUST_BE_INT.customCode })
	@Min(1, {
		message: BrandStatusCode.LIMIT_MUST_BE_A_POSITIVE_NUMBER.customCode,
	})
	limit: number;
}
