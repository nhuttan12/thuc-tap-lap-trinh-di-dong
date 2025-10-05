/**
 * @description Wishlist controller
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */

import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common'
import { WishlistService } from './wishlist.service'
import { ProductInWishlistResponseDto } from './dtos/product-in-wishlist-response.dto'
import { GetWishlistItemRequestDto } from './dtos/get-wishlist-item-request.dto'
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto'
import { User } from '../user/decorators/user.decorator'
import { JwtPayload } from '../auth/interface/jwt-payload.interface'
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto'
import { WishlistStatusCode } from './status-code/wishlist.status-code'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../role/decorators/role.decorator'
import { RoleName } from '../role/enums/role-name.enum'

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@Roles([RoleName.CUSTOMER])
export class WishlistController {
	private readonly logger: Logger = new Logger(WishlistController.name)

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
		@Body() request: GetWishlistItemRequestDto
	): Promise<
		SuccessResponseDto<PagingResponseDto<ProductInWishlistResponseDto>>
	> {
		/**
		 * Get page and limit from request
		 */
		this.logger.debug(`Request: ${JSON.stringify(request)}`)
		const { page, limit } = request

		const response: PagingResponseDto<ProductInWishlistResponseDto> =
			await this.wishlistService.getProductsInWishlistPaging(
				user.id,
				page,
				limit
			)

		return {
			data: response,
			message: WishlistStatusCode.GetProductsInWishlistSuccess.message,
			statusCode:
				WishlistStatusCode.GetProductsInWishlistSuccess.customCode,
		}
	}

	/**
	 * @description Add product to wishlist
	 * @param {JwtPayload} payload - Get user from token
	 * @param {number} productID - ID of product
	 * @return {boolean}
	 * @author Nhut Tan
	 * @since 2025-09-24
	 * @version 1.0.0
	 */
	@Post()
	async addProductToWishlist(
		@User() payload: JwtPayload,
		@Body() productID: number
	): Promise<SuccessResponseDto<boolean>> {
		/**
		 * Call `addToWishlist` in `WishlistService`
		 */
		const response: boolean = await this.wishlistService.addToWishlist(
			productID,
			payload.id
		)

		return {
			data: response,
			message: WishlistStatusCode.AddProductToWishlistSuccess.message,
			statusCode:
				WishlistStatusCode.AddProductToWishlistSuccess.customCode,
		}
	}

	/**
	 * @description Remove product from wishlist
	 * @param {JwtPayload} payload - Payload from token
	 * @param {number} productID - ID of product
	 * @return {boolean}
	 * @since 2025-09-25
	 * @version 1.0.0
	 */
	@Post()
	async removeWishlistItem(
		@User() payload: JwtPayload,
		productID: number
	): Promise<SuccessResponseDto<boolean>> {
		/**
		 * Call `removeWishlistItem` in `WishlistService`
		 */
		const response: boolean = await this.wishlistService.removeWishlistItem(
			productID,
			payload.id
		)

		return {
			data: response,
			message: WishlistStatusCode.RemoveWishlistItemSuccess.message,
			statusCode: WishlistStatusCode.RemoveWishlistItemSuccess.customCode,
		}
	}
}
