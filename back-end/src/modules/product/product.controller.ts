/**
 * @description Product controller
 * @author Nhut Tan
 * @since 2025-09-16
 * @modifies 2025-09-17
 * @modifies 2025-12-26
 * @version 1.0.2
 */

import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger, Param, Patch, Post, Put,
    Query, Res, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import {SuccessResponseDto} from '../../common/dtos/response/success-response.dto';
import {PagingResponseDto} from '../../common/helper/dtos/paging-response.dto';
import {GetProductDetailByProductIdRequestDto} from './dtos/get-product-detail-by-product-id-request.dto';
import {ProductEntity} from "./entities/product.entity";
import {UpdateProductAdminDto} from "./dtos/update-product-admin";
import {GetProductsPagingRequest} from './dtos/get-products-paging-request';
import {ProductDetailResponseDto} from './dtos/product-detail-response.dto';
import {ProductEntityResponseDto} from './dtos/product-entity-response.dto';
import {ProductDetailService} from './product-detail.service';
import {ProductService} from './product.service';
import {ProductDetailStatusCode} from './status-code/product-detail.status-code';
import {ProductStatusCode} from './status-code/product.status-code';
import {CreateProductAdminDto} from "./dtos/create-product-admin.dto";
import {validate} from "@nestjs/class-validator";
import {FileInterceptor} from "@nestjs/platform-express";
import {ProductStatusEnum} from "./enums/product-status.enum";

@Controller('products')
export class ProductController {
    private readonly logger: Logger = new Logger(ProductController.name);

