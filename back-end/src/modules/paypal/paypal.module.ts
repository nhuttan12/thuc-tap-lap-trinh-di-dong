import {TypeOrmModule} from "@nestjs/typeorm";
import {PaypalService} from "./paypal.service";
import {Module} from "@nestjs/common";
import {PaymentEntity} from "../payment/entites/payment.entity";
import {PaypalController} from "./paypal.controller";
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderDetailEntity } from '../orders/entities/order-detail.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CartEntity } from '../cart/entities/cart.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentEntity,
			OrderEntity,
			OrderDetailEntity,
			UserEntity,
			CartEntity,]),
    ],
    providers: [PaypalService],
    controllers: [PaypalController],
})
export class PaypalModule {}
