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

@Injectable()
export class CartService {
	private readonly logger: Logger = new Logger(CartService.name);

	constructor(
		private readonly cartRepository: CartRepository,
		private readonly cartDetailService: CartDetailService
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
	): Promise<string> {
		try {
			/**
			 * Get cart by user ID and ACTIVE status
			 */
			const existingCartEntity: CartEntity | null =
				await this.cartRepository.getActiveCartByUserID(userID);
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
				const newCartAfterCreated: CartEntity | null =
					await this.cartRepository.getActiveCartByUserID(userID);

				/**
				 * Checking cart existence after created
				 */
				if (!newCartAfterCreated) {
					/**
					 * Logging error and throw exception
					 */
					this.logger.debug('Cart not found after created');
					throw new ConflictException({
						message: CartStatusCode.CART_NOT_FOUND.message,
						statusCode: CartStatusCode.CART_NOT_FOUND.statusCode,
						customCode: CartStatusCode.CART_NOT_FOUND.customCode,
					});
				}

				return CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.customCode;
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
					const newCartAfterCreated: CartEntity | null =
						await this.cartRepository.getActiveCartByUserID(userID);
					this.logger.debug(
						`Get new cart after adding new cart detail to existing cart: ${JSON.stringify(newCartAfterCreated, null, 2)}`
					);

					/**
					 * Checking cart existence after created
					 */
					if (!newCartAfterCreated) {
						/**
						 * Logging error and throw exception
						 */
						this.logger.debug('Cart not found after created');
						throw new ConflictException({
							message: CartStatusCode.CART_NOT_FOUND.message,
							statusCode:
								CartStatusCode.CART_NOT_FOUND.customCode,
							customCode:
								CartStatusCode.CART_NOT_FOUND.customCode,
						});
					}
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

				return CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.customCode;
			}
		} catch (e) {
			this.logger.error(
				`Error in \`addProductToCart\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	// async removeProductFromCart(
	// 	productID: number,
	// 	userID: number
	// ): Promise<CartResponseDto> {
	// 	/**
	// 	 * Check product existence
	// 	 */
	// 	const product: ProductEntityResponseDto =
	// 		await this.productService.getProductByProductID(productID);
	// 	this.logger.debug(
	// 		`Check product existence: ${JSON.stringify(product, null, 2)}`
	// 	);
	//
	// 	/**
	// 	 * Check user existence
	// 	 */
	// 	const user: UserEntityResponseDto =
	// 		await this.userService.getUserByUserID(userID);
	// 	this.logger.debug(
	// 		`Check user existence: ${JSON.stringify(user, null, 2)}`
	// 	);
	//
	// 	/**
	// 	 * Remove cart detail
	// 	 */
	// 	const updateResult: boolean =
	// 		await this.cartDetailService.removeCartDetailFromCart(
	// 			productID,
	// 			car
	// 		);
	// }
}
