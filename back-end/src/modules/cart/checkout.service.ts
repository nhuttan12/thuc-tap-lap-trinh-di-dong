import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CheckoutItemResponseDto } from './dtos/checkout-cart.dto';
import { CartDetailsStatusEnum } from './enums/cart-details-status.enum';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(CartDetailEntity)
        private readonly cartDetailRepo: Repository<CartDetailEntity>,
    ) {}

    async getCheckoutItems(userId: number): Promise<CheckoutItemResponseDto[]> {
        const cartDetails = await this.cartDetailRepo.find({
            where: {
                cart: {
                    user: { id: userId },
                },
                status: CartDetailsStatusEnum.ACTIVE,
            },
            relations: {
                product: {
                    productImages: {
                        image: true,
                    },
                },
            },
        });

        return cartDetails.map((cd) => ({
            cartDetailId: cd.id,
            productId: cd.product.id,
            name: cd.product.name,
            imageUrl:
                cd.product.productImages?.[0]?.image?.url ?? '',
            price: cd.product.price,
            discount: cd.product.discount ?? 0,
            quantity: cd.quantity,
            subTotal: cd.quantity * cd.product.price,
        }));
    }
}
