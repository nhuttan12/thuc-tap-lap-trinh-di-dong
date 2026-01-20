/*
 * @description Cart module
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CartService } from './cart.service';
import { CartRepository } from './repositories/cart.repository';
import { CartDetailMapper } from './mappers/cart-detail.mapper';
import { CartDetailRepository } from './repositories/cart-detail.repository';
import { CartDetailService } from './cart-detail.service';
import { HelperModule } from '../../common/helper/helper.module';
import { CartMapper } from './mappers/cart.mapper';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { CartController } from './cart.controller';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([CartEntity, CartDetailEntity]),
		HelperModule,
		forwardRef(() => ProductModule),
		UserModule,
	],
	providers: [
		CartService,
		CartDetailService,
		CartRepository,
		CartDetailRepository,
		CartMapper,
		CartDetailMapper,
		CheckoutService,
	],
	exports: [],
	controllers: [CartController, CheckoutController],
})
export class CartModule {}
