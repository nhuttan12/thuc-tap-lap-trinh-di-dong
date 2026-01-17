/**
 * @description Cart service
 * @author Nhut Tan
 * @since 2025-09-14
 * @modifies 2025-09-25
 * @modifies 2026-01-09
 * @version 1.0.2
 */

import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CartRepository } from './repositories/cart.repository';
import { CartEntity } from './entities/cart.entity';
import { CartDetailService } from './cart-detail.service';
import { CartStatusCode } from './status-code/cart.status-code';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { AuthStatusCode } from '../auth/status-code/auth.status-code';
import { CartResponseDto } from './dtos/cart-response.dto';
import { ProductEntityResponseDto } from '../product/dtos/product-entity-response.dto';
import { UserEntityResponseDto } from '../user/dtos/user-entity-response.dto';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CartService {
	private readonly logger: Logger = new Logger(CartService.name);

	constructor(
		private readonly cartRepository: CartRepository,
		private readonly cartDetailService: CartDetailService,
		private readonly productService: ProductService,
		private readonly userService: UserService
	) {}

	/**
	 * @description Add product to cart, if cart not exist, create new cart
	 * @param {number} productID - ID of product
	 * @param {number} userID - ID of user
	 * @param {number} quantity - Quantity of product
	 * @return {Promise<CartDetailEntity>} - Created cart detail entity
	 * @author Nhut Tan
	 * @since 2025-09-25
	 * @version 1.0.0
	 */
	async addProductToCart(
		productID: number,
		userID: number,
		quantity: number
	): Promise<boolean> {
		try {
			/**
			 * Get cart by user ID and ACTIVE status
			 */
			const existingCartEntity: CartEntity | null =
				await this.getActiveCartByUserIDOrReturnNull(userID);
			this.logger.debug(
				`Get cart by user ID and ACTIVE status: ${JSON.stringify(existingCartEntity, null, 2)}`
			);

			/**
			 * Check if cart entity not exist
			 */
			if (!existingCartEntity) {
				/**
				 * Create new cart with user ID
				 */
				this.logger.log(`Create new cart with user ID: ${userID}`);
				const newCartEntity: CartEntity =
					await this.cartRepository.createCart(userID);
				this.logger.debug(
					`New cart entity created: ${JSON.stringify(newCartEntity, null, 2)}`
				);

				/**
				 * Create new cart detail with product ID and cart ID above and quantity
				 */
				await this.cartDetailService.createNewCartDetail(
					productID,
					newCartEntity.id,
					quantity
				);

				/**
				 * Get cart entity after create new cart and cart detail
				 */
				await this.getActiveCartByUserIDOrThrow(userID);

				return true;
			} else {
				/**
				 * If cart already exist, adding new cart detail to existing cart
				 */
				const cartDetailExistence: CartDetailEntity | null =
					await this.cartDetailService.getCartDetailByCartIDAndProductIDOrNull(
						existingCartEntity.id,
						productID
					);

				/**
				 * Checking cart detail existence in cart,
				 * if not exist, create new cart detail,
				 * if already exist, update quantity
				 */
				if (!cartDetailExistence) {
					await this.cartDetailService.createNewCartDetail(
						productID,
						existingCartEntity.id,
						quantity
					);

					/**
					 * Get new cart after adding new cart detail to existing cart
					 */
					await this.getActiveCartByUserIDOrThrow(userID);
				} else {
					/**
					 * Get cart detail by card ID and product ID
					 */
					const cartDetail: CartDetailEntity =
						await this.cartDetailService.getCartDetailByCartIDAndProductIDOrThrow(
							existingCartEntity.id,
							productID
						);

					/**
					 * Update cart detail with cart ID, product ID, cart detail 's quantity + 1
					 */
					const updateResult: boolean =
						await this.cartDetailService.updateQuantityOfProductInCartDetail(
							existingCartEntity.id,
							productID,
							cartDetail.quantity + 1
						);

					if (!updateResult) {
						throw new ConflictException({
							statusCode:
								CartStatusCode.UPDATE_CART_DETAIL_FAILED
									.statusCode,
							customCode:
								CartStatusCode.UPDATE_CART_DETAIL_FAILED
									.customCode,
							message:
								CartStatusCode.UPDATE_CART_DETAIL_FAILED
									.message,
						});
					}
				}

				return true;
			}
		} catch (e) {
			this.logger.error(
				`Error in \`addProductToCart\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get active by user ID, if not found, return null
	 * @param userID - ID of user to get cart
	 * @return {Promise<CartEntity | null>}
	 */
	async getActiveCartByUserIDOrReturnNull(
		userID: number
	): Promise<CartEntity | null> {
		return await this.cartRepository.getActiveCartByUserID(userID);
	}

	/**
	 * @description Get actvie cart by user ID, if not found, then throw exception
	 * @param userID - ID of user to get cart
	 * @return {Promise<CartEntity>}
	 */
	async getActiveCartByUserIDOrThrow(userID: number): Promise<CartEntity> {
		/**
		 * Call 'getActiveCartByUserID' in 'cartRepository'
		 */
		const cart: CartEntity | null =
			await this.cartRepository.getActiveCartByUserID(userID);
		this.logger.debug(
			`Call 'getActiveCartByUserID' in 'cartRepository': ${JSON.stringify(cart, null, 2)}`
		);

		/**
		 * If cart not exist, then throw
		 */
		if (!cart) {
			this.logger.warn('Cart not found');
			throw new ConflictException({
				message: CartStatusCode.CART_NOT_FOUND.message,
				statusCode: CartStatusCode.CART_NOT_FOUND.statusCode,
				customCode: CartStatusCode.CART_NOT_FOUND.customCode,
			});
		}

		/**
		 * Return cart
		 */
		return cart;
	}

	/**
	 * @description Remove product from cart
	 * @param cartDetailID - ID of cart detail reference to ID of product
	 * @param userID - ID of user's cart
	 */
	async removeProductFromCart(
		cartDetailID: number,
		userID: number
	): Promise<boolean> {
		/**
		 * Get cart detail by cart detail ID and user ID
		 */
		const cartDetail: CartDetailEntity =
			await this.cartDetailService.getCartDetailByCartDetailIDAndUserIDOrThrow(
				cartDetailID,
				userID
			);

		/**
		 * Remove cart detail
		 */
		const updateResult: boolean =
			await this.cartDetailService.removeCartDetailFromCart(
				cartDetail.id,
				userID
			);
		this.logger.debug(`Remove cart detail result: ${updateResult}`);

		return updateResult;
	}
}
