/*
 * @description Product service
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 * */

import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productMapper: ProductMapper,
    private readonly buildPagingMetaService: BuildPagingMetaService,
  ) {}

  /**
   * Get products with pagination
   * @param {number} page - The page number (1-based)
   * @param {number} limit - Number of items per page
   * @returns {Promise<PagingResponseDto<ProductEntityResponseDto>>} Paginated list of products
   * @author Nhut Tan
   * @since 2025-09-15
   * @modifies 2025-09-17
   * @version 1.0.0
   */
  async getProductsPaging(
    page: number,
    limit: number,
  ): Promise<PagingResponseDto<ProductEntityResponseDto>> {
    try {
      /**
       * Calculate skip and take
       */
      const skip: number = this.buildPagingMetaService.calculateSkip(
        page,
        limit,
      );

      /*
       * Calling `getProductsPaging` from `ProductRepository`
       * */
      const [products, total]: [ProductEntity[], number] =
        await this.productRepository.getProductsPaging(limit, skip);

      /*
       * Convert `ProductEntity` to `ProductEntityResponseDto`
       * */
      const productResponse: ProductEntityResponseDto[] =
        this.productMapper.toProductEntityListResponseDto(products);

      /**
       * Build pagination response
       */
      return this.buildPagingMetaService.buildPagingResponse(
        productResponse,
        page,
        limit,
        total,
      );
    } catch (e) {
      this.logger.error(
        `Error in \`getProductsPaging\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
