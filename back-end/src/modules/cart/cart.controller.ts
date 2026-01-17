/**
 * @description Cart controller
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Post,
	Put,
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
import { RemoveProductFromCartRequestDto } from './dtos/remove-product-from-cart-request.dto';
import { GetCartByUserIdRequestDto } from './dtos/get-cart-by-user-id-request.dto';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';
import { UpdateQuantityCartDetailRequestDto } from './dtos/update-quantity-cart-detail-request.dto';

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
	): Promise<SuccessResponseDto<boolean>> {
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
		const addProductToCartResult: boolean =
			await this.cartService.addProductToCart(productID, id, quantity);

		/**
		 * Returning response
		 */
		return {
			data: addProductToCartResult,
			statusCode: CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.customCode,
			message: CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS.message,
		};
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

	@Delete('remove')
	async removeFromCart(
		@User() payload: JwtPayload,
		@Query() request: RemoveProductFromCartRequestDto
	): Promise<SuccessResponseDto<boolean>> {
		/**
		 * Call 'removeProductFromCart' from 'cartService'
		 */
		const updateResult: boolean =
			await this.cartService.removeProductFromCart(
				request.cartDetailID,
				payload.id
			);
		this.logger.debug(
			`Call 'removeProductFromCart' from 'cartService': ${JSON.stringify(updateResult, null, 2)}`
		);

		/**
		 * Building response to return to api
		 */
		const response: SuccessResponseDto<boolean> = {
			data: updateResult,
			message: CartStatusCode.REMOVE_PRODUCT_FROM_CART_SUCCESS.message,
			statusCode:
				CartStatusCode.REMOVE_PRODUCT_FROM_CART_SUCCESS.customCode,
		};
		this.logger.debug(
			`Building response to return to api: ${JSON.stringify(response, null, 2)}`
		);

		/**
		 * Returning response
		 */
		return response;
	}

	@Put('update')
	async updateQuantityOfCartDetail(
		@User() payload: JwtPayload,
		@Body() request: UpdateQuantityCartDetailRequestDto
	): Promise<SuccessResponseDto<CartDetailResponseDto>> {
		/**
		 * Call 'updateQuantityCartDetail' in 'cartDetailService'
		 */
		const cartDetail: CartDetailResponseDto =
			await this.cartDetailService.updateQuantityCartDetail(
				request.cartDetailID,
				payload.id,
				request.quantity
			);
		this.logger.debug(
			`Call 'updateQuantityCartDetail' in 'cartDetailService': ${JSON.stringify(cartDetail, null, 2)}`
		);

		/**
		 * Build response
		 */
		const response: SuccessResponseDto<CartDetailResponseDto> = {
			message: CartStatusCode.UPDATE_CART_DETAIL_SUCCESS.message,
			statusCode: CartStatusCode.UPDATE_CART_DETAIL_SUCCESS.customCode,
			data: cartDetail,
		};
		this.logger.debug(
			`Building response: ${JSON.stringify(response, null, 2)}`
		);

		return response;
	}
}
