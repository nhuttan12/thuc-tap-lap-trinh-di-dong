/**
 * @description Category status code
 * @author Nhut Tan
 * @since 2025-01-01
 * @version 1.0.0
 */

import { HttpStatus } from '@nestjs/common';
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code';

export class CategoryStatusCode extends BaseStatusCode {
	static readonly GET_CATEGORY_BY_NAME_SUCCESS: CategoryStatusCode =
		new CategoryStatusCode(
			HttpStatus.OK,
			'CAT_001',
			'Get category by name success'
		);
	static readonly CREATE_CATEGORY_SUCCESS: CategoryStatusCode =
		new CategoryStatusCode(
			HttpStatus.CREATED,
			'CAT_002',
			'Create category success'
		);
	static readonly CATEGORY_ALREADY_EXISTS: CategoryStatusCode =
		new CategoryStatusCode(
			HttpStatus.CONFLICT,
			'CAT_003',
			'Category already exists'
		);
}
