/**
 * @description Product detail mapper
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */
import { Injectable } from '@nestjs/common';
import { ProductDetailsEntity } from '../entities/product-details.entity';
import { ProductDetailResponseDto } from '../dtos/product-detail-response.dto';
import { ProductImageEntity } from '../../image/entities/product-image.entity';

@Injectable()
export class ProductDetailMapper {
  toProductDetailResponse(
    productDetailEntity: ProductDetailsEntity,
  ): ProductDetailResponseDto {
    return {
      id: productDetailEntity.id,
      name: productDetailEntity.product.name,
      price: productDetailEntity.product.price,
      discount: productDetailEntity.product.discount,
      rating: productDetailEntity.rating,
      size: productDetailEntity.size.split(', '),
      color: productDetailEntity.color,
      description: productDetailEntity.description,
      imageList: productDetailEntity.product.productImages.map(
        (productImageEntity: ProductImageEntity): string => {
          return productImageEntity.image.url;
        },
      ),
    };
  }
}
