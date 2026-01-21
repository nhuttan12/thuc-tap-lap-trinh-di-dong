import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	// COD
	@Post('cod')
	@UseGuards(JwtAuthGuard)
	async createOrderCOD(@User() user: JwtPayload) {
		return this.orderService.createOrderCOD(user.id);
	}
}
