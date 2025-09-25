/*
 * @description user repository
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-24
 * @version 1.0.3
 */

import { ProductEntity } from '../entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ProductStatusEnum } from '../enums/product-status.enum';

export class ProductRepository {
  private readonly logger: Logger = new Logger(ProductRepository.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @description Get products paging
   * @param {number} take - Number of items to take
   * @param {number} skip - Number of items to skip
   * @return {Promise<[ProductEntity[], number]>}
   * @author Nhut Tan
   * @since 2025-09-15
   * @modifies 2025-09-24
   * @version 1.0.1
   */
  async getProductsPaging(
    take: number,
    skip: number,
  ): Promise<[ProductEntity[], number]> {
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
       * Return data
       */
      return [products, total];
    } catch (e) {
      this.logger.error(
        `Error in \`getProductsPaging\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
