/**
 * @description Cart controller
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import {
	Body,
	Controller,
	Get,
	Logger,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDetailService } from './cart-detail.service';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { AddProductToCartRequestDto } from './dtos/add-product-to-cart-request.dto';
import { CartResponseDto } from './dtos/cart-response.dto';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';
import { CartStatusCode } from './status-code/cart.status-code';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../role/decorators/role.decorator';
import { RoleName } from '../role/enums/role-name.enum';
import { RemoveFromCartRequestDto } from './dtos/remove-from-cart-request.dto';
import { GetCartByUserIdRequestDto } from './dtos/get-cart-by-user-id-request.dto';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';
import { MessageResponseDto } from '../../common/dtos/response/message-response.dto';

@Controller('carts')
@UseGuards(JwtAuthGuard)
@Roles([RoleName.CUSTOMER])
export class CartController {
	private readonly logger: Logger = new Logger(CartController.name);

	constructor(
		private readonly cartService: CartService,
		private readonly cartDetailService: CartDetailService
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
		@Body() request: AddProductToCartRequestDto
	): Promise<MessageResponseDto<string>> {
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
		await this.cartService.addProductToCart(productID, id, quantity);

		/**
		 * Returning response
		 */
		return new MessageResponseDto<string>(
			CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.customCode,
			CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.message
		);
	}

	@Get()
	async getUserCart(
		@User() payload: JwtPayload,
		@Query() request: GetCartByUserIdRequestDto
	): Promise<SuccessResponseDto<PagingResponseDto<CartDetailResponseDto>>> {
		/**
		 * Call cart detail service to get cart details by user ID
		 */
		const carts: PagingResponseDto<CartDetailResponseDto> =
			await this.cartDetailService.getCartDetailsByUserID(
				payload.id,
				request.page,
				request.limit
			);
		this.logger.debug(
			`Call cart detail service to get cart details by user ID: ${JSON.stringify(carts, null, 2)}`
		);

		/**
		 * Build response
		 */
		const response: SuccessResponseDto<
			PagingResponseDto<CartDetailResponseDto>
		> = {
			data: carts,
			message: CartStatusCode.GET_CART_BY_USER_ID_SUCCESS.message,
			statusCode: CartStatusCode.GET_CART_BY_USER_ID_SUCCESS.customCode,
		};
		this.logger.debug(
			`Build response: ${JSON.stringify(response, null, 2)}`
		);

		/**
		 * Return response
		 */
		return response;
	}

	// @Post('remove')
	// async removeFromCart(
	// 	@User() payload: JwtPayload,
	// 	@Body() request: RemoveFromCartRequestDto
	// ): Promise<SuccessResponseDto<CartResponseDto>> {}
}
