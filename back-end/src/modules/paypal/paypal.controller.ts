import {
	Controller,
	Post,
	Body,
	Get,
	Query,
	Res,
	UseGuards,
	BadRequestException,
	Logger,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';

@Controller('paypal')
export class PaypalController {
	private readonly logger: Logger = new Logger(PaypalController.name);

	constructor(private readonly paypalService: PaypalService) {}

	// ================= CREATE PAYMENT =================
	@UseGuards(JwtAuthGuard)
	@Post('create-order')
	async createOrder(@User() user: JwtPayload) {
		const order = await this.paypalService.createOrder(user.id);

		const approveLink = order.links.find((l) => l.rel === 'approve');

		return {
			approvalUrl: approveLink.href,
		};
	}

	@UseGuards(JwtAuthGuard)
	@Post('capture-order')
	async captureOrder(
		@Body('orderId') orderId: string,
		@User() user: JwtPayload
	) {
		if (!orderId) {
			this.logger.debug(`orderId: ${orderId}`);
			throw new BadRequestException('Missing PayPal orderId');
		}

		// 1️ Capture PayPal
		const capture = await this.paypalService.captureOrder(orderId);
		this.logger.debug(`Capture: ${JSON.stringify(capture, null, 2)}`);

		if (capture.status !== 'COMPLETED') {
			return { success: false };
		}

		//  CHỈ SAVE DB SAU KHI COMPLETED
		await this.paypalService.handlePaypalSuccess(orderId, user.id);

		//  TRẢ JSON OK
		return {
			success: true,
			transactionId: capture.transactionId,
		};
	}
}
