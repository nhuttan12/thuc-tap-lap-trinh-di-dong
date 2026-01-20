import {
	Controller,
	Post,
	Body,
	Get,
	Query,
	Res,
	UseGuards,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { Response } from 'express';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {User} from "../user/decorators/user.decorator";
import {JwtPayload} from "../auth/interface/jwt-payload.interface";


@Controller('paypal')
export class PaypalController {
    constructor(private readonly paypalService: PaypalService) {}

    // ================= CREATE PAYMENT =================
    @UseGuards(JwtAuthGuard)
    @Post('create-order')
    async createPayment(
        @User() user: JwtPayload,
        @Body('totalVnd') totalVnd: number,
    ) {
        // return this.paypalService.createPaypalPayment(
        //     user.id,
        //     totalVnd,
        // );
    }

    // ================= PAYPAL SUCCESS =================
    @Get('success')
    async success(
        @Query('token') paypalOrderId: string,
        @Res() res: Response,
    ) {
        // 1️⃣ Capture PayPal
        // const capture = await this.paypalService.captureOrder(paypalOrderId);

        // if (capture.status !== 'COMPLETED') {
        //     return res.redirect('myapp://paypal-failed');
        // }

        // 2️⃣ Update DB + clear cart
        // await this.paypalService.handlePaypalSuccess(paypalOrderId);

        // 3️⃣ Redirect app
        return res.redirect('myapp://paypal-success');
    }

    // ================= PAYPAL CANCEL =================
    @Get('cancel')
    cancel(@Res() res: Response) {
        return res.redirect('myapp://paypal-cancel');
    }
}
