/**
 * @description Product detail status code
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code'
import { HttpStatus } from '@nestjs/common'

export class ProductDetailStatusCode extends BaseStatusCode {
	static readonly PRODUCT_DETAIL_NOT_FOUND: ProductDetailStatusCode =
		new ProductDetailStatusCode(
			HttpStatus.NOT_FOUND,
			'PRD_DTL_001',
			'Product detail not found'
		)
	static readonly GET_PRODUCT_DETAIL_BY_PRODUCT_ID_SUCCESS: ProductDetailStatusCode =
		new ProductDetailStatusCode(
			HttpStatus.OK,
			'PRD_DTL_002',
			'Get product detail by product ID success'
		)
}
