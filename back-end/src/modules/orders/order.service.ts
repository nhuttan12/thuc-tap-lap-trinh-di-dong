import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OrderStatusEnum } from './enums/order-status.enum';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { PaymentEntity } from '../payment/entites/payment.entity';
import { PaymentMethodEnum } from '../payment/enums/payment-method.enum';
import { PaymentStatusEnum } from '../payment/enums/payment-status.enum';
import * as nodemailer from 'nodemailer';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartStatusEnum } from '../cart/enums/cart.status.enum';
import { CartDetailsStatusEnum } from '../cart/enums/cart-details-status.enum';

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name);

	constructor(private readonly dataSource: DataSource) {}

	async createOrderCOD(userId: number) {
		this.logger.debug('USER_ID', userId);
		let savedCart: CartEntity;

		const order = await this.dataSource.transaction(async (manager) => {
			// 1️ USER
			const user = await manager.findOne(UserEntity, {
				where: { id: userId },
			});
			this.logger.debug('USER', user);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			// const existingPendingOrder = await manager.findOne(OrderEntity, {
			// 	where: {
			// 		user: { id: userId },
			// 		status: OrderStatusEnum.PENDING,
			// 	},
			// });
			//
			// if (existingPendingOrder) {
			// 	throw new BadRequestException(
			// 		'You already have a pending order'
			// 	);
			// }

			// 2️ CART
			const cart = await manager.findOne(CartEntity, {
				where: { user: { id: userId }, status: CartStatusEnum.ACTIVE },
				relations: {
					cartDetails: {
						product: true,
					},
				},
			});
			this.logger.debug('CART', cart);
			this.logger.debug('CART DETAILS', cart?.cartDetails);

			if (!cart || cart.cartDetails.length === 0) {
				this.logger.warn(
					'Cart is empty. Order may already be completed.'
				);
				throw new BadRequestException(
					'Cart is empty. Order may already be completed.'
				);
			}

			savedCart = cart;

			// 3️ TOTAL VND
			let totalVnd = 0;
			for (const item of cart.cartDetails) {
				totalVnd += item.quantity * item.product.price;
			}

			const shippingFee = 20000;
			totalVnd += shippingFee;

			// 4️ ORDER
			const order = manager.create(OrderEntity, {
				user,
				price: totalVnd,
				status: OrderStatusEnum.PENDING,
			});
			await manager.save(order);

			// 5️ ORDER DETAILS
			for (const item of cart.cartDetails) {
				await manager.save(
					manager.create(OrderDetailEntity, {
						order,
						product: item.product,
						quantity: item.quantity,
						price: item.product.price,
					})
				);
			}

			// 6️ PAYMENT
			await manager.save(
				manager.create(PaymentEntity, {
					user,
					order,
					amount: totalVnd,
					currency: 'VND',
					paymentMethod: PaymentMethodEnum.COD,
					status: PaymentStatusEnum.PENDING,
				})
			);

			return order;
		});

		// 8️ SEND MAIL (OUTSIDE TRANSACTION)
		try {
			const transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				auth: {
					user: 'taitanvo16@gmail.com',
					pass: 'bkzf ffqo zsfn tijo',
				},
			});

			await transporter.sendMail({
				from: '"E-Commerce App" <no-reply@app.com>',
				to: order.user.email,
				subject: `Xác nhận đơn COD #${order.id}`,
				html: `
					<h3>Cảm ơn bạn đã đặt hàng!</h3>
					<p>Mã đơn: <b>#${order.id}</b></p>
					<p>Tổng tiền: <b>${order.price.toLocaleString()}đ</b></p>
					<p>Thanh toán: <b>COD</b></p>
				`,
			});

			await this.dataSource.transaction(async (manager) => {
				await this.clearCartAfterOrder(manager, savedCart);
			});
		} catch (err) {
			this.logger.error('Send COD mail failed', err);
		}

		this.logger.debug('Order', order);
		return order;
	}

	async clearCartAfterOrder(manager: EntityManager, cart: CartEntity) {
		// 1. Inactive cart details
		for (const item of cart.cartDetails) {
			item.status = CartDetailsStatusEnum.INACTIVE;
			await manager.save(item);
		}

		// 2. Close cart
		cart.status = CartStatusEnum.DELETED;
		await manager.save(cart);
	}
}
