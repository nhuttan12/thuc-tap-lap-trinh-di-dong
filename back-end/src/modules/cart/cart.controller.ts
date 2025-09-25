/**
 * @description Cart controller
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDetailService } from './cart-detail.service';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { AddProductToCartRequestDto } from './dtos/add-product-to-cart-request.dto';
import { CartResponseDto } from './dtos/cart-response.dto';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { CartStatusCode } from './status-code/cart.status-code';

@Controller('cart')
export class CartController {
  private readonly logger: Logger = new Logger(CartController.name);

  constructor(
    private readonly cartService: CartService,
    private readonly cartDetailService: CartDetailService,
  ) {}

  /**
   * @description Add product to cart
   * @param {JwtPayload} payload - User payload
   * @param {AddProductToCartRequestDto} request - Add product to cart request
   * @return {Promise<SuccessResponseDto<CartResponseDto>>} - Cart response
   * @author Nhut Tan
   * @since 2025-09-25
   * @version 1.0.0
   */
  @Post('add-to-cart')
  async addProductToCart(
    @User() payload: JwtPayload,
    @Body() request: AddProductToCartRequestDto,
  ): Promise<SuccessResponseDto<CartResponseDto>> {
    /**
     * Get productID and quantity from the request
     */
    const { productID, quantity } = request;

    /**
     * Get user ID from payload
     */
    const { id } = payload;

    /**
     * Calling `addProductToCart` from `CartService`
     */
    const cartResponseDto: CartResponseDto =
      await this.cartService.addProductToCart(productID, id, quantity);

    /**
     * Returning response
     */
    return {
      data: cartResponseDto,
      message: CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.message,
      statusCode: CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.customCode,
    };
  }
}
