/*
 * @description Order module
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailEntity } from './entities/order-detail.entity';
import {OrderController} from "./order.controller";
import {PaymentEntity} from "../payment/entites/payment.entity";
import {UserEntity} from "../user/entities/user.entity";
import {OrderService} from "./order.service";

@Module({
	imports: [TypeOrmModule.forFeature([
        OrderEntity,
        OrderDetailEntity,
        PaymentEntity,
        UserEntity,])],
    controllers: [OrderController],
    providers: [OrderService],
	exports: [OrderService],
})
export class OrderModule {}
