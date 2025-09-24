/**
 * @description Cart service
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */

import { Injectable, Logger } from '@nestjs/common';
import { CartRepository } from './repositories/cart.repository';
import { CartEntity } from './entities/cart.entity';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';
import { CartDetailService } from './cart-detail.service';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CartResponseDto } from './dtos/cart-response.dto';

@Injectable()
export class CartService {
  private readonly logger: Logger = new Logger(CartService.name);

  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartDetailService: CartDetailService,
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
       * Check if cart entity exist
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
          this.cartRepository.getActiveCartByUserID(userID);

        /**
         * Mapping `CartEntity` to `CartResponseDto`
         */
        const cartResponseDto: CartResponseDto = this.cartMapper.toCartResponseDto(
          newCartAfterCreated,
        );

        /**
         * Return data
         */
        return cartResponseDto;
      }
    } catch (e) {
      this.logger.error(
        `Error in \`getCartDetailsByUserID\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
