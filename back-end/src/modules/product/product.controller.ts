/*
 * @description: Product controller
 * @author: Nhut Tan
 * @date: 2025-09-16
 * @version: 1.0.0
 * */

import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import { GetProductsPagingRequest } from './dtos/get-products-paging-request';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { ProductStatusCode } from './status-code/product.status-code';

@Controller('products')
export class ProductController {
  private readonly logger: Logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getProducts(
    request: GetProductsPagingRequest,
  ): Promise<SuccessResponseDto<ProductEntityResponseDto[]>> {
    try {
      this.logger.debug(`Get products paging: ${JSON.stringify(request)}`);

      const products: ProductEntityResponseDto[] =
        await this.productService.getProductsPaging(
          request.page,
          request.limit,
        );
      this.logger.debug(
        `Get products paging from database: ${JSON.stringify(products)}`,
      );

      return {
        data: products,
        message: ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.message,
        statusCode: ProductStatusCode.GET_PRODUCTS_PAGING_SUCCESS.customCode,
      };
    } catch (e) {
      this.logger.error(
        `Error in \`getProductsPaging\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
