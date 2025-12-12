/**
 * @description GetBrandsWithLimitationRequestDto
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */

import { IsInt, IsNotEmpty, IsNumber, Min } from '@nestjs/class-validator';
import { BrandStatusCode } from '../status-code/brand.status-code';

export class GetBrandsWithLimitationRequestDto {
	@IsNotEmpty({ message: BrandStatusCode.LIMIT_MUST_NOT_BE_EMPTY.customCode })
	@IsNumber({}, { message: BrandStatusCode.LIMIT_MUST_BE_NUMBER.customCode })
	@IsInt({ message: BrandStatusCode.LIMIT_MUST_BE_INT.customCode })
	@Min(1, {
		message: BrandStatusCode.LIMIT_MUST_BE_A_POSITIVE_NUMBER.customCode,
	})
	limit: number;
}
