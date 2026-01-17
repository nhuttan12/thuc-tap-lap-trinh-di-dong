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
		wishlistItemList: WishlistItemEntity[]
	): ProductInWishlistResponseDto[] {
		return wishlistItemList.map(
			(
				wishlistItem: WishlistItemEntity
			): ProductInWishlistResponseDto => {
				return this.toProductInWishlistResponseDto(wishlistItem);
			}
		);
	}

	toProductInWishlistResponseDto(
		wishlistItem: WishlistItemEntity
	): ProductInWishlistResponseDto {
		return {
			productID: wishlistItem.product.id,
			name: wishlistItem.product.name,
			imageUrl: wishlistItem.product.productImages[0].image.url,
			price: wishlistItem.product.price,
			discount: wishlistItem.product.discount,
			rating: wishlistItem.product.productDetailsEntity.rating,
			createdAt: wishlistItem.createdAt.toString(),
			updatedAt: wishlistItem.updatedAt.toString(),
		};
	}
}
