/**
 * @description Product controller
 * @author Nhut Tan
 * @since 2025-09-16
 * @modifies 2025-09-17
 * @version 1.0.1
 */

import {
	Body,
	Controller, Delete,
	Get,
	HttpCode,
	HttpStatus,
	Logger, Param, Patch, Post, Put,
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
import {ProductEntity} from "./entities/product.entity";

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
		@Query('page') page = 1,
		@Query('limit') limit = 10
	): Promise<SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>> {
		try {
			const currentPage = Number(page) > 0 ? Number(page) : 1;
			const currentLimit = Number(limit) > 0 ? Number(limit) : 10;

			this.logger.debug(`[PUBLIC] Get products: page=${currentPage}, limit=${currentLimit}`);

			const products = await this.productService.getProductsPaging(currentPage, currentLimit);

			return {
				data: products,
				message: 'Lấy danh sách sản phẩm thành công',
				statusCode: 'PRD_001',
			};
		} catch (e) {
			this.logger.error(`Error in getProducts: ${(e as Error).message}`, (e as Error).stack);
			throw e;
		}
	}

	/**
	 * ADMIN endpoint: Lấy danh sách sản phẩm cho admin
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

	/**
	 * Get product detail by ID (public)
	 */
	@Get(':id')
	async getProductDetailByProductID(
		@Param('id') productID: number
	): Promise<SuccessResponseDto<ProductDetailResponseDto>> {
		try {
			this.logger.debug(`Get product detail by product ID: ${productID}`);

			const productDetail: ProductDetailResponseDto =
				await this.productDetailService.getProductDetailByProductID(productID);

			return {
				data: productDetail,
				message: 'Lấy chi tiết sản phẩm thành công',
				statusCode: 'PRD_002',
			};
		} catch (e) {
			this.logger.error(`Error in getProductDetailByProductID: ${(e as Error).message}`, (e as Error).stack);
			throw e;
		}
	}

	/**
	 * ADMIN: Tạo sản phẩm mới
	 */

	@Post('admin')
	@HttpCode(HttpStatus.CREATED)
	async createProductForAdmin(@Body() body: any): Promise<{
		data: { id: number };
		message: string;
		statusCode: string
	}> {
		const createdProduct = await this.productService.createProductAdmin(body);
		return {
			data: createdProduct,
			message: 'Tạo sản phẩm thành công',
			statusCode: 'PRD_ADMIN_003',
		};
	}


	/**
	 * ADMIN: Cập nhật sản phẩm
	 */
	@Put('admin/:id')
	@HttpCode(HttpStatus.OK)
	async updateProductForAdmin(
		@Param('id') id: number,
		@Body() body: any
	): Promise<{ data: { id: number }; message: string; statusCode: string }> {  // ← ProductEntity
		const updatedProduct = await this.productService.updateProductAdmin(id, body);
		return {
			data: updatedProduct,
			message: 'Cập nhật sản phẩm thành công',
			statusCode: 'PRD_ADMIN_004',
		};
	}

	/**
	 * ADMIN: Xóa sản phẩm (soft delete)
	 */
	@Delete('admin/:id')
	@HttpCode(HttpStatus.OK)
	async deleteProductForAdmin(
		@Param('id') id: number
	): Promise<SuccessResponseDto<any>> {
		try {
			await this.productService.deleteProductAdmin(id);
			return {
				data: { id },
				message: 'Xóa sản phẩm thành công',
				statusCode: 'PRD_ADMIN_005',
			};
		} catch (e) {
			this.logger.error(`Error deleting product: ${e.message}`, e.stack);
			throw e;
		}
	}

	/**
	 * ADMIN: Cập nhật status
	 */
	@Patch('admin/:id/status')
	@HttpCode(HttpStatus.OK)
	@Patch('admin/:id/status')
	@HttpCode(HttpStatus.OK)
	async updateProductStatus(
		@Param('id') id: number,
		@Body('status') status: string
	): Promise<{ data: { id: number }; message: string; statusCode: string }> {
		try {
			const updatedProduct = await this.productService.updateProductStatus(id, status);
			return {
				data: updatedProduct,  // ✅ FULL ProductEntity → UI update ngay!
				message: 'Cập nhật trạng thái thành công',
				statusCode: 'PRD_ADMIN_006',
			};
		} catch (e) {
			throw e;
		}
	}

}
