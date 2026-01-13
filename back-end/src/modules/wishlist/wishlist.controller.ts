/**
 * @description Wishlist controller
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import {
	Body,
	Controller,
	Get,
	Logger,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ProductInWishlistResponseDto } from './dtos/product-in-wishlist-response.dto';
import { GetWishlistItemRequestDto } from './dtos/get-wishlist-item-request.dto';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { WishlistStatusCode } from './status-code/wishlist.status-code';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../role/decorators/role.decorator';
import { RoleName } from '../role/enums/role-name.enum';
import { AddProductToWishlistRequestDto } from './dtos/add-product-to-wishlist-request.dto';
import { RemoveProductFromWishlistDto } from './dtos/remove-product-from-wishlist.dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@Roles([RoleName.CUSTOMER])
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
		@Query() request: GetWishlistItemRequestDto
	): Promise<
		SuccessResponseDto<PagingResponseDto<ProductInWishlistResponseDto>>
	> {
		/**
		 * Get page and limit from request
		 */
		this.logger.debug(`Request: ${JSON.stringify(request, null, 2)}`);
		const { page, limit } = request;

		const response: PagingResponseDto<ProductInWishlistResponseDto> =
			await this.wishlistService.getProductsInWishlistPaging(
				user.id,
				page,
				limit
			);

		return {
			data: response,
			message:
				WishlistStatusCode.GET_PRODUCTS_IN_WISHLIST_SUCCESS.message,
			statusCode:
				WishlistStatusCode.GET_PRODUCTS_IN_WISHLIST_SUCCESS.customCode,
		};
	}

	/**
	 * @description Add product to wishlist
	 * @param {JwtPayload} payload - Get user from token
	 * @param {AddProductToWishlistRequestDto} request - request to remove
	 * wishlist item, it's contain product ID
	 * @return {boolean}
	 * @author Nhut Tan
	 * @since 2025-09-24
	 * @modifies 2026-01-11
	 * @version 1.0.1
	 */
	@Post('add')
	async addProductToWishlist(
		@User() payload: JwtPayload,
		@Body() request: AddProductToWishlistRequestDto
	): Promise<SuccessResponseDto<boolean>> {
		/**
		 * Call `addToWishlist` in `WishlistService`
		 */
		const response: boolean = await this.wishlistService.addToWishlist(
			request.productID,
			payload.id
		);

		return {
			data: response,
			message: WishlistStatusCode.ADD_PRODUCT_TO_WISHLIST_SUCCESS.message,
			statusCode:
				WishlistStatusCode.ADD_PRODUCT_TO_WISHLIST_SUCCESS.customCode,
		};
	}

	/**
	 * @description Remove product from wishlist
	 * @param {JwtPayload} payload - Payload from token
	 * @param {RemoveProductFromWishlistDto} request - request to remove
	 * wishlist item, it's contain product ID
	 * @return {boolean}
	 * @modifies 2026-01-11
	 * @version 1.0.1
	 */
	@Put('remove')
	async removeWishlistItem(
		@User() payload: JwtPayload,
		@Body() request: RemoveProductFromWishlistDto
	): Promise<SuccessResponseDto<boolean>> {
		/**
		 * Call `removeWishlistItem` in `WishlistService`
		 */
		const removeResult: boolean =
			await this.wishlistService.removeProductFromWishlist(
				request.wishlistItemID,
				payload.id
			);
		this.logger.debug(
			`Call \`removeWishlistItem\` in \`WishlistService\`: ${JSON.stringify(removeResult, null, 2)}`
		);

		/**
		 * Create response
		 */
		const response: SuccessResponseDto<boolean> = {
			message: WishlistStatusCode.REMOVE_WISHLIST_ITEM_SUCCESS.message,
			statusCode:
				WishlistStatusCode.REMOVE_WISHLIST_ITEM_SUCCESS.customCode,
			data: removeResult,
		};
		this.logger.debug(
			`Create response: ${JSON.stringify(response, null, 2)}`
		);

		return response;
	}
}
