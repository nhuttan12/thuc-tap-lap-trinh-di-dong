import {
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ) {}

    // COD
    @UseGuards(JwtAuthGuard)
    @Post('cod')
    async createOrderCOD(
        @User() user: JwtPayload,
    ) {
        const order = await this.orderService.createOrderCOD(user.id);

        return {
            orderId: order.id,
            message: 'Đã tạo đơn hàng COD',
        };
    }
}
