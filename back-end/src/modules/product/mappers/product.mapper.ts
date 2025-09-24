/*
 * @description Product mapper
 * @author Nhut Tan
 * @since 2025-09-15
 * @version 1.0.0
 * */

import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';
import { ProductEntityResponseDto } from '../dtos/product-entity-response.dto';

@Injectable()
export class ProductMapper {
  toProductEntityListResponseDto(
    products: ProductEntity[],
  ): ProductEntityResponseDto[] {
    return products.map((product: ProductEntity) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        imageUrl: product.productImages[0].image.url,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  }
}
