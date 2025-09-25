/**
 * @description Cart service
 * @author Nhut Tan
 * @since 2025-09-14
 * @modifies 2025-09-25
 * @version 1.0.1
 */

import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CartRepository } from './repositories/cart.repository';
import { CartEntity } from './entities/cart.entity';
import { CartDetailService } from './cart-detail.service';
import { CartResponseDto } from './dtos/cart-response.dto';
import { CartMapper } from './mappers/cart.mapper';
import { CartStatusCode } from './status-code/cart.status-code';

@Injectable()
export class CartService {
  private readonly logger: Logger = new Logger(CartService.name);

  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartDetailService: CartDetailService,
    private readonly cartMapper: CartMapper,
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
    quantity: number,
  ): Promise<CartResponseDto> {
    try {
      /**
       * Get cart by user ID and ACTIVE status
       */
      const existingCartEntity: CartEntity | null =
        await this.cartRepository.getActiveCartByUserID(userID);
      this.logger.debug(
        `Get cart by user ID and ACTIVE status: ${JSON.stringify(existingCartEntity)}`,
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
          `New cart entity created: ${JSON.stringify(newCartEntity)}`,
        );

        /**
         * Create new cart detail with product ID and cart ID above and quantity
         */
        await this.cartDetailService.createNewCartDetail(
          productID,
          newCartEntity.id,
          quantity,
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
            statusCode: CartStatusCode.CART_NOT_FOUND.customCode,
            customCode: CartStatusCode.CART_NOT_FOUND.customCode,
          });
        }

        /**
         * Mapping `CartEntity` to `CartResponseDto` and return
         */
        return this.cartMapper.toCartResponseDto(newCartAfterCreated);
      } else {
        /**
         * If cart already exist, adding new cart detail to existing cart
         */
        await this.cartDetailService.createNewCartDetail(
          productID,
          existingCartEntity.id,
          quantity,
        );

        /**
         * Get new cart after adding new cart detail to existing cart
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
            statusCode: CartStatusCode.CART_NOT_FOUND.customCode,
            customCode: CartStatusCode.CART_NOT_FOUND.customCode,
          });
        }

        /**
         * Mapping `CartEntity` to `CartResponseDto` and return
         */
        return this.cartMapper.toCartResponseDto(newCartAfterCreated);
      }
    } catch (e) {
      this.logger.error(
        `Error in \`addProductToCart\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
