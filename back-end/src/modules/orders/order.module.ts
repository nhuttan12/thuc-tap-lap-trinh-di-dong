/*
 * @description Order module
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {OrderEntity} from "./entities/order.entity";
import {OrderDetailEntity} from "./entities/order-detail.entity";
import {UserModule} from "./../user/user.module";
import { ProductModule } from "../product/product.module";
import {OrderController} from "./order.controller";
import {OrderRepository} from "./repository/order.repository";
import {OrderService} from "./order.service";


@Module({
	imports: [
		TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity]),
		UserModule,
		forwardRef(() => ProductModule),
	],
	controllers: [OrderController],
	providers: [OrderRepository, OrderService],
	exports: [OrderService],
})
export class OrderModule {}
