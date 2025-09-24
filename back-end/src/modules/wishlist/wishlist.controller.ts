/**
 * @description Wishlist controller
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ProductInWishlistResponseDto } from './dtos/product-in-wishlist-response.dto';
import { GetWishlistItemRequestDto } from './dtos/get-wishlist-item-request.dto';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { WishlistStatusCode } from './status-code/wishlist.status-code';

@Controller('wishlist')
export class WishlistController {
  private readonly logger: Logger = new Logger(WishlistController.name);

  constructor(private readonly wishlistService: WishlistService) {}

  /**
   * @description Get all products in wishlist
   * @param {JwtPayload} user - Get user from token
   * @param {GetWishlistItemRequestDto} request - Page and limit
   * @author Nhut Tan
   * @since 2025-09-24
   * @version 1.0.0
   */
  @Get()
  async getAllProductInWishlist(
    @User() user: JwtPayload,
    request: GetWishlistItemRequestDto,
  ): Promise<
    SuccessResponseDto<PagingResponseDto<ProductInWishlistResponseDto>>
  > {
    /**
     * Get page and limit from request
     */
    this.logger.debug(`Request: ${JSON.stringify(request)}`);
    const { page, limit } = request;

    const response: PagingResponseDto<ProductInWishlistResponseDto> =
      await this.wishlistService.getProductsInWishlistPaging(
        user.id,
        page,
        limit,
      );

    return {
      data: response,
      message: WishlistStatusCode.GetProductsInWishlistSuccess.message,
      statusCode: WishlistStatusCode.GetProductsInWishlistSuccess.customCode,
    };
  }
}
