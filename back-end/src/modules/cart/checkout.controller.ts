/**
 * @description Checkout controller
 * @author Tan Tai
 * @since 2026-01-19
 * @version 1.0.0
 */

import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../role/decorators/role.decorator';
import { RoleName } from '../role/enums/role-name.enum';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { CheckoutService } from './checkout.service';
import { CheckoutItemResponseDto } from './dtos/checkout-cart.dto';
import { SuccessResponseDto } from '../../common/dtos/response/success-response.dto';

@Controller('checkout')
@UseGuards(JwtAuthGuard)
@Roles([RoleName.CUSTOMER])
export class CheckoutController {
	private readonly logger = new Logger(CheckoutController.name);

	constructor(private readonly checkoutService: CheckoutService) {}

	/**
	 * @description Get checkout items from cart
	 */
	@Get()
	async getCheckoutItems(
		@User() payload: JwtPayload
	): Promise<SuccessResponseDto<CheckoutItemResponseDto[]>> {
		const userId = payload.id;

		const items = await this.checkoutService.getCheckoutItems(userId);

		this.logger.debug(
			`Checkout items for user ${userId}: ${JSON.stringify(items, null, 2)}`
		);

		return {
			data: items,
			message: 'Get checkout items successfully',
			statusCode: '200_000',
		};
	}
}
