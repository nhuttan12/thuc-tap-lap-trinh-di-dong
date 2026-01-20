import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import axios from "axios";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderDetailEntity} from "../orders/entities/order-detail.entity";
import {OrderEntity} from "../orders/entities/order.entity";
import {PaymentEntity} from "../payment/entites/payment.entity";
import {UserEntity} from "../user/entities/user.entity";
import {CartEntity} from "../cart/entities/cart.entity";
import {DataSource, Repository} from 'typeorm';
import {PaymentMethodEnum} from "../payment/enums/payment-method.enum";
import {PaymentStatusEnum} from "../payment/enums/payment-status.enum";
import {OrderStatusEnum} from "../orders/enums/order-status.enum";


@Injectable()
export class PaypalService {

    constructor(
        private readonly dataSource: DataSource,

        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,

        @InjectRepository(OrderDetailEntity)
        private readonly orderDetailRepo: Repository<OrderDetailEntity>,

        @InjectRepository(PaymentEntity)
        private readonly paymentRepo: Repository<PaymentEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,

        @InjectRepository(CartEntity)
        private readonly cartRepo: Repository<CartEntity>,
    ) {}

    private baseUrl = process.env.PAYPAL_BASE_URL;
    private clientId = process.env.PAYPAL_CLIENT_ID;
    private secret = process.env.PAYPAL_SECRET;

    private async getAccessToken(): Promise<string> {
            const res = await axios.post(
                `${this.baseUrl}/v1/oauth2/token`,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization:
                            'Basic ' +
                            Buffer.from(
                                `${this.clientId}:${this.secret}`,
                            ).toString('base64'),
                    },
                },
            );

            return res.data.access_token;
    }

	async createOrder(userId: number) {
		// 1️ Lấy cart từ DB
		const cart = await this.cartRepo.findOne({
			where: { user: { id: userId } },
			relations: ['cartDetails', 'cartDetails.product'],
		});

		if (!cart || cart.cartDetails.length === 0) {
			throw new BadRequestException('Cart is empty');
		}

		// 2️ Tính total VND
		let totalVnd = 0;
		cart.cartDetails.forEach(item => {
			totalVnd += item.quantity * Number(item.product.price);
		});

		// + ship (nếu có)
		const shippingFee = 20000;
		totalVnd += shippingFee;

		// 3️ Đổi sang USD (sandbox)
		const USD_RATE = 25000;
		const totalUsdString = (totalVnd / USD_RATE).toFixed(2);

		if (Number(totalUsdString) < 0.01) {
			throw new BadRequestException('Invalid total amount');
		}

		console.log('PAYPAL SEND USD:', totalUsdString);

		// 4️ Gọi PayPal
		const token = await this.getAccessToken();

		const res = await axios.post(
			`${this.baseUrl}/v2/checkout/orders`,
			{
				intent: 'CAPTURE',
				purchase_units: [
					{
						amount: {
							currency_code: 'USD',
							value: totalUsdString,
						},
					},
				],
				application_context: {
					return_url: process.env.PAYPAL_RETURN_URL,
					cancel_url: process.env.PAYPAL_CANCEL_URL,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			},
		);

		return res.data;
	}


    async captureOrder(orderId: string) {
        const token = await this.getAccessToken();

        // 1️ Check order status
        const orderRes = await axios.get(
            `${this.baseUrl}/v2/checkout/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (orderRes.data.status !== 'APPROVED') {
            throw new BadRequestException(
                `Order not approved. Status: ${orderRes.data.status}`,
            );
        }

        // 2️ Capture
        const res = await axios.post(
            `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const capture =
            res.data.purchase_units[0].payments.captures[0];

        return {
            paypalOrderId: orderId,
            transactionId: capture.id,
            amount: Number(capture.amount.value),
            currency: capture.amount.currency_code,
            status: res.data.status,
        };
    }




    async handlePaypalSuccess(
        paypalOrderId: string,
        userId: number,
    ): Promise<void> {
        await this.dataSource.transaction(async (manager) => {

            // 1️ VERIFY PAYPAL
            const token = await this.getAccessToken();
            const paypalRes = await axios.get(
                `${this.baseUrl}/v2/checkout/orders/${paypalOrderId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (paypalRes.data.status !== 'COMPLETED') {
                throw new BadRequestException('Paypal order not completed');
            }

            const capture =
                paypalRes.data.purchase_units[0].payments.captures[0];

            const paidUsd = Number(capture.amount.value);
            const currency = capture.amount.currency_code;
            const transactionId = capture.id;

            // 2️ USER
            const user = await manager.findOne(UserEntity, {
                where: { id: userId },
            });
            if (!user) throw new BadRequestException('User not found');

            // 3️ CART
            const cart = await manager.findOne(CartEntity, {
                where: { user: { id: userId } },
                relations: ['cartDetails', 'cartDetails.product'],
            });

            if (!cart || cart.cartDetails.length === 0) {
                throw new BadRequestException('Cart empty');
            }

            // 4️ TOTAL VND
            let totalVnd = 0;
            cart.cartDetails.forEach(item => {
                totalVnd += item.quantity * item.product.price;
            });

            const shippingFee = 20000;
            totalVnd += shippingFee;

            // 5️ CHECK USD
            const USD_RATE = 25000;
            const expectedUsd = Number((totalVnd / USD_RATE).toFixed(2));

            if (expectedUsd !== paidUsd || currency !== 'USD') {
                throw new BadRequestException('Invalid payment amount');
            }

            // 6️ ORDER
            const order = manager.create(OrderEntity, {
                user,
                price: totalVnd,
                status: OrderStatusEnum.COMPLETED,
            });
            await manager.save(order);

            // 7️ ORDER DETAILS
            for (const item of cart.cartDetails) {
                await manager.save(
                    manager.create(OrderDetailEntity, {
                        order,
                        product: item.product,
                        quantity: item.quantity,
                        price: item.product.price,
                    }),
                );
            }

            // 8️ PAYMENT
            await manager.save(
                manager.create(PaymentEntity, {
                    user,
                    order,
                    amount: paidUsd,
                    currency: 'USD',
                    paymentMethod: PaymentMethodEnum.PAYPAL,
                    status: PaymentStatusEnum.COMPLETED,
                    transactionID: transactionId,
                }),
            );

            // 9️ CLEAR CART
            await manager.remove(cart.cartDetails);
        });
    }





}
