/*
 * @description Cart module
 * @author Nhut Tan
 * @since 2025-09-14
 * @version 1.0.0
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartEntity } from './entities/cart.entity'
import { CartDetailEntity } from './entities/cart-detail.entity'
import { CartService } from './cart.service'
import { CartRepository } from './repositories/cart.repository'
import { CartDetailMapper } from './mappers/cart-detail.mapper'
import { CartDetailRepository } from './repositories/cart-detail.repository'
import { CartDetailService } from './cart-detail.service'
import { HelperModule } from '../../common/helper/helper.module'
import { CartMapper } from './mappers/cart.mapper'

@Module({
	imports: [
		TypeOrmModule.forFeature([CartEntity, CartDetailEntity]),
		HelperModule,
	],
	providers: [
		CartService,
		CartDetailService,
		CartRepository,
		CartDetailRepository,
		CartMapper,
		CartDetailMapper,
	],
	exports: [],
	controllers: [],
})
export class CartModule {}
