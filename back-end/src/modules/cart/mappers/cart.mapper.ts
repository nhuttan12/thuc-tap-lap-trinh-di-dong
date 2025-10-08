/**
 * @description Cart mapper
 * @author Nhut Tan
 * @since 2025-09-25
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { CartEntity } from '../entities/cart.entity';
import { CartResponseDto } from '../dtos/cart-response.dto';
import { CartDetailMapper } from './cart-detail.mapper';
import { CartDetailEntity } from '../entities/cart-detail.entity';
import { CartDetailResponseDto } from '../dtos/cart-detail-response.dto';

@Injectable()
export class CartMapper {
	constructor(private readonly cartDetailMapper: CartDetailMapper) {}

	toCartResponseDto(cartEntity: CartEntity): CartResponseDto {
		return {
			id: cartEntity.id,
			userID: cartEntity.user.id,
			status: cartEntity.status,
			createdAt: cartEntity.createdAt.toString(),
			updatedAt: cartEntity.updatedAt.toString(),
			cartDetails: cartEntity.cartDetails.map(
				(cartDetail: CartDetailEntity): CartDetailResponseDto => {
					return this.cartDetailMapper.toCartDetailResponseDto(
						cartDetail
					);
				}
			),
		};
	}
}
