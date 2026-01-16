import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {OrderEntity} from "../entities/order.entity";
import {OrderDetailEntity} from "../entities/order-detail.entity";
import {UserModule} from "../../user/user.module";
import {ProductModule} from "../../product/product.module";
import {OrderController} from "../controller/order.controller";
import {OrderRepository} from "../repository/order.repository";
import {OrderService} from "../service/order.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity]),
        UserModule,
        ProductModule,
    ],
    controllers: [OrderController],
    providers: [OrderRepository, OrderService],
    exports: [OrderService],
})
export class OrderModule {}