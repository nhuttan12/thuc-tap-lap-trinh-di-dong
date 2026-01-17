/**
 * @description Paging request dto
 * @author Nhut Tan
 * @since 2025-09-15
 * @modifies 2025-09-17
 * @modifies 2025-12-26
 * @version 1.0.2
 */

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { PagingStatusCode } from '../status-code/paging.status-code';

export class PagingRequestDto {
	@Type(() => Number)
	@IsInt({
		message: PagingStatusCode.PAGE_NUMBER_MUST_BE_POSITIVE.customCode,
	})
	@Min(1, {
		message: PagingStatusCode.PAGE_NUMBER_MUST_BE_A_NUMBER.customCode,
	})
	@IsNotEmpty({
		message: PagingStatusCode.PAGE_NUMBER_MUST_NOT_BE_EMPTY.customCode,
	})
	page: number;

	@Type(() => Number)
	@IsInt({
		message: PagingStatusCode.LIMIT_NUMBER_MUST_BE_A_NUMBER.customCode,
	})
	@IsNotEmpty({
		message: PagingStatusCode.LIMIT_NUMBER_MUST_NOT_BE_EMPTY.customCode,
	})
	limit: number;
}
