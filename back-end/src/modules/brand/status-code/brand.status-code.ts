/**
 * @description Brand status code
 * @author Nhut Tan
 * @since 2025-12-11
 * @version 1.0.0
 */

import { HttpStatus } from '@nestjs/common';
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';

export class BrandStatusCode extends BaseStatusCode {
	static readonly LIMIT_MUST_BE_NUMBER: BrandStatusCode = new BrandStatusCode(
		HttpStatus.BAD_REQUEST,
		'BRD_001',
		'Limit must be a number'
	);

	static readonly LIMIT_MUST_BE_INT: BrandStatusCode = new BrandStatusCode(
		HttpStatus.BAD_REQUEST,
		'BRD_002',
		'Limit must be a integer'
	);

	static readonly LIMIT_MUST_NOT_BE_EMPTY: BrandStatusCode =
		new BrandStatusCode(
			HttpStatus.BAD_REQUEST,
			'BRD_003',
			'Limit must not be empty'
		);

	static readonly LIMIT_MUST_BE_A_POSITIVE_NUMBER: BrandStatusCode =
		new BrandStatusCode(
			HttpStatus.BAD_REQUEST,
			'BRD_004',
			'Limit must be a positive number'
		);

	static readonly GET_BRANDS_WITH_LIMITATION_SUCCESS: BrandStatusCode =
		new BrandStatusCode(
			HttpStatus.OK,
			'BRD_005',
			'Get brands with limitation success'
		);
}
