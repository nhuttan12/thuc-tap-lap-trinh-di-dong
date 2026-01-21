/*
 * @description Order module
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { UserModule } from './../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './repository/order.repository';
import { OrderService } from './order.service';
import { PaymentEntity } from '../payment/entites/payment.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OrderAdminController } from './order-admin.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			OrderEntity,
			OrderDetailEntity,
			PaymentEntity,
			UserEntity,
		]),
		UserModule,
		forwardRef(() => ProductModule),
	],
	controllers: [OrderController, OrderAdminController],
	providers: [OrderRepository, OrderService],
	exports: [OrderService],
})
export class OrderModule {}
