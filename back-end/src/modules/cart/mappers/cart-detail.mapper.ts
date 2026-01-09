/**
 * @description Cart mapper
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { CartDetailEntity } from '../entities/cart-detail.entity';
import { CartDetailResponseDto } from '../dtos/cart-detail-response.dto';
import { ProductImageTypeEnum } from '../../product/enums/product-image-type.enum';
import { ProductImageEntity } from '../../image/entities/product-image.entity';

@Injectable()
export class CartDetailMapper {
	toCartDetailsResponseDto(
		cartDetailsEntity: CartDetailEntity[]
	): CartDetailResponseDto[] {
		return cartDetailsEntity.map(
			(cartDetailEntity: CartDetailEntity): CartDetailResponseDto => {
				return this.toCartDetailResponseDto(cartDetailEntity);
			}
		);
	}

	toCartDetailResponseDto(
		cartDetailEntity: CartDetailEntity
	): CartDetailResponseDto {
		return {
			id: cartDetailEntity.id,
			quantity: cartDetailEntity.quantity,
			discount: cartDetailEntity.product.discount,
			price: cartDetailEntity.product.price,
			name: cartDetailEntity.product.name,
			imageUrl:
				cartDetailEntity.product.productImages.find(
					(productImage: ProductImageEntity): boolean =>
						productImage.type === ProductImageTypeEnum.THUMBNAIL
				)?.image.url ?? '',
		};
	}
}
