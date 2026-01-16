/**
 * @description Get products paging by name request
 * @author @nhuttan12
 * @since 2026-01-16
 * @version 1.0.0
 */

import { PagingRequestDto } from '../../../common/dtos/request/paging-request.dto';
import { Type } from 'class-transformer';
import { IsString, Validate } from 'class-validator';
import { ProductStatusCode } from '../status-code/product.status-code';
import { NotUrlValidator } from '../../../common/validator/not-url.validator';

export class GetProductsPagingByNameRequestDto extends PagingRequestDto {
	@Type(() => String)
	@IsString({
		message: ProductStatusCode.PRODUCT_NAME_MUST_BE_STRING.customCode,
	})
	@Validate(NotUrlValidator)
	productName: string;
}
