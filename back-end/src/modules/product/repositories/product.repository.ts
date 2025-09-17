/*
 * @description: user repository
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-15
 * @version: 1.0.2
 * */

import { ProductEntity } from '../entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ProductStatusEnum } from '../enums/product-status.enum';
import { BuildPagingMetaService } from '../../../common/helper/build-paging-meta.service';
import { PagingResponseDto } from '../../../common/helper/dtos/paging-response.dto';

export class ProductRepository {
  private readonly logger: Logger = new Logger(ProductRepository.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
    private readonly buildPagingMetaService: BuildPagingMetaService,
  ) {}

  /*
   * @description: Get products paging
   * @param {take: number, skip: number}
   * @return {PagingResponseDto<ProductEntity>}
   * @author: Nhut Tan
   * @date: 2025-09-15
   * @version: 1.0.0
   * */
  async getProductsPaging(
    take: number,
    skip: number,
  ): Promise<PagingResponseDto<ProductEntity>> {
    try {
      /**
       * Get products from database
       */
      const [products, total] = await this.productRepository.findAndCount({
        where: {
          status: ProductStatusEnum.ACTIVE,
        },
        relations: {
          productImages: {
            image: true,
          },
        },
        take,
        skip,
        order: {
          createdAt: 'DESC',
        },
      });
      this.logger.debug(
        `Get products paging from database: ${JSON.stringify(products)}`,
      );

      /**
       * Build paging response
       */
      return this.buildPagingMetaService.buildPagingResponse(
        products,
        skip,
        take,
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
