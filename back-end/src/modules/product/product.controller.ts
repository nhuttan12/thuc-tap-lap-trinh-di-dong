/**
 * @description Product controller
 * @author Nhut Tan
 * @since 2025-09-16
 * @modifies 2025-09-17
 * @version 1.0.1
 */

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Logger, Post,
	Query,           // ← Thêm để dùng cho admin endpoint
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import { GetProductsPagingRequest } from './dtos/get-products-paging-request';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { ProductStatusCode } from './status-code/product.status-code';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { ProductDetailService } from './product-detail.service';
import { ProductDetailResponseDto } from './dtos/product-detail-response.dto';
import { ProductDetailStatusCode } from './status-code/product-detail.status-code';
import { GetProductDetailByProductIdRequestDto } from './dtos/get-product-detail-by-product-id-request.dto';

@Controller('products')
export class ProductController {
	private readonly logger: Logger = new Logger(ProductController.name);

	constructor(
		private readonly productService: ProductService,
		private readonly productDetailService: ProductDetailService
	) {}

	/**
	 * @description Get products paging
	 * @param {GetProductsPagingRequest} request - Get products paging request
	 * @returns {Promise<SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>>} - Success response
	 * @author Nhut Tan
	 * @since 2025-09-16
	 * @version 1.0.0
	 */
	@HttpCode(HttpStatus.OK)
	@Get()
	async getProducts(
		@Body() request: GetProductsPagingRequest
	): Promise<
		SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>
	> {
		try {
			this.logger.debug(
				`Get products paging: ${JSON.stringify(request)}`
			);

			/**
			 * Calling `getProductsPaging` from `ProductService`
			 */
			const products: PagingResponseDto<ProductEntityResponseDto> =
				await this.productService.getProductsPaging(
					request.page,
					request.limit
				);
			this.logger.debug(
				`Get products paging from database: ${JSON.stringify(products)}`
			);

			return {
				data: products,
				message: ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.message,
				statusCode:
					ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.customCode,
			};
		} catch (e) {
			this.logger.error(
				`Error in \`getProductsPaging\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get product detail by product ID
	 * @param {number} request - Request to get the product detail by product ID
	 * @returns {Promise<SuccessResponseDto<ProductDetailResponseDto>>} - Success response
	 * @author Nhut Tan
	 * @since 2025-09-24
	 * @version 1.0.0
	 */

	@Get('admin')
	async getProductsForAdmin(
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>> {
		try {
			const currentPage = Number(page) > 0 ? Number(page) : 1;
			const currentLimit = Number(limit) > 0 ? Number(limit) : 10;

			this.logger.debug(`[ADMIN] Get products: page=${currentPage}, limit=${currentLimit}`);

			const products = await this.productService.getProductsPaging(currentPage, currentLimit);

			return {
				data: products,
				message: 'Lấy danh sách sản phẩm cho Admin thành công',
				statusCode: 'PRD_ADMIN_001',
			};
		} catch (e) {
			this.logger.error(`Error in getProductsForAdmin: ${(e as Error).message}`, (e as Error).stack);
			throw e;
		}
	}

	//create product
	@Post('admin')
	@HttpCode(HttpStatus.CREATED)
	async createProductForAdmin(@Body() body: any) {
		return this.productService.createProductAdmin(body);
	}

	//find product
	@Get()
	async getProductDetailByProductID(
		@Body() request: GetProductDetailByProductIdRequestDto
	): Promise<SuccessResponseDto<ProductDetailResponseDto>> {
		try {
			/**
			 * Get productID from the request
			 */
			const { productID } = request;
			this.logger.debug(`Get product detail by product ID: ${productID}`);

			/**
			 * Calling `getProductDetailByProductID` from `ProductDetailService`
			 */
			const productDetail: ProductDetailResponseDto =
				await this.productDetailService.getProductDetailByProductID(
					productID
				);
			this.logger.debug(
				`Get product detail by product ID: ${JSON.stringify(productDetail)}`
			);

			return {
				data: productDetail,
				message:
					ProductDetailStatusCode
						.GET_PRODUCT_DETAIL_BY_PRODUCT_ID_SUCCESS.message,
				statusCode:
					ProductDetailStatusCode
						.GET_PRODUCT_DETAIL_BY_PRODUCT_ID_SUCCESS.customCode,
			};
		} catch (e) {
			this.logger.error(
				`Error in \`getProductDetailByProductID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

}
