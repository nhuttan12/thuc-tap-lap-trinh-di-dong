/**
 * @description Wishlist service
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WishlistItemRepository } from './repositories/wishlist-item.repository';
import { ProductInWishlistResponseDto } from './dtos/product-in-wishlist-response.dto';
import { WishlistItemEntity } from './entities/wishlist-item.entity';
import { WishlistItemMapper } from './mappers/wishlist-item.mapper';
import { WishlistStatusCode } from './status-code/wishlist.status-code';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';

@Injectable()
export class WishlistService {
  private readonly logger: Logger = new Logger(WishlistService.name);

  constructor(
    private readonly wishlistItemRepository: WishlistItemRepository,
    private readonly wishlistItemMapper: WishlistItemMapper,
    private readonly buildPagingMetaService: BuildPagingMetaService,
  ) {}

  /**
   * @description Get all product in wishlist
   * @param {number} userID - ID of user
   * @param {number} page - Page number
   * @param {number} limit - Number of items per page
   * @return {Promise<PagingResponseDto<ProductInWishlistResponseDto>>} - List of products in wishlist
   * @author Nhut Tan
   * @since 2025-09-23
   * @version 1.0.0
   */
  async getProductsInWishlistPaging(
    userID: number,
    page: number,
    limit: number,
  ): Promise<PagingResponseDto<ProductInWishlistResponseDto>> {
    try {
      /**
       * Calculate skip and take
       */
      const skip: number = this.buildPagingMetaService.calculateSkip(
        page,
        limit,
      );

      /**
       * Call `getAllWishlistItems` in `WishlistItemRepository`
       */
      const [wishlistItems, total]: [WishlistItemEntity[], number] =
        await this.wishlistItemRepository.getAllWishlistItems(
          userID,
          skip,
          limit,
        );
      this.logger.debug(
        `Get all wishlist items ${JSON.stringify(wishlistItems)}`,
      );

      /**
       * Convert wishlist items to product in wishlist response dto
       */
      const productsInWishlistResponseDto: ProductInWishlistResponseDto[] =
        this.wishlistItemMapper.toProductInWishlistListResponseDto(
          wishlistItems,
        );
      this.logger.debug(
        `Convert wishlist items to product in wishlist response dto ${JSON.stringify(productsInWishlistResponseDto)}`,
      );

      return this.buildPagingMetaService.buildPagingResponse(
        productsInWishlistResponseDto,
        skip,
        limit,
        total,
      );
    } catch (e) {
      this.logger.error(
        `Error in \`getAllProductInWishlist\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /**
   * @description Add product to wishlist
   * @param {number} productID - ID of product
   * @param {number} userID - ID of user
   * @return {Promise<boolean>} - True if product added to wishlist successfully
   * @author Nhut Tan
   * @date 2025-09-23
   * @version 1.0.0
   */
  async addToWishlist(productID: number, userID: number): Promise<boolean> {
    try {
      /**
       * Check product exist in wishlist
       */
      await this.getProductInWishlistByProductIDAndUserID(productID, userID);

      /**
       * Call `createWishlistItem` in `WishlistItemRepository`
       */
      await this.wishlistItemRepository.createWishlistItem(productID, userID);

      /**
       * If wishlist item created successfully, return true
       */
      return true;
    } catch (e) {
      this.logger.error(
        `Error in \`getAllProductInWishlist\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /**
   * @description Get product in wishlist by product ID and user ID
   * @param {number} productID - ID of product
   * @param {number} userID - ID of user
   * @return {Promise<WishlistItemEntity | null>} - Wishlist item entity if product in wishlist, null otherwise
   * @author Nhut Tan
   * @date 2025-09-23
   * @version 1.0.0
   */
  async getProductInWishlistByProductIDAndUserID(
    productID: number,
    userID: number,
  ): Promise<WishlistItemEntity | null> {
    try {
      /**
       * Call `getWishlistItemByProductIDAndUserID` in `WishlistItemRepository`
       */
      const wishlistItemEntity: WishlistItemEntity | null =
        await this.wishlistItemRepository.getWishlistItemByProductIDAndUserID(
          productID,
          userID,
        );

      /**
       * Check wishlist item exist
       */
      if (wishlistItemEntity) {
        /**
         * Log error, and throwing error
         */
        this.logger.warn('Product already in wishlist');
        throw new BadRequestException({
          statusCode: WishlistStatusCode.ProductAlreadyInWishlist.statusCode,
          customCode: WishlistStatusCode.ProductAlreadyInWishlist.customCode,
          message: WishlistStatusCode.ProductAlreadyInWishlist.message,
        });
      }

      return wishlistItemEntity;
    } catch (e) {
      this.logger.error(
        `Error in \`getProductInWishlistByProductIDAndUserID\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /**
   * @description Remove product from wishlist
   * @param {number} productID - ID of product
   * @param {number} userID - ID of user
   * @return {Promise<boolean>} - True if product removed from wishlist successfully
   * @since 2025-09-24
   * @version 1.0.0
   */
  async removeWishlistItem(
    productID: number,
    userID: number,
  ): Promise<boolean> {
    try {
      /**
       * Call `removeWishlistItem` in `WishlistItemRepository`
       */
      const wishlistItemEntity: WishlistItemEntity | null =
        await this.wishlistItemRepository.removeWishlistItem(productID, userID);

      /**
       * Check if `wishlistItemEntity` is null
       */
      if (!wishlistItemEntity) {
        /**
         * Log error, and throwing error
         */
        this.logger.warn('Product not in wishlist');
        throw new BadRequestException({
          statusCode: WishlistStatusCode.ProductNotInWishlist.statusCode,
          customCode: WishlistStatusCode.ProductNotInWishlist.customCode,
          message: WishlistStatusCode.ProductNotInWishlist.message,
        });
      }

      return true;
    } catch (e) {
      this.logger.error(
        `Error in \`removeWishlistItem\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
