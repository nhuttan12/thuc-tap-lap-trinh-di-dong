
import {  Injectable } from '@nestjs/common';
import {paypalClient} from "./paypal.client";
import * as paypal from '@paypal/checkout-server-sdk';



@Injectable()
export class PaypalService {

    async createOrder(amount : number){
        const client = paypalClient();

        const req = new new paypal.orders.OrdersCreateRequest();
    }

}
