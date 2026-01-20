import {TypeOrmModule} from "@nestjs/typeorm";
import {PaypalService} from "./paypal.service";
import {Module} from "@nestjs/common";
import {PaymentEntity} from "../payment/entites/payment.entity";
import {PaypalController} from "./paypal.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentEntity]),
    ],
    providers: [PaypalService],
    controllers: [PaypalController],
})
export class PaypalModule {}
