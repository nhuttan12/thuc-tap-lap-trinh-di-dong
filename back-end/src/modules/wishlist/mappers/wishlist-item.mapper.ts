/**
 * @description Wishlist item mapper
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { WishlistItemEntity } from '../entities/wishlist-item.entity';
import { ProductInWishlistResponseDto } from '../dtos/product-in-wishlist-response.dto';

@Injectable()
export class WishlistItemMapper {
  toProductInWishlistListResponseDto(
    wishlistItems: WishlistItemEntity[],
  ): ProductInWishlistResponseDto[] {
    return wishlistItems.map((wishlistItem: WishlistItemEntity) => {
      return {
        id: wishlistItem.id,
        name: wishlistItem.product.name,
        image: wishlistItem.product.productImages[0].image.url,
        price: wishlistItem.product.price,
        discount: wishlistItem.product.discount,
        rating: wishlistItem.product.rating,
        createdAt: wishlistItem.createdAt,
        updatedAt: wishlistItem.updatedAt,
      };
    });
  }
}
