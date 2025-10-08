/**
 * @description Paging request dto
 * @author Nhut Tan
 * @since 2025-09-15
 * @modifies 2025-09-17
 * @version 1.0.1
 */

import { IsNotEmpty, IsNumber, Min } from '@nestjs/class-validator';
import { PagingStatusCode } from '../status-code/paging.status-code';

export class PagingRequestDto {
	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
			maxDecimalPlaces: 0,
		},
		{ message: PagingStatusCode.PAGE_NUMBER_MUST_BE_POSITIVE.customCode }
	)
	@Min(1, {
		message: PagingStatusCode.PAGE_NUMBER_MUST_BE_A_NUMBER.customCode,
	})
	@IsNotEmpty({
		message: PagingStatusCode.PAGE_NUMBER_MUST_NOT_BE_EMPTY.customCode,
	})
	page: number;

	@IsNumber(
		{
			allowNaN: false,
			allowInfinity: false,
			maxDecimalPlaces: 0,
		},
		{ message: PagingStatusCode.LIMIT_NUMBER_MUST_BE_A_NUMBER.customCode }
	)
	@IsNotEmpty({
		message: PagingStatusCode.LIMIT_NUMBER_MUST_NOT_BE_EMPTY.customCode,
	})
	limit: number;
}