    constructor(
        private readonly productService: ProductService,
        private readonly productDetailService: ProductDetailService
    ) {
    }

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
        @Query() request: GetProductsPagingRequest
    ): Promise<
        SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>
    > {
        try {
            this.logger.debug(
                `Get products paging: ${JSON.stringify(request, null, 2)}`
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
                `Get products paging: ${JSON.stringify(products, null, 2)}`
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
     * ADMIN endpoint: Lấy danh sách sản phẩm cho admin
     */
    // @Get('admin')
    // async getProductsForAdmin(
    //     @Query('page') page = 1,
    //     @Query('limit') limit = 10,
    // ): Promise<SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>> {
    //     try {
    //         const currentPage = Number(page) > 0 ? Number(page) : 1;
    //         const currentLimit = Number(limit) > 0 ? Number(limit) : 10;
    //
    //         this.logger.debug(`[ADMIN] Get products: page=${currentPage}, limit=${currentLimit}`);
    //
    //         const products: PagingResponseDto<ProductEntityResponseDto> = await this.productService.getProductsPaging(currentPage, currentLimit);
    //
    //         return {
    //             data: products,
    //             message: ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.message,
    //             statusCode:
    //             ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.customCode,
    //         };
    //     } catch (e) {
    //         this.logger.error(`Error in getProductsForAdmin: ${(e as Error).message}`, (e as Error).stack);
    //         throw e;
    //     }
    // }

    /**
     * @description Get product detail by product ID
     * @param {number} request - Request to get the product detail by product ID
     * @returns {Promise<SuccessResponseDto<ProductDetailResponseDto>>} - Success response
     * @author Nhut Tan
     * @since 2025-09-24
     * @version 1.0.0
     */
    @Get('detail')
    async getProductDetailByProductID(
        @Query() request: GetProductDetailByProductIdRequestDto
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
                `Get product detail by product ID: ${JSON.stringify(productDetail, null, 2)}`
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

    /**
     * Get product detail by ID (public)
     */
    @Get(':id')
    async getProductDetailByProductIDWithParam(
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
    async createProductForAdmin(
        @Body() body: CreateProductAdminDto  // SỬA: Dùng DTO, không phải 'any'
    ): Promise<SuccessResponseDto<any>> {
        try {
            this.logger.debug(`Create product request: ${JSON.stringify(body)}`);

            // Validate
            const errors = await validate(body);
            if (errors.length > 0) {
                this.logger.error(`Validation errors: ${JSON.stringify(errors)}`);
                throw new BadRequestException(errors);
            }

            const createdProduct = await this.productService.createProductAdmin(body);
            return {
                data: createdProduct,
                message: 'Tạo sản phẩm thành công',
                statusCode: 'PRD_ADMIN_003',
            };
        } catch (e) {
            this.logger.error(`Create product error: ${(e as Error).message}`, (e as Error).stack);
            throw e;
        }
    }

    /**
     * ADMIN: Cập nhật sản phẩm
     */
    @Put('admin/:id')
    @HttpCode(HttpStatus.OK)
    async updateProductForAdmin(
        @Param('id') id: number,
        @Body() body: UpdateProductAdminDto
    ): Promise<SuccessResponseDto<ProductEntity>> {  // <-- Sửa type
        const updatedProduct = await this.productService.updateProductAdmin(id, body);
        return {
            data: updatedProduct,  // updatedProduct là ProductEntity
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
                data: {id},
                message: 'Xóa sản phẩm thành công',
                statusCode: 'PRD_ADMIN_005',
            };
        } catch(e) {
            this.logger.error(`Error deleting product: ${e.message}`, e.stack);
            throw e;
        }
    }


    /**
     * ADMIN: Get product detail for admin
     */
    @Get('admin/:id')
    async getProductDetailForAdmin(
        @Param('id') id: number
    ): Promise<SuccessResponseDto<ProductEntity>> {
        try {
            const product = await this.productService.getProductForAdmin(id);
            return {
                data: product,  // product là ProductEntity
                message: 'Lấy chi tiết sản phẩm thành công',
                statusCode: 'PRD_ADMIN_007',
            };
        } catch(e) {
            throw e;
        }
    }


    /**
     * ADMIN: Get products with filter
     */
    @Get('admin')
    async getProductsForAdmin(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
        @Query('category') categoryId?: number,
        @Query('status') status?: string,
    ): Promise<SuccessResponseDto<PagingResponseDto<ProductEntityResponseDto>>> {
        try {
            const currentPage = Number(page) > 0 ? Number(page) : 1;
            const currentLimit = Number(limit) > 0 ? Number(limit) : 10;

            this.logger.debug(`[ADMIN] Get products with filter: page=${currentPage}, limit=${currentLimit}, search=${search}, category=${categoryId}, status=${status}`);

            // TODO: Implement filter logic
            // Tạm thời chỉ dùng getProductsPaging
            const products: PagingResponseDto<ProductEntityResponseDto> =
                await this.productService.getProductsPaging(currentPage, currentLimit);

            return {
                data: products,
                message: ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.message,
                statusCode: ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.customCode,
            };
        } catch (e) {
            this.logger.error(`Error in getProductsForAdmin: ${(e as Error).message}`, (e as Error).stack);
            throw e;
        }
    }

    @Post('admin/:id/images')
    async addProductImage(
        @Param('id') id: number,
        @Body() body: { imageUrls: string[], type: string }
    ): Promise<SuccessResponseDto<any>> {
        // Thêm ảnh cho sản phẩm
    }

    @Get('admin/export')
    async exportProducts(
        @Res() res: Response
    ): Promise<void> {
        // Export sản phẩm ra Excel/CSV
    }

    /**
     * ADMIN: Cập nhật status
     */
    /**
     * ADMIN: Cập nhật status
     */
    @Patch('admin/:id/status')
    @HttpCode(HttpStatus.OK)
    async updateProductStatus(
        @Param('id') id: number,
        @Body('status') status: string
    ): Promise<SuccessResponseDto<ProductEntity>> {
        try {
            const updatedProduct = await this.productService.updateProductStatus(id, status);

            return {
                data: updatedProduct as ProductEntity,
                message: 'Cập nhật trạng thái thành công',
                statusCode: 'PRD_ADMIN_006',
            };
        } catch(e) {
            this.logger.error(`Error updating product status: ${e.message}`, e.stack);
            throw e;
        }
    }
}
